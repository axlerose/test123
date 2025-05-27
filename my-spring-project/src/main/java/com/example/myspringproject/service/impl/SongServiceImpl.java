package com.example.myspringproject.service.impl;

import com.example.myspringproject.dto.SongRequestDto;
import com.example.myspringproject.dto.SongResponseDto;
import com.example.myspringproject.exception.ResourceNotFoundException;
import com.example.myspringproject.mapper.SongMapper;
import com.example.myspringproject.model.Song;
import com.example.myspringproject.repository.SongRepository;
import com.example.myspringproject.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; // For checking if title is present

import java.util.Optional;

@Service
public class SongServiceImpl implements SongService {

    private final SongRepository songRepository;

    @Autowired
    public SongServiceImpl(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    @Transactional
    public SongResponseDto createSong(SongRequestDto songDto) {
        Song song = SongMapper.toEntity(songDto);
        song = songRepository.save(song);
        return SongMapper.toDto(song);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SongResponseDto> getAllSongs(String title, Pageable pageable) {
        Page<Song> songPage;
        if (StringUtils.hasText(title)) {
            songPage = songRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else {
            songPage = songRepository.findAll(pageable);
        }
        return songPage.map(SongMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SongResponseDto> getSongById(Long id) {
        return songRepository.findById(id).map(SongMapper::toDto);
        // Controller will handle Optional and throw ResourceNotFoundException if empty
    }

    @Override
    @Transactional
    public Optional<SongResponseDto> updateSong(Long id, SongRequestDto songDto) {
        return songRepository.findById(id)
                .map(existingSong -> {
                    SongMapper.updateEntityFromDto(songDto, existingSong);
                    Song updatedSong = songRepository.save(existingSong);
                    return SongMapper.toDto(updatedSong);
                });
        // Controller will handle Optional and throw ResourceNotFoundException if empty before calling this
    }

    @Override
    @Transactional
    public void deleteSong(Long id) {
        if (!songRepository.existsById(id)) {
            throw new ResourceNotFoundException("Song not found with id: " + id);
        }
        songRepository.deleteById(id);
    }
}
