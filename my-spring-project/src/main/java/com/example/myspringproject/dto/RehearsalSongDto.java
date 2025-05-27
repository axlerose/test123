package com.example.myspringproject.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class RehearsalSongDto {

    @NotNull(message = "Song ID cannot be null")
    private Long songId;

    @NotNull(message = "Song order cannot be null")
    @Positive(message = "Song order must be a positive number")
    private Integer songOrder;

    // Constructors
    public RehearsalSongDto() {
    }

    public RehearsalSongDto(Long songId, Integer songOrder) {
        this.songId = songId;
        this.songOrder = songOrder;
    }

    // Getters and Setters
    public Long getSongId() {
        return songId;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public Integer getSongOrder() {
        return songOrder;
    }

    public void setSongOrder(Integer songOrder) {
        this.songOrder = songOrder;
    }
}
