package com.example.myspringproject.repository;

import com.example.myspringproject.model.Rehearsal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface RehearsalRepository extends JpaRepository<Rehearsal, Long> {

    /**
     * Finds rehearsals within a given date and time range, paginated.
     *
     * @param startDateTime The start of the date and time range (inclusive).
     * @param endDateTime   The end of the date and time range (inclusive).
     * @param pageable      Pagination information.
     * @return A page of rehearsals within the specified range.
     */
    Page<Rehearsal> findByDateTimeBetween(LocalDateTime startDateTime, LocalDateTime endDateTime, Pageable pageable);

    // JpaRepository already provides findAll(Pageable pageable)
}
