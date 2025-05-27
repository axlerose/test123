// src/services/__tests__/songService.test.ts
    import { SongApiService } from '../songService';
    import apiClient from '../apiClient'; // The actual apiClient instance
    import { SongResponseDto } from '../../types/api';

    // Mock the apiClient module
    jest.mock('../apiClient'); 
    const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>; // Typecast for mocked methods

    describe('SongApiService', () => {
      afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
      });

      it('getSongById calls apiClient.get with the correct URL and returns data', async () => {
        const mockSong: SongResponseDto = {
          id: 1,
          title: 'Test Song',
          composer: 'Test Composer',
          lyrics: 'Test Lyrics',
          tabsImageUrl: null,
          scoreImageUrl: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Mock the specific get implementation for this test
        mockedApiClient.get.mockResolvedValueOnce({ data: mockSong });

        const result = await SongApiService.getSongById(1);

        expect(mockedApiClient.get).toHaveBeenCalledWith('/songs/1');
        expect(result).toEqual(mockSong);
      });

      it('getAllSongs calls apiClient.get with params', async () => {
        const mockPage = { content: [], totalPages: 0, totalElements: 0, size: 10, number: 0, first: true, last: true, empty: true};
        mockedApiClient.get.mockResolvedValueOnce({ data: mockPage });

        await SongApiService.getAllSongs('Test Title', { page: 0, size: 10 });
        expect(mockedApiClient.get).toHaveBeenCalledWith('/songs', { 
          params: { page: 0, size: 10, title: 'Test Title' } 
        });
      });
      
      it('createSong calls apiClient.post with data and returns new song', async () => {
        const requestData = { title: 'New Song' };
        const responseData = { id: 2, ...requestData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as SongResponseDto;
        mockedApiClient.post.mockResolvedValueOnce({ data: responseData });

        const result = await SongApiService.createSong(requestData);
        expect(mockedApiClient.post).toHaveBeenCalledWith('/songs', requestData);
        expect(result).toEqual(responseData);
      });
    });
