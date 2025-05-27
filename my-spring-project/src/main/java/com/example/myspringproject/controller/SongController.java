package com.example.myspringproject.controller;

import com.example.myspringproject.dto.SongRequestDto;
import com.example.myspringproject.dto.SongResponseDto;
import com.example.myspringproject.exception.ResourceNotFoundException;
import com.example.myspringproject.service.SongService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    @Autowired
    public SongController(SongService songService) {
        this.songService = songService;
    }

    @PostMapping
    @RolesAllowed("ADMIN")
    public ResponseEntity<SongResponseDto> createSong(@Valid @RequestBody SongRequestDto songDto) {
        SongResponseDto createdSong = songService.createSong(songDto);
        return new ResponseEntity<>(createdSong, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<SongResponseDto>> getAllSongs(
            @RequestParam(required = false) String title,
            Pageable pageable) {
        Page<SongResponseDto> songs = songService.getAllSongs(title, pageable);
        return ResponseEntity.ok(songs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SongResponseDto> getSongById(@PathVariable Long id) {
        return songService.getSongById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }

    @PutMapping("/{id}")
    @RolesAllowed("ADMIN")
    public ResponseEntity<SongResponseDto> updateSong(@PathVariable Long id, @Valid @RequestBody SongRequestDto songDto) {
        // First check if song exists, then call update
        // This ensures that the ResourceNotFoundException is thrown from the controller context
        // if the song doesn't exist, which is consistent with getSongById.
        // The service method `updateSong` also checks, but this provides a slightly earlier and more consistent check.
        return songService.getSongById(id) // Check existence first
                .flatMap(existingSong -> songService.updateSong(id, songDto)) // Then update
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id + " for update."));
    }

    @DeleteMapping("/{id}")
    @RolesAllowed("ADMIN")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id); // Service method throws ResourceNotFoundException if not found
        return ResponseEntity.noContent().build();
    }
}
