package com.example.myspringproject.service.impl;

import com.example.myspringproject.dto.RehearsalRequestDto;
import com.example.myspringproject.dto.RehearsalResponseDto;
import com.example.myspringproject.dto.RehearsalSongDto;
import com.example.myspringproject.exception.ResourceNotFoundException;
import com.example.myspringproject.mapper.RehearsalMapper;
import com.example.myspringproject.model.Rehearsal;
import com.example.myspringproject.model.RehearsalSong;
import com.example.myspringproject.model.Song;
import com.example.myspringproject.repository.RehearsalRepository;
import com.example.myspringproject.repository.SongRepository;
// RehearsalSongRepository is not strictly needed if relying on cascade, but can be injected if needed.
import com.example.myspringproject.service.RehearsalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils; // For checking if songs list is empty

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class RehearsalServiceImpl implements RehearsalService {

    private final RehearsalRepository rehearsalRepository;
    private final SongRepository songRepository;
    // private final RehearsalSongRepository rehearsalSongRepository; // Optional

    @Autowired
    public RehearsalServiceImpl(RehearsalRepository rehearsalRepository, SongRepository songRepository) {
        this.rehearsalRepository = rehearsalRepository;
        this.songRepository = songRepository;
    }

    @Override
    @Transactional
    public RehearsalResponseDto createRehearsal(RehearsalRequestDto rehearsalDto) {
        Rehearsal rehearsal = RehearsalMapper.toEntity(rehearsalDto);
        updateRehearsalSongs(rehearsal, rehearsalDto.getSongs());
        rehearsal = rehearsalRepository.save(rehearsal);
        return RehearsalMapper.toDto(rehearsal);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RehearsalResponseDto> getAllRehearsals(LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable) {
        Page<Rehearsal> rehearsalPage;
        if (startDateTime != null && endDateTime != null) {
            rehearsalPage = rehearsalRepository.findByDateTimeBetween(startDateTime, endDateTime, pageable);
        } else {
            rehearsalPage = rehearsalRepository.findAll(pageable);
        }
        return rehearsalPage.map(RehearsalMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RehearsalResponseDto> getRehearsalById(Long id) {
        return rehearsalRepository.findById(id).map(RehearsalMapper::toDto);
    }

    @Override
    @Transactional
    public Optional<RehearsalResponseDto> updateRehearsal(Long id, RehearsalRequestDto rehearsalDto) {
        return rehearsalRepository.findById(id)
                .map(existingRehearsal -> {
                    RehearsalMapper.updateEntityFromDto(rehearsalDto, existingRehearsal);
                    updateRehearsalSongs(existingRehearsal, rehearsalDto.getSongs());
                    Rehearsal updatedRehearsal = rehearsalRepository.save(existingRehearsal);
                    return RehearsalMapper.toDto(updatedRehearsal);
                });
    }

    @Override
    @Transactional
    public void deleteRehearsal(Long id) {
        if (!rehearsalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rehearsal not found with id: " + id);
        }
        rehearsalRepository.deleteById(id);
    }

    private void updateRehearsalSongs(Rehearsal rehearsal, List<RehearsalSongDto> songDtos) {
        // Clear existing songs. Thanks to orphanRemoval=true, old RehearsalSong entities will be deleted.
        rehearsal.getRehearsalSongs().clear();

        if (!CollectionUtils.isEmpty(songDtos)) {
            Set<RehearsalSong> newRehearsalSongs = new HashSet<>();
            for (RehearsalSongDto rsDto : songDtos) {
                Song song = songRepository.findById(rsDto.getSongId())
                        .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + rsDto.getSongId()));
                RehearsalSong rehearsalSong = new RehearsalSong(rehearsal, song, rsDto.getSongOrder());
                newRehearsalSongs.add(rehearsalSong);
            }
            rehearsal.setRehearsalSongs(newRehearsalSongs);
        }
    }
}
