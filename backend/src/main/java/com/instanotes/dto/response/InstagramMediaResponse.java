package com.instanotes.dto.response;

import java.util.List;

public class InstagramMediaResponse {
    private boolean success;
    private String title;
    private String author;
    private String shortcode;
    private List<InstagramSlideDto> slides;
    private String message;

    public InstagramMediaResponse() {}

    public InstagramMediaResponse(boolean success, String title, String author, String shortcode, List<InstagramSlideDto> slides, String message) {
        this.success = success;
        this.title = title;
        this.author = author;
        this.shortcode = shortcode;
        this.slides = slides;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getShortcode() {
        return shortcode;
    }

    public void setShortcode(String shortcode) {
        this.shortcode = shortcode;
    }

    public List<InstagramSlideDto> getSlides() {
        return slides;
    }

    public void setSlides(List<InstagramSlideDto> slides) {
        this.slides = slides;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static class InstagramSlideDto {
        private int index;
        private String imageUrl;
        private int width;
        private int height;

        public InstagramSlideDto() {}

        public InstagramSlideDto(int index, String imageUrl, int width, int height) {
            this.index = index;
            this.imageUrl = imageUrl;
            this.width = width;
            this.height = height;
        }

        public int getIndex() {
            return index;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
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
    }
}
