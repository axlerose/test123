package com.example.myspringproject.dto;

import java.time.Instant;

public class SongResponseDto {

    private Long id;
    private String title;
    private String composer;
    private String lyrics;
    private String tabsImageUrl;
    private String scoreImageUrl;
    private Instant createdAt;
    private Instant updatedAt;

    // Constructors
    public SongResponseDto() {
    }

    public SongResponseDto(Long id, String title, String composer, String lyrics, String tabsImageUrl, String scoreImageUrl, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.composer = composer;
        this.lyrics = lyrics;
        this.tabsImageUrl = tabsImageUrl;
        this.scoreImageUrl = scoreImageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
