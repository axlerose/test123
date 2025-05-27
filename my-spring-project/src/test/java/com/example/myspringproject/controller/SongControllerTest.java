package com.example.myspringproject.controller;

import com.example.myspringproject.dto.SongRequestDto;
import com.example.myspringproject.dto.SongResponseDto;
import com.example.myspringproject.exception.ResourceNotFoundException;
import com.example.myspringproject.service.SongService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Optional;

// Import SecurityConfig to apply security rules, and GlobalExceptionHandler for consistent exception handling
import com.example.myspringproject.config.SecurityConfig;
import com.example.myspringproject.exception.GlobalExceptionHandler;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.is;


// Use WebMvcTest to test only the web layer (controller)
// Specify the controller to test for focused testing
@WebMvcTest(SongController.class)
// Import SecurityConfig to ensure that security configurations are applied,
// and GlobalExceptionHandler to have consistent exception responses.
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc // Already included with WebMvcTest but can be explicit
public class SongControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SongService songService;

    private SongResponseDto songResponseDto;
    private SongRequestDto songRequestDto;

    @BeforeEach
    void setUp() {
        songResponseDto = new SongResponseDto(1L, "Test Title", "Test Composer", "Lyrics", null, null, Instant.now(), Instant.now());
        songRequestDto = new SongRequestDto("Test Title", "Test Composer", "Lyrics", null, null);
    }

    @Test
    @WithMockUser // Default user, no specific roles, sufficient for GET if endpoint is authenticated()
    void getSongById_whenSongExists_shouldReturnSong() throws Exception {
        when(songService.getSongById(1L)).thenReturn(Optional.of(songResponseDto));

        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Title")));
    }

    @Test
    @WithMockUser
    void getSongById_whenSongDoesNotExist_shouldReturnNotFound() throws Exception {
        // Controller's getSongById throws ResourceNotFoundException if service returns empty Optional.
        // This is then handled by GlobalExceptionHandler to return 404.
        when(songService.getSongById(1L)).thenReturn(Optional.empty());
        // Alternative, if service itself throws:
        // when(songService.getSongById(1L)).thenThrow(new ResourceNotFoundException("Song not found with id: 1"));


        mockMvc.perform(get("/api/songs/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void createSong_whenAdminAndValidInput_shouldReturnCreatedSong() throws Exception {
        when(songService.createSong(any(SongRequestDto.class))).thenReturn(songResponseDto);

        mockMvc.perform(post("/api/songs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(songRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Title")));
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void createSong_whenUserRole_shouldReturnForbidden() throws Exception {
        mockMvc.perform(post("/api/songs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(songRequestDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void createSong_whenAdminAndInvalidInput_shouldReturnBadRequest() throws Exception {
        SongRequestDto invalidSongRequestDto = new SongRequestDto("", "Composer", "Lyrics", null, null); // Blank title

        // No need to mock songService.createSong, as validation should fail before service is called.
        // The MethodArgumentNotValidException will be thrown by Spring, then handled by GlobalExceptionHandler.

        mockMvc.perform(post("/api/songs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidSongRequestDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("Title cannot be blank"))); // Check for validation error message
    }
}
