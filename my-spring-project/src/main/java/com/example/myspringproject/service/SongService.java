package com.example.myspringproject.service;

import com.example.myspringproject.dto.SongRequestDto;
import com.example.myspringproject.dto.SongResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface SongService {

    SongResponseDto createSong(SongRequestDto songDto);

    Page<SongResponseDto> getAllSongs(String title, Pageable pageable);

    Optional<SongResponseDto> getSongById(Long id);

    Optional<SongResponseDto> updateSong(Long id, SongRequestDto songDto);

    void deleteSong(Long id);
}
