package com.instanotes.service;

import com.instanotes.dto.request.PdfGenerateRequest;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PdfGenerationServiceTest {

    private final PdfGenerationService service = new PdfGenerationService();

    private MockMultipartFile createSampleImageFile(String name, String format, int width, int height, Color color) throws IOException {
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setColor(color);
        g.fillRect(0, 0, width, height);
        g.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, format, baos);
        return new MockMultipartFile("images", name, "image/" + format.toLowerCase(), baos.toByteArray());
    }

    @Test
    @DisplayName("Should generate valid multi-page PDF with custom margins and orientation")
    void testGeneratePdfSuccess() throws IOException {
        MockMultipartFile img1 = createSampleImageFile("slide1.png", "PNG", 800, 600, Color.RED);
        MockMultipartFile img2 = createSampleImageFile("slide2.jpg", "JPEG", 1080, 1080, Color.BLUE);

        PdfGenerateRequest request = new PdfGenerateRequest(
                "test-notes",
                "PORTRAIT",
                "FIT_ASPECT",
                20.0f,
                List.of(0, 90)
        );

        byte[] pdfBytes = service.generatePdf(List.of(img1, img2), request);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);

        // Verify PDF can be loaded and has 2 pages
        try (PDDocument doc = Loader.loadPDF(pdfBytes)) {
            assertEquals(2, doc.getNumberOfPages());
        }
    }
}
