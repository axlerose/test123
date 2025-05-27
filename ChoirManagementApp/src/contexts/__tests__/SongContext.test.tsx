// src/contexts/__tests__/SongContext.test.tsx
    import React from 'react';
    import { renderHook, act } from '@testing-library/react-hooks'; // For testing hooks
    import { SongProvider, useSongs } from '../SongContext';
    import { SongApiService } from '../../services/songService'; // To mock its functions
    import { SongResponseDto, Page } from '../../types/api';

    // Mock the SongApiService
    jest.mock('../../services/songService');
    const mockedSongApiService = SongApiService as jest.Mocked<typeof SongApiService>;

    const mockSong: SongResponseDto = {
      id: 1, title: 'Mock Song 1', composer: 'Composer 1', lyrics: '',
      tabsImageUrl: null, scoreImageUrl: null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    const mockSongPage: Page<SongResponseDto> = {
        content: [mockSong], totalPages: 1, totalElements: 1, size: 10, number: 0, first: true, last: true, empty: false
    };

    // Wrapper component to provide the context
    const wrapper = ({ children }: { children: React.ReactNode }) => <SongProvider>{children}</SongProvider>;

    describe('SongContext', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('fetchSongs updates state correctly on success', async () => {
        mockedSongApiService.getAllSongs.mockResolvedValueOnce(mockSongPage);

        const { result, waitForNextUpdate } = renderHook(() => useSongs(), { wrapper });

        // Initial state check (optional)
        expect(result.current.isLoadingSongs).toBe(false); // Or true if fetchSongs sets it true initially before async
        expect(result.current.songsPage).toBeNull();


        await act(async () => {
          result.current.fetchSongs();
          // isLoadingSongs should be true immediately after calling fetchSongs
          expect(result.current.isLoadingSongs).toBe(true);
          await waitForNextUpdate(); // Wait for state updates after async call
        });
        
        expect(result.current.songsPage).toEqual(mockSongPage);
        expect(result.current.isLoadingSongs).toBe(false);
        expect(result.current.songsError).toBeNull();
      });

      it('fetchSongs updates error state on failure', async () => {
        const errorMessage = 'Failed to fetch';
        mockedSongApiService.getAllSongs.mockRejectedValueOnce(new Error(errorMessage));

        const { result, waitForNextUpdate } = renderHook(() => useSongs(), { wrapper });
        
        await act(async () => {
          result.current.fetchSongs();
          expect(result.current.isLoadingSongs).toBe(true);
          await waitForNextUpdate();
        });

        expect(result.current.songsPage).toBeNull();
        expect(result.current.isLoadingSongs).toBe(false);
        expect(result.current.songsError).toBe(errorMessage);
      });
      
      it('fetchSongById updates currentSong on success', async () => {
        mockedSongApiService.getSongById.mockResolvedValueOnce(mockSong);
        const { result, waitForNextUpdate } = renderHook(() => useSongs(), { wrapper });

        await act(async () => {
            result.current.fetchSongById(1);
            expect(result.current.isLoadingSongs).toBe(true);
            await waitForNextUpdate();
        });

        expect(result.current.currentSong).toEqual(mockSong);
        expect(result.current.isLoadingSongs).toBe(false);
        expect(result.current.songsError).toBeNull();
      });
    });
