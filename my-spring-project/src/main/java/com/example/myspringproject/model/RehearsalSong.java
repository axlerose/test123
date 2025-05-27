package com.example.myspringproject.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "rehearsal_songs",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"rehearsal_id", "song_order"}),
                @UniqueConstraint(columnNames = {"rehearsal_id", "song_id"})
        })
public class RehearsalSong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rehearsal_id", nullable = false)
    private Rehearsal rehearsal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "song_order", nullable = false)
    private Integer songOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    // Constructors
    public RehearsalSong() {
    }

    public RehearsalSong(Rehearsal rehearsal, Song song, Integer songOrder) {
        this.rehearsal = rehearsal;
        this.song = song;
        this.songOrder = songOrder;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Rehearsal getRehearsal() {
        return rehearsal;
    }

    public void setRehearsal(Rehearsal rehearsal) {
        this.rehearsal = rehearsal;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public Integer getSongOrder() {
        return songOrder;
    }

    public void setSongOrder(Integer songOrder) {
        this.songOrder = songOrder;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RehearsalSong that = (RehearsalSong) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "RehearsalSong{" +
                "id=" + id +
                ", rehearsal_id=" + (rehearsal != null ? rehearsal.getId() : null) +
                ", song_id=" + (song != null ? song.getId() : null) +
                ", songOrder=" + songOrder +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
