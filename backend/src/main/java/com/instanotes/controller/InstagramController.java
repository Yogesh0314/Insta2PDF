package com.instanotes.controller;

import com.instanotes.dto.response.InstagramMediaResponse;
import com.instanotes.service.InstagramService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/instagram")
public class InstagramController {

    private final InstagramService instagramService;

    public InstagramController(InstagramService instagramService) {
        this.instagramService = instagramService;
    }

    @PostMapping("/fetch")
    public ResponseEntity<InstagramMediaResponse> fetchInstagramPost(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        InstagramMediaResponse response = instagramService.fetchCarouselMedia(url);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/proxy-image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam("url") String imageUrl) {
        byte[] imageBytes = instagramService.proxyDownloadImage(imageUrl);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return ResponseEntity.ok().headers(headers).body(imageBytes);
    }
}
