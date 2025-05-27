// src/types/api.ts
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PageableParams {
  page?: number; // Spring Data JPA is 0-indexed by default
  size?: number;
  sort?: string; // e.g., "title,asc" or "dateTime,desc"
}

// Song DTOs
export interface SongRequestDto {
  title: string;
  composer?: string;
  lyrics?: string;
  tabsImageUrl?: string;
  scoreImageUrl?: string;
}

export interface SongResponseDto {
  id: number;
  title: string;
  composer: string | null; // Match backend (String can be null)
  lyrics: string | null;
  tabsImageUrl: string | null;
  scoreImageUrl: string | null;
  createdAt: string; // ISO Instant string
  updatedAt: string; // ISO Instant string
}

// Rehearsal DTOs
export interface RehearsalSongDto {
  songId: number;
  songOrder: number;
}

export interface RehearsalRequestDto {
  dateTime: string; // ISO LocalDateTime string e.g. "2024-07-31T19:00:00"
  location?: string;
  notes?: string;
  songs: RehearsalSongDto[];
}

export interface RehearsalResponseDto {
  id: number;
  dateTime: string; // ISO LocalDateTime string
  location: string | null;
  notes: string | null;
  songs: RehearsalSongDto[];
  createdAt: string; // ISO Instant string
  updatedAt: string; // ISO Instant string
}
