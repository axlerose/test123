// src/services/rehearsalService.ts
import apiClient from './apiClient';
import { RehearsalRequestDto, RehearsalResponseDto, Page, PageableParams } from '../types/api';

export const RehearsalApiService = {
  createRehearsal: async (rehearsalData: RehearsalRequestDto): Promise<RehearsalResponseDto> => {
    const response = await apiClient.post<RehearsalResponseDto>('/rehearsals', rehearsalData);
    return response.data;
  },

  getAllRehearsals: async (
    startDateTime?: string, // ISO string
    endDateTime?: string,   // ISO string
    pageable?: PageableParams
  ): Promise<Page<RehearsalResponseDto>> => {
    const params: any = { ...pageable };
    if (startDateTime) {
      params.startDateTime = startDateTime;
    }
    if (endDateTime) {
      params.endDateTime = endDateTime;
    }
    const response = await apiClient.get<Page<RehearsalResponseDto>>('/rehearsals', { params });
    return response.data;
  },

  getRehearsalById: async (id: number): Promise<RehearsalResponseDto> => {
    const response = await apiClient.get<RehearsalResponseDto>(`/rehearsals/${id}`);
    return response.data;
  },

  updateRehearsal: async (id: number, rehearsalData: RehearsalRequestDto): Promise<RehearsalResponseDto> => {
    const response = await apiClient.put<RehearsalResponseDto>(`/rehearsals/${id}`, rehearsalData);
    return response.data;
  },

  deleteRehearsal: async (id: number): Promise<void> => {
    await apiClient.delete(`/rehearsals/${id}`);
  },
};
