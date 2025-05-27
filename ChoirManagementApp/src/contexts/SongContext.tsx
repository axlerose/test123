// src/contexts/SongContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SongApiService } from '../services/songService';
import { SongResponseDto, SongRequestDto, Page, PageableParams } from '../types/api';

interface SongContextType {
  songsPage: Page<SongResponseDto> | null;
  currentSong: SongResponseDto | null; // For song detail view
  isLoadingSongs: boolean;
  songsError: string | null;
  fetchSongs: (title?: string, pageable?: PageableParams) => Promise<void>;
  fetchSongById: (id: number) => Promise<void>; // Fetches and sets currentSong
  addSong: (songData: SongRequestDto) => Promise<SongResponseDto | null>;
  updateSongState: (id: number, songData: SongRequestDto) => Promise<SongResponseDto | null>; // For optimistic updates or refetch
  removeSong: (id: number) => Promise<void>;
  clearCurrentSong: () => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [songsPage, setSongsPage] = useState<Page<SongResponseDto> | null>(null);
  const [currentSong, setCurrentSong] = useState<SongResponseDto | null>(null);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [songsError, setSongsError] = useState<string | null>(null);

  const fetchSongs = useCallback(async (title?: string, pageable?: PageableParams) => {
    setIsLoadingSongs(true);
    setSongsError(null);
    try {
      const data = await SongApiService.getAllSongs(title, pageable);
      setSongsPage(data);
    } catch (error: any) {
      setSongsError(error.message || 'Failed to fetch songs');
      console.error("SongContext: Failed to fetch songs", error);
    } finally {
      setIsLoadingSongs(false);
    }
  }, []);

  const fetchSongById = useCallback(async (id: number) => {
    setIsLoadingSongs(true); // Could use a different loading state for current song
    setSongsError(null);
    setCurrentSong(null);
    try {
      const data = await SongApiService.getSongById(id);
      setCurrentSong(data);
    } catch (error: any) {
      setSongsError(error.message || `Failed to fetch song ${id}`);
      console.error(`SongContext: Failed to fetch song ${id}`, error);
    } finally {
      setIsLoadingSongs(false);
    }
  }, []);
  
  const clearCurrentSong = () => {
    setCurrentSong(null);
  };

  const addSong = async (songData: SongRequestDto): Promise<SongResponseDto | null> => {
    setIsLoadingSongs(true);
    try {
      const newSong = await SongApiService.createSong(songData);
      // Optionally, refetch the current page of songs to include the new one
      if (songsPage?.number !== undefined) {
         await fetchSongs(undefined, { page: songsPage.number, size: songsPage.size });
      } else {
         await fetchSongs(); // Or just refetch the first page
      }
      return newSong;
    } catch (error: any) {
      setSongsError(error.message || 'Failed to add song');
      console.error("SongContext: Failed to add song", error);
      return null;
    } finally {
      setIsLoadingSongs(false);
    }
  };
  
  const updateSongState = async (id: number, songData: SongRequestDto): Promise<SongResponseDto | null> => {
    setIsLoadingSongs(true);
    try {
        const updatedSong = await SongApiService.updateSong(id, songData);
        // Update in local state if needed, or refetch
        if (currentSong?.id === id) {
            setCurrentSong(updatedSong);
        }
        if (songsPage) {
            const newContent = songsPage.content.map(s => s.id === id ? updatedSong : s);
            setSongsPage({ ...songsPage, content: newContent });
        }
        return updatedSong;
    } catch (error: any) {
        setSongsError(error.message || 'Failed to update song');
        console.error("SongContext: Failed to update song", error);
        return null;
    } finally {
        setIsLoadingSongs(false);
    }
  };

  const removeSong = async (id: number): Promise<void> => {
    setIsLoadingSongs(true);
    try {
      await SongApiService.deleteSong(id);
      // Refetch songs or remove from local state
      if (songsPage) {
        // This is a simplified removal; server-side pagination means we should ideally refetch.
        setSongsPage(prev => prev ? ({
            ...prev,
            content: prev.content.filter(s => s.id !== id),
            totalElements: prev.totalElements -1 
        }) : null);
      }
    } catch (error: any) {
      setSongsError(error.message || 'Failed to delete song');
      console.error("SongContext: Failed to delete song", error);
    } finally {
      setIsLoadingSongs(false);
    }
  };

  return (
    <SongContext.Provider value={{ songsPage, currentSong, isLoadingSongs, songsError, fetchSongs, fetchSongById, addSong, updateSongState, removeSong, clearCurrentSong }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSongs must be used within a SongProvider');
  }
  return context;
};
