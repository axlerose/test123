package com.example.myspringproject.repository;

import com.example.myspringproject.model.RehearsalSong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// import java.util.List;

@Repository
public interface RehearsalSongRepository extends JpaRepository<RehearsalSong, Long> {
    // Custom query methods for RehearsalSong can be added here if needed in the future.
    // For example, to find all RehearsalSong entries for a specific rehearsal:
    // List<RehearsalSong> findByRehearsalId(Long rehearsalId);
    // Or for a specific song:
    // List<RehearsalSong> findBySongId(Long songId);
}
