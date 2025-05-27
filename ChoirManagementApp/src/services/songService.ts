// src/services/songService.ts
import apiClient from './apiClient';
import { SongRequestDto, SongResponseDto, Page, PageableParams } from '../types/api';

export const SongApiService = {
  createSong: async (songData: SongRequestDto): Promise<SongResponseDto> => {
    const response = await apiClient.post<SongResponseDto>('/songs', songData);
    return response.data;
  },

  getAllSongs: async (title?: string, pageable?: PageableParams): Promise<Page<SongResponseDto>> => {
    const params: any = { ...pageable };
    if (title) {
      params.title = title;
    }
    const response = await apiClient.get<Page<SongResponseDto>>('/songs', { params });
    return response.data;
  },

  getSongById: async (id: number): Promise<SongResponseDto> => {
    const response = await apiClient.get<SongResponseDto>(`/songs/${id}`);
    return response.data;
  },

  updateSong: async (id: number, songData: SongRequestDto): Promise<SongResponseDto> => {
    const response = await apiClient.put<SongResponseDto>(`/songs/${id}`, songData);
    return response.data;
  },

  deleteSong: async (id: number): Promise<void> => {
    await apiClient.delete(`/songs/${id}`);
  },
};
