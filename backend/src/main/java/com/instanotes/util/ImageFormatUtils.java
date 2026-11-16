package com.instanotes.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

/**
 * File validation utility that inspects both MIME types and binary magic bytes
 * to guard against spoofed files.
 */
public final class ImageFormatUtils {

    private ImageFormatUtils() {}

    public static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    /**
     * Inspect file header magic bytes to verify actual image data.
     */
    public static boolean hasValidImageHeader(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int read = is.read(header, 0, header.length);
            if (read < 4) {
                return false;
            }

            // JPEG magic bytes: FF D8 FF
            if ((header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
                return true;
            }

            // PNG magic bytes: 89 50 4E 47
            if ((header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47) {
                return true;
            }

            // WebP magic bytes: RIFF .... WEBP
            if (read >= 12 &&
                    header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F' &&
                    header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
                return true;
            }

            return false;
        } catch (IOException e) {
            return false;
        }
    }
}
