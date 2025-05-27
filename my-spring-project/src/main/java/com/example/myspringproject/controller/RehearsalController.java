package com.example.myspringproject.controller;

import com.example.myspringproject.dto.RehearsalRequestDto;
import com.example.myspringproject.dto.RehearsalResponseDto;
import com.example.myspringproject.exception.ResourceNotFoundException;
import com.example.myspringproject.service.RehearsalService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/rehearsals")
public class RehearsalController {

    private final RehearsalService rehearsalService;

    @Autowired
    public RehearsalController(RehearsalService rehearsalService) {
        this.rehearsalService = rehearsalService;
    }

    @PostMapping
    @RolesAllowed("ADMIN")
    public ResponseEntity<RehearsalResponseDto> createRehearsal(@Valid @RequestBody RehearsalRequestDto rehearsalDto) {
        RehearsalResponseDto createdRehearsal = rehearsalService.createRehearsal(rehearsalDto);
        return new ResponseEntity<>(createdRehearsal, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<RehearsalResponseDto>> getAllRehearsals(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime,
            Pageable pageable) {
        Page<RehearsalResponseDto> rehearsals = rehearsalService.getAllRehearsals(startDateTime, endDateTime, pageable);
        return ResponseEntity.ok(rehearsals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RehearsalResponseDto> getRehearsalById(@PathVariable Long id) {
        return rehearsalService.getRehearsalById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Rehearsal not found with id: " + id));
    }

    @PutMapping("/{id}")
    @RolesAllowed("ADMIN")
    public ResponseEntity<RehearsalResponseDto> updateRehearsal(@PathVariable Long id, @Valid @RequestBody RehearsalRequestDto rehearsalDto) {
        // The service method updateRehearsal handles the Optional and throws ResourceNotFoundException if not found.
        return rehearsalService.updateRehearsal(id, rehearsalDto)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Rehearsal not found with id: " + id + " for update."));
    }

    @DeleteMapping("/{id}")
    @RolesAllowed("ADMIN")
    public ResponseEntity<Void> deleteRehearsal(@PathVariable Long id) {
        rehearsalService.deleteRehearsal(id); // Service method throws ResourceNotFoundException if not found
        return ResponseEntity.noContent().build();
    }
}
