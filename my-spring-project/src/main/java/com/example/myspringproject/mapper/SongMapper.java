package com.example.myspringproject.mapper;

import com.example.myspringproject.dto.SongRequestDto;
import com.example.myspringproject.dto.SongResponseDto;
import com.example.myspringproject.model.Song;

public class SongMapper {

    public static SongResponseDto toDto(Song song) {
        if (song == null) {
            return null;
        }
        return new SongResponseDto(
                song.getId(),
                song.getTitle(),
                song.getComposer(),
                song.getLyrics(),
                song.getTabsImageUrl(),
                song.getScoreImageUrl(),
                song.getCreatedAt(),
                song.getUpdatedAt()
        );
    }

    public static Song toEntity(SongRequestDto dto) {
        if (dto == null) {
            return null;
        }
        Song song = new Song();
        song.setTitle(dto.getTitle());
        song.setComposer(dto.getComposer());
        song.setLyrics(dto.getLyrics());
        song.setTabsImageUrl(dto.getTabsImageUrl());
        song.setScoreImageUrl(dto.getScoreImageUrl());
        // createdAt and updatedAt are set by @CreationTimestamp and @UpdateTimestamp
        return song;
    }

    public static void updateEntityFromDto(SongRequestDto dto, Song entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setTitle(dto.getTitle());
        entity.setComposer(dto.getComposer());
        entity.setLyrics(dto.getLyrics());
        entity.setTabsImageUrl(dto.getTabsImageUrl());
        entity.setScoreImageUrl(dto.getScoreImageUrl());
        // id, createdAt are not updated from DTO
        // updatedAt is updated by @UpdateTimestamp
    }
}
