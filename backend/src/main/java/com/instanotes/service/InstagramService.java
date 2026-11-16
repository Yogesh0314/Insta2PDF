package com.instanotes.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.instanotes.dto.response.InstagramMediaResponse;
import com.instanotes.exception.InvalidFileException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class InstagramService {

    private static final Logger log = LoggerFactory.getLogger(InstagramService.class);
    private static final Pattern CODE_PATTERN = Pattern.compile("instagram\\.com/(?:p|reel|tv)/([a-zA-Z0-9_-]+)", Pattern.CASE_INSENSITIVE);

    @Value("${instanotes.rapidapi.key}")
    private String rapidApiKey;

    @Value("${instanotes.rapidapi.host}")
    private String rapidApiHost;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String extractShortcode(String urlOrCode) {
        if (urlOrCode == null || urlOrCode.isBlank()) {
            throw new InvalidFileException("URL or shortcode cannot be empty.");
        }
        Matcher matcher = CODE_PATTERN.matcher(urlOrCode.trim());
        if (matcher.find()) {
            return matcher.group(1);
        }
        // If user directly passed shortcode like DbVIomslDzs
        String clean = urlOrCode.trim().replaceAll("[^a-zA-Z0-9_-]", "");
        if (!clean.isEmpty()) {
            return clean;
        }
        throw new InvalidFileException("Could not extract a valid Instagram shortcode from: " + urlOrCode);
    }

    public InstagramMediaResponse fetchCarouselMedia(String instagramUrl) {
        String shortcode = extractShortcode(instagramUrl);
        log.info("Fetching Instagram post media for shortcode: {}", shortcode);

        String targetUrl = "https://" + rapidApiHost + "/api/v1/instagram/media/info?media_id=" + shortcode;

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", rapidApiKey);
        headers.set("x-rapidapi-host", rapidApiHost);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(targetUrl, HttpMethod.GET, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return new InstagramMediaResponse(false, null, null, shortcode, null, "Failed to fetch post: HTTP " + response.getStatusCode());
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode media = root.path("media");

            String caption = media.path("caption").asText(shortcode);
            String author = media.path("user").path("username").asText("instagram_creator");

            List<InstagramMediaResponse.InstagramSlideDto> slides = new ArrayList<>();

            // Check if carousel (edge_sidecar_to_children)
            JsonNode sidecarEdges = media.path("edge_sidecar_to_children").path("edges");
            if (sidecarEdges.isArray() && sidecarEdges.size() > 0) {
                int idx = 1;
                for (JsonNode edge : sidecarEdges) {
                    JsonNode node = edge.path("node");
                    String imgUrl = node.path("display_url").asText(null);
                    int w = node.path("dimensions").path("width").asInt(1080);
                    int h = node.path("dimensions").path("height").asInt(1080);
                    if (imgUrl != null && !imgUrl.isBlank()) {
                        slides.add(new InstagramMediaResponse.InstagramSlideDto(idx++, imgUrl, w, h));
                    }
                }
            } else {
                // Single image or cover
                String displayUrl = media.path("display_url").asText(null);
                if (displayUrl != null && !displayUrl.isBlank()) {
                    slides.add(new InstagramMediaResponse.InstagramSlideDto(1, displayUrl, 1080, 1080));
                }
            }

            if (slides.isEmpty()) {
                return new InstagramMediaResponse(false, caption, author, shortcode, null, "No image slides found in this post.");
            }

            return new InstagramMediaResponse(true, caption, author, shortcode, slides, "Successfully extracted " + slides.size() + " slides.");

        } catch (Exception e) {
            log.error("Error calling RapidAPI for post {}: {}", shortcode, e.getMessage(), e);
            return new InstagramMediaResponse(false, null, null, shortcode, null, "Failed to retrieve media: " + e.getMessage());
        }
    }

    /**
     * Download an image via server-side proxy to circumvent CORS restrictions in user browsers.
     */
    public byte[] proxyDownloadImage(String imageUrl) {
        try {
            return restTemplate.getForObject(URI.create(imageUrl), byte[].class);
        } catch (Exception e) {
            log.error("Failed to proxy image download: {}", e.getMessage());
            throw new InvalidFileException("Could not download Instagram slide image: " + e.getMessage());
        }
    }
}
