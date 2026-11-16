package com.instanotes.controller;

import com.instanotes.dto.request.PdfGenerateRequest;
import com.instanotes.service.PdfGenerationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Controller handling PDF generation requests.
 *
 * Annotations explained:
 * - @RestController: Combines @Controller and @ResponseBody, serializing responses directly into HTTP body.
 * - @RequestMapping("/api/pdf"): Base path mapping for all PDF endpoints.
 * - @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE): Enforces multipart/form-data payload.
 * - @RequestPart: Maps specific multipart boundary parts (files or json blobs) to controller method arguments.
 * - @Valid: Triggers Spring Validation annotations defined on PdfGenerateRequest.
 */
@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    private static final Logger log = LoggerFactory.getLogger(PdfController.class);
    private final PdfGenerationService pdfGenerationService;

    public PdfController(PdfGenerationService pdfGenerationService) {
        this.pdfGenerationService = pdfGenerationService;
    }

    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> generatePdf(
            @RequestPart("images") List<MultipartFile> images,
            @Valid @RequestPart(value = "config", required = false) PdfGenerateRequest config) {

        if (config == null) {
            config = new PdfGenerateRequest("instanotes-document", "PORTRAIT", "FIT_ASPECT", 18.0f, null);
        }

        byte[] pdfBytes = pdfGenerationService.generatePdf(images, config);

        String rawFilename = config.getFilename() != null && !config.getFilename().isBlank()
                ? config.getFilename()
                : "instanotes-document";

        String cleanFilename = rawFilename.endsWith(".pdf") ? rawFilename : rawFilename + ".pdf";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(cleanFilename, StandardCharsets.UTF_8)
                        .build()
        );
        headers.setContentLength(pdfBytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
