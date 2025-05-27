package com.example.myspringproject.repository;

import com.example.myspringproject.model.Song;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class SongRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SongRepository songRepository;

    private Song song1;
    private Song song2;
    private Song song3;

    @BeforeEach
    void setUp() {
        songRepository.deleteAll(); // Clean up before each test

        song1 = new Song("Bohemian Rhapsody", "Queen", "Is this the real life?", null, null);
        song2 = new Song("Stairway to Heaven", "Led Zeppelin", "There's a lady who's sure...", null, null);
        song3 = new Song("Another Brick in the Wall", "Pink Floyd", "We don't need no education", null, null);

        entityManager.persist(song1);
        entityManager.persist(song2);
        entityManager.persist(song3);
        entityManager.flush(); // Ensure data is persisted before querying
    }

    @Test
    void findByTitleContainingIgnoreCase_shouldReturnMatchingSongs() {
        // Test finding "Rhapsody"
        Page<Song> foundSongsPage = songRepository.findByTitleContainingIgnoreCase("Rhapsody", PageRequest.of(0, 5));
        assertThat(foundSongsPage.getContent()).hasSize(1);
        assertThat(foundSongsPage.getContent().get(0).getTitle()).isEqualTo("Bohemian Rhapsody");

        // Test finding "way" (should match "Stairway to Heaven")
        foundSongsPage = songRepository.findByTitleContainingIgnoreCase("way", PageRequest.of(0, 5));
        assertThat(foundSongsPage.getContent()).hasSize(1);
        assertThat(foundSongsPage.getContent().get(0).getTitle()).isEqualTo("Stairway to Heaven");

        // Test finding "ANOTHER" (case-insensitive)
        foundSongsPage = songRepository.findByTitleContainingIgnoreCase("ANOTHER", PageRequest.of(0, 5));
        assertThat(foundSongsPage.getContent()).hasSize(1);
        assertThat(foundSongsPage.getContent().get(0).getTitle()).isEqualTo("Another Brick in the Wall");
    }

    @Test
    void findByTitleContainingIgnoreCase_shouldReturnEmptyPage_whenNoMatch() {
        Page<Song> foundSongsPage = songRepository.findByTitleContainingIgnoreCase("NonExistentTitle", PageRequest.of(0, 5));
        assertThat(foundSongsPage.getContent()).isEmpty();
    }

    @Test
    void findByTitleContainingIgnoreCase_shouldHandlePagination() {
        entityManager.persist(new Song("Bohemian Song", "Test", "Lyrics", null, null));
        entityManager.persist(new Song("Another Bohemian Melody", "Test", "Lyrics", null, null));
        entityManager.flush(); // 5 songs total now, 3 with "Bohemian"

        // Page 1, size 2
        Page<Song> foundSongsPage = songRepository.findByTitleContainingIgnoreCase("Bohemian", PageRequest.of(0, 2));
        assertThat(foundSongsPage.getContent()).hasSize(2);
        assertThat(foundSongsPage.getTotalElements()).isEqualTo(3); // Total matching elements
        assertThat(foundSongsPage.getTotalPages()).isEqualTo(2); // Total pages

        // Page 2, size 2
        foundSongsPage = songRepository.findByTitleContainingIgnoreCase("Bohemian", PageRequest.of(1, 2));
        assertThat(foundSongsPage.getContent()).hasSize(1); // Remaining element
    }
}
