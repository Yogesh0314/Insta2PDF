package com.instanotes.service;

import com.instanotes.dto.request.PdfGenerateRequest;
import com.instanotes.exception.InvalidFileException;
import com.instanotes.exception.PdfGenerationException;
import com.instanotes.util.ImageFormatUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Core PDF Generation Service.
 * Leverages Apache PDFBox 3.x and TwelveMonkeys ImageIO for robust image rendering.
 */
@Service
public class PdfGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PdfGenerationService.class);

    public byte[] generatePdf(List<MultipartFile> images, PdfGenerateRequest request) {
        if (images == null || images.isEmpty()) {
            throw new InvalidFileException("At least one image must be provided to generate a PDF.");
        }

        log.info("Generating PDF with {} images. Orientation: {}, FitMode: {}, Margin: {}",
                images.size(), request.getOrientation(), request.getFitMode(), request.getMargin());

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Pre-validate files
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                if (file.isEmpty()) {
                    throw new InvalidFileException("File at index " + i + " is empty: " + file.getOriginalFilename());
                }
                if (!ImageFormatUtils.hasValidImageHeader(file)) {
                    throw new InvalidFileException("File at index " + i + " is not a valid JPEG/PNG/WebP image: " + file.getOriginalFilename());
                }
            }

            // Determine base page dimension (A4)
            boolean isLandscape = "LANDSCAPE".equalsIgnoreCase(request.getOrientation());
            PDRectangle basePageSize = isLandscape ?
                    new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth()) :
                    PDRectangle.A4;

            float margin = Math.max(0, request.getMargin());
            List<Integer> rotations = request.getPageRotations();

            // Process each image onto its own PDF page
            for (int i = 0; i < images.size(); i++) {
                MultipartFile file = images.get(i);
                int rotationDeg = (rotations != null && i < rotations.size() && rotations.get(i) != null)
                        ? rotations.get(i)
                        : 0;

                BufferedImage bufferedImage;
                try (InputStream in = file.getInputStream()) {
                    bufferedImage = ImageIO.read(in);
                } catch (IOException e) {
                    throw new InvalidFileException("Unable to decode image " + file.getOriginalFilename() + ": " + e.getMessage());
                }

                if (bufferedImage == null) {
                    throw new InvalidFileException("Image format not supported or corrupted: " + file.getOriginalFilename());
                }

                // Apply rotation if required
                if (rotationDeg % 360 != 0) {
                    bufferedImage = rotateImage(bufferedImage, rotationDeg);
                }

                PDPage page = new PDPage(basePageSize);
                document.addPage(page);

                PDImageXObject pdImage = LosslessFactory.createFromImage(document, bufferedImage);

                // Compute drawing coordinates with margins and aspect ratio
                float pageWidth = page.getMediaBox().getWidth();
                float pageHeight = page.getMediaBox().getHeight();

                float availableWidth = Math.max(1, pageWidth - (2 * margin));
                float availableHeight = Math.max(1, pageHeight - (2 * margin));

                float imgWidth = pdImage.getWidth();
                float imgHeight = pdImage.getHeight();

                float drawWidth;
                float drawHeight;

                if ("FILL_PAGE".equalsIgnoreCase(request.getFitMode())) {
                    // Fill whole available bounding area
                    drawWidth = availableWidth;
                    drawHeight = availableHeight;
                } else {
                    // FIT_ASPECT (Default): preserve aspect ratio
                    float scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
                    drawWidth = imgWidth * scale;
                    drawHeight = imgHeight * scale;
                }

                // Center image inside the margin box
                float x = margin + ((availableWidth - drawWidth) / 2);
                float y = margin + ((availableHeight - drawHeight) / 2);

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    contentStream.drawImage(pdImage, x, y, drawWidth, drawHeight);
                }
            }

            document.save(out);
            return out.toByteArray();

        } catch (IOException e) {
            log.error("Failed to generate PDF document", e);
            throw new PdfGenerationException("Failed to generate PDF document: " + e.getMessage(), e);
        }
    }

    private BufferedImage rotateImage(BufferedImage source, int angleDegrees) {
        int angle = ((angleDegrees % 360) + 360) % 360;
        if (angle == 0) return source;

        double radians = Math.toRadians(angle);
        double sin = Math.abs(Math.sin(radians));
        double cos = Math.abs(Math.cos(radians));

        int w = source.getWidth();
        int h = source.getHeight();
        int newWidth = (int) Math.floor(w * cos + h * sin);
        int newHeight = (int) Math.floor(h * cos + w * sin);

        int imageType = (source.getType() == BufferedImage.TYPE_CUSTOM || source.getType() == 0)
                ? BufferedImage.TYPE_INT_ARGB
                : source.getType();

        BufferedImage result = new BufferedImage(newWidth, newHeight, imageType);
        java.awt.Graphics2D g2d = result.createGraphics();

        g2d.setRenderingHint(java.awt.RenderingHints.KEY_INTERPOLATION, java.awt.RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(java.awt.RenderingHints.KEY_RENDERING, java.awt.RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON);

        AffineTransform at = new AffineTransform();
        at.translate((newWidth - w) / 2.0, (newHeight - h) / 2.0);
        at.rotate(radians, w / 2.0, h / 2.0);

        g2d.setTransform(at);
        g2d.drawImage(source, 0, 0, null);
        g2d.dispose();

        return result;
    }
}
