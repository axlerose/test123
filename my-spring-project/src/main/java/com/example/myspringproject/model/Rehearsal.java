package com.example.myspringproject.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "rehearsals")
public class Rehearsal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "rehearsal", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<RehearsalSong> rehearsalSongs = new HashSet<>();

    // Constructors
    public Rehearsal() {
    }

    public Rehearsal(LocalDateTime dateTime, String location, String notes) {
        this.dateTime = dateTime;
        this.location = location;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<RehearsalSong> getRehearsalSongs() {
        return rehearsalSongs;
    }

    public void setRehearsalSongs(Set<RehearsalSong> rehearsalSongs) {
        this.rehearsalSongs = rehearsalSongs;
    }

    // Helper methods for managing the bidirectional association
    public void addRehearsalSong(RehearsalSong rehearsalSong) {
        rehearsalSongs.add(rehearsalSong);
        rehearsalSong.setRehearsal(this);
    }

    public void removeRehearsalSong(RehearsalSong rehearsalSong) {
        rehearsalSongs.remove(rehearsalSong);
        rehearsalSong.setRehearsal(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Rehearsal rehearsal = (Rehearsal) o;
        return Objects.equals(id, rehearsal.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Rehearsal{" +
                "id=" + id +
                ", dateTime=" + dateTime +
                ", location='" + location + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
