package com.instanotes.controller;

import com.instanotes.dto.response.ImageValidationResponse;
import com.instanotes.service.ImageValidationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageValidationService imageValidationService;

    public ImageController(ImageValidationService imageValidationService) {
        this.imageValidationService = imageValidationService;
    }

    @PostMapping(value = "/validate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageValidationResponse> validateImage(@RequestParam("image") MultipartFile image) {
        ImageValidationResponse response = imageValidationService.validateImage(image);
        return ResponseEntity.ok(response);
    }
}
