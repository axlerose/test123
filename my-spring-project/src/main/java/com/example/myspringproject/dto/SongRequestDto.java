package com.example.myspringproject.dto;

import jakarta.validation.constraints.NotBlank;

public class SongRequestDto {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    private String composer;

    private String lyrics; // Can be large, consider if needs special handling in future

    private String tabsImageUrl;

    private String scoreImageUrl;

    // Constructors
    public SongRequestDto() {
    }

    public SongRequestDto(String title, String composer, String lyrics, String tabsImageUrl, String scoreImageUrl) {
        this.title = title;
        this.composer = composer;
        this.lyrics = lyrics;
        this.tabsImageUrl = tabsImageUrl;
        this.scoreImageUrl = scoreImageUrl;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComposer() {
        return composer;
    }

    public void setComposer(String composer) {
        this.composer = composer;
    }

    public String getLyrics() {
        return lyrics;
    }

    public void setLyrics(String lyrics) {
        this.lyrics = lyrics;
    }

    public String getTabsImageUrl() {
        return tabsImageUrl;
    }

    public void setTabsImageUrl(String tabsImageUrl) {
        this.tabsImageUrl = tabsImageUrl;
    }

    public String getScoreImageUrl() {
        return scoreImageUrl;
    }

    public void setScoreImageUrl(String scoreImageUrl) {
        this.scoreImageUrl = scoreImageUrl;
    }
}
