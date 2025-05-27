package com.example.myspringproject.service.impl;

import com.example.myspringproject.dto.SongRequestDto;
import com.example.myspringproject.dto.SongResponseDto;
import com.example.myspringproject.exception.ResourceNotFoundException;
import com.example.myspringproject.mapper.SongMapper;
import com.example.myspringproject.model.Song;
import com.example.myspringproject.repository.SongRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SongServiceImplTest {

    @Mock
    private SongRepository songRepository;

    @InjectMocks
    private SongServiceImpl songService;

    private Song song;
    private SongResponseDto songResponseDto;
    private SongRequestDto songRequestDto;

    @BeforeEach
    void setUp() {
        song = new Song("Test Title", "Test Composer", "Test Lyrics", null, null);
        song.setId(1L);
        song.setCreatedAt(Instant.now());
        song.setUpdatedAt(Instant.now());

        songResponseDto = SongMapper.toDto(song);
        songRequestDto = new SongRequestDto("New Title", "New Composer", "New Lyrics", null, null);
    }

    @Test
    void getSongById_whenSongExists_shouldReturnSongResponseDto() {
        when(songRepository.findById(1L)).thenReturn(Optional.of(song));

        Optional<SongResponseDto> foundSongDto = songService.getSongById(1L);

        assertThat(foundSongDto).isPresent();
        assertThat(foundSongDto.get().getId()).isEqualTo(song.getId());
        assertThat(foundSongDto.get().getTitle()).isEqualTo(song.getTitle());
    }

    @Test
    void getSongById_whenSongDoesNotExist_shouldReturnEmptyOptional() {
        when(songRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<SongResponseDto> foundSongDto = songService.getSongById(1L);

        assertThat(foundSongDto).isEmpty();
    }

    @Test
    void createSong_shouldReturnSongResponseDto() {
        // Create a new Song entity based on the request DTO (as SongMapper.toEntity would do)
        Song newSongToSave = SongMapper.toEntity(songRequestDto);
        // Mock the repository's save method to set an ID and timestamps, simulating persistence
        Song savedSong = new Song(songRequestDto.getTitle(), songRequestDto.getComposer(), songRequestDto.getLyrics(), songRequestDto.getTabsImageUrl(), songRequestDto.getScoreImageUrl());
        savedSong.setId(2L); // Simulate ID generation
        savedSong.setCreatedAt(Instant.now());
        savedSong.setUpdatedAt(Instant.now());

        when(songRepository.save(any(Song.class))).thenReturn(savedSong);

        SongResponseDto createdSongDto = songService.createSong(songRequestDto);

        assertThat(createdSongDto).isNotNull();
        assertThat(createdSongDto.getId()).isEqualTo(savedSong.getId());
        assertThat(createdSongDto.getTitle()).isEqualTo(songRequestDto.getTitle());
        verify(songRepository, times(1)).save(any(Song.class));
    }
    
    @Test
    void deleteSong_whenSongDoesNotExist_shouldThrowResourceNotFoundException() {
        when(songRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            songService.deleteSong(1L);
        });

        verify(songRepository, times(1)).existsById(1L);
        verify(songRepository, never()).deleteById(1L);
    }

    @Test
    void deleteSong_whenSongExists_shouldDeleteSong() {
        when(songRepository.existsById(1L)).thenReturn(true);
        doNothing().when(songRepository).deleteById(1L);

        songService.deleteSong(1L);

        verify(songRepository, times(1)).existsById(1L);
        verify(songRepository, times(1)).deleteById(1L);
    }
}
