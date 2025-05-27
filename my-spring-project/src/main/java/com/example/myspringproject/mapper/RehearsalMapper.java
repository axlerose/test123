package com.example.myspringproject.mapper;

import com.example.myspringproject.dto.RehearsalRequestDto;
import com.example.myspringproject.dto.RehearsalResponseDto;
import com.example.myspringproject.dto.RehearsalSongDto;
import com.example.myspringproject.model.Rehearsal;
import com.example.myspringproject.model.RehearsalSong;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class RehearsalMapper {

    public static RehearsalResponseDto toDto(Rehearsal rehearsal) {
        if (rehearsal == null) {
            return null;
        }

        List<RehearsalSongDto> rehearsalSongDtos = Collections.emptyList();
        if (rehearsal.getRehearsalSongs() != null) {
            rehearsalSongDtos = rehearsal.getRehearsalSongs().stream()
                    .sorted(Comparator.comparing(RehearsalSong::getSongOrder)) // Ensure order
                    .map(rehearsalSong -> new RehearsalSongDto(
                            rehearsalSong.getSong().getId(),
                            rehearsalSong.getSongOrder()
                    ))
                    .collect(Collectors.toList());
        }

        return new RehearsalResponseDto(
                rehearsal.getId(),
                rehearsal.getDateTime(),
                rehearsal.getLocation(),
                rehearsal.getNotes(),
                rehearsalSongDtos,
                rehearsal.getCreatedAt(),
                rehearsal.getUpdatedAt()
        );
    }

    public static Rehearsal toEntity(RehearsalRequestDto dto) {
        if (dto == null) {
            return null;
        }
        Rehearsal rehearsal = new Rehearsal();
        rehearsal.setDateTime(dto.getDateTime());
        rehearsal.setLocation(dto.getLocation());
        rehearsal.setNotes(dto.getNotes());
        // Mapping of RehearsalSongDto list to RehearsalSong entities
        // will be handled in the service layer, as it requires fetching Song entities.
        return rehearsal;
    }

    public static void updateEntityFromDto(RehearsalRequestDto dto, Rehearsal entity) {
        if (dto == null || entity == null) {
            return;
        }
        entity.setDateTime(dto.getDateTime());
        entity.setLocation(dto.getLocation());
        entity.setNotes(dto.getNotes());
        // Mapping of RehearsalSongDto list to RehearsalSong entities
        // will be handled in the service layer.
        // The service will typically clear the existing songs and add new ones.
    }
}
