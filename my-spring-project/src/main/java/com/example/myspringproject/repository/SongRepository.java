package com.example.myspringproject.repository;

import com.example.myspringproject.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    /**
     * Finds songs by title, ignoring case, and returns them in a paginated format.
     *
     * @param title    The title (or part of it) to search for.
     * @param pageable Pagination information.
     * @return A page of songs matching the title.
     */
    Page<Song> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // JpaRepository already provides findAll(Pageable pageable), so no need to override it explicitly.
}
