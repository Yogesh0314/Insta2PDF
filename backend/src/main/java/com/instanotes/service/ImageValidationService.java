package com.instanotes.service;

import com.instanotes.dto.response.ImageValidationResponse;
import com.instanotes.util.ImageFormatUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ImageValidationService {

    public ImageValidationResponse validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new ImageValidationResponse(false, null, null, 0, 0, 0, "Uploaded file is empty.");
        }

        if (!ImageFormatUtils.hasValidImageHeader(file)) {
            return new ImageValidationResponse(
                    false,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getSize(),
                    0,
                    0,
                    "Invalid image format. Supported types: JPEG, PNG, WebP."
            );
        }

        try (InputStream in = file.getInputStream()) {
            BufferedImage img = ImageIO.read(in);
            if (img == null) {
                return new ImageValidationResponse(
                        false,
                        file.getOriginalFilename(),
                        file.getContentType(),
                        file.getSize(),
                        0,
                        0,
                        "Could not decode image binary stream."
                );
            }

            return new ImageValidationResponse(
                    true,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getSize(),
                    img.getWidth(),
                    img.getHeight(),
                    "Image is valid."
            );
        } catch (IOException e) {
            return new ImageValidationResponse(
                    false,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getSize(),
                    0,
                    0,
                    "Failed to read image stream: " + e.getMessage()
            );
        }
    }
}
