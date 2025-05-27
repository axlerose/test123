package com.example.myspringproject.service;

import com.example.myspringproject.dto.RehearsalRequestDto;
import com.example.myspringproject.dto.RehearsalResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RehearsalService {

    RehearsalResponseDto createRehearsal(RehearsalRequestDto rehearsalDto);

    Page<RehearsalResponseDto> getAllRehearsals(LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);

    Optional<RehearsalResponseDto> getRehearsalById(Long id);

    Optional<RehearsalResponseDto> updateRehearsal(Long id, RehearsalRequestDto rehearsalDto);

    void deleteRehearsal(Long id);
}
