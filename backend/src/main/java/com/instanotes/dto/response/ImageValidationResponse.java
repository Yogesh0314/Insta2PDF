package com.instanotes.dto.response;

public class ImageValidationResponse {
    private boolean valid;
    private String filename;
    private String contentType;
    private long sizeInBytes;
    private int width;
    private int height;
    private String message;

    public ImageValidationResponse() {}

    public ImageValidationResponse(boolean valid, String filename, String contentType, long sizeInBytes, int width, int height, String message) {
        this.valid = valid;
        this.filename = filename;
        this.contentType = contentType;
        this.sizeInBytes = sizeInBytes;
        this.width = width;
        this.height = height;
        this.message = message;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public long getSizeInBytes() {
        return sizeInBytes;
    }

    public void setSizeInBytes(long sizeInBytes) {
        this.sizeInBytes = sizeInBytes;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
