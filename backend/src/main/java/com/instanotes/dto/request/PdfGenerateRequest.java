package com.instanotes.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

/**
 * Data Transfer Object containing user-selected PDF formatting options.
 */
public class PdfGenerateRequest {

    @NotBlank(message = "PDF filename cannot be blank")
    private String filename = "instanotes-document";

    @Pattern(regexp = "^(PORTRAIT|LANDSCAPE)$", message = "Orientation must be PORTRAIT or LANDSCAPE")
    private String orientation = "PORTRAIT";

    @Pattern(regexp = "^(FIT_ASPECT|FILL_PAGE)$", message = "FitMode must be FIT_ASPECT or FILL_PAGE")
    private String fitMode = "FIT_ASPECT";

    private float margin = 18.0f;

    private List<Integer> pageRotations;

    public PdfGenerateRequest() {}

    public PdfGenerateRequest(String filename, String orientation, String fitMode, float margin, List<Integer> pageRotations) {
        this.filename = filename;
        this.orientation = orientation != null ? orientation : "PORTRAIT";
        this.fitMode = fitMode != null ? fitMode : "FIT_ASPECT";
        this.margin = margin;
        this.pageRotations = pageRotations;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOrientation() {
        return orientation;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    public String getFitMode() {
        return fitMode;
    }

    public void setFitMode(String fitMode) {
        this.fitMode = fitMode;
    }

    public float getMargin() {
        return margin;
    }

    public void setMargin(float margin) {
        this.margin = margin;
    }

    public List<Integer> getPageRotations() {
        return pageRotations;
    }

    public void setPageRotations(List<Integer> pageRotations) {
        this.pageRotations = pageRotations;
    }
}
