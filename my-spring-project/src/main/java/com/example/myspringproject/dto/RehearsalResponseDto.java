package com.example.myspringproject.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public class RehearsalResponseDto {

    private Long id;
    private LocalDateTime dateTime;
    private String location;
    private String notes;
    private List<RehearsalSongDto> songs; // This will be a list of DTOs
    private Instant createdAt;
    private Instant updatedAt;

    // Constructors
    public RehearsalResponseDto() {
    }

    public RehearsalResponseDto(Long id, LocalDateTime dateTime, String location, String notes, List<RehearsalSongDto> songs, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.dateTime = dateTime;
        this.location = location;
        this.notes = notes;
        this.songs = songs;
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

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<RehearsalSongDto> getSongs() {
        return songs;
    }

    public void setSongs(List<RehearsalSongDto> songs) {
        this.songs = songs;
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
