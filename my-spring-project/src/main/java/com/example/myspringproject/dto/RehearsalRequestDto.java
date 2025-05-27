package com.example.myspringproject.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class RehearsalRequestDto {

    @NotNull(message = "Date and time cannot be null")
    private LocalDateTime dateTime;

    private String location;

    private String notes;

    @Valid // Enable validation for items in the list
    private List<RehearsalSongDto> songs;

    // Constructors
    public RehearsalRequestDto() {
    }

    public RehearsalRequestDto(LocalDateTime dateTime, String location, String notes, List<RehearsalSongDto> songs) {
        this.dateTime = dateTime;
        this.location = location;
        this.notes = notes;
        this.songs = songs;
    }

    // Getters and Setters
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
}
