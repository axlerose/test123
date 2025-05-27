// src/screens/admin/AdminSongScreen.tsx
    import React, { useState, useEffect, useCallback } from 'react';
    import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
    import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
    import { useSongs } from '../../contexts/SongContext';
    import { InputField, CustomButton, LoadingIndicator, ErrorMessage } from '../../components';
    import { SongRequestDto } from '../../types/api';
    import { SongStackParamList } from '../../navigation/types'; // Assuming admin screens could be part of a song stack or a dedicated admin stack

    // Define a potential param list that includes AdminSongScreen
    type AdminSongScreenRouteProp = RouteProp<{ AdminSongForm: { songId?: number } }, 'AdminSongForm'>;
    // Define navigation prop type (adjust if it's part of a different navigator)
    type AdminSongNavigationProp = NavigationProp<SongStackParamList>;


    const AdminSongScreen = () => {
      const navigation = useNavigation<AdminSongNavigationProp>();
      const route = useRoute<AdminSongScreenRouteProp>();
      const { songId } = route.params || {};

      const { currentSong, fetchSongById, addSong, updateSongState, isLoadingSongs, songsError, clearCurrentSong } = useSongs();

      const [title, setTitle] = useState('');
      const [composer, setComposer] = useState('');
      const [lyrics, setLyrics] = useState('');
      const [tabsImageUrl, setTabsImageUrl] = useState('');
      const [scoreImageUrl, setScoreImageUrl] = useState('');
      const [formError, setFormError] = useState<string | null>(null);

      const isEditMode = !!songId;

      useEffect(() => {
        if (isEditMode && songId) { // Ensure songId is not undefined for edit mode
          fetchSongById(songId);
        }
        return () => {
          clearCurrentSong(); // Clear when leaving, even if not fetched
        };
      }, [songId, isEditMode, fetchSongById, clearCurrentSong]);

      useEffect(() => {
        if (isEditMode && currentSong && currentSong.id === songId) {
          setTitle(currentSong.title);
          setComposer(currentSong.composer || '');
          setLyrics(currentSong.lyrics || '');
          setTabsImageUrl(currentSong.tabsImageUrl || '');
          setScoreImageUrl(currentSong.scoreImageUrl || '');
        } else if (!isEditMode) {
            // Reset form for create mode if currentSong was from somewhere else or if navigating away from edit
            setTitle(''); setComposer(''); setLyrics(''); setTabsImageUrl(''); setScoreImageUrl('');
        }
      }, [currentSong, isEditMode, songId]);

      const handleSubmit = async () => {
        setFormError(null);
        if (!title.trim()) {
          setFormError('Title is required.');
          return;
        }

        const songData: SongRequestDto = { title, composer, lyrics, tabsImageUrl, scoreImageUrl };

        let success = false;
        let result = null;
        if (isEditMode && songId) {
          result = await updateSongState(songId, songData);
          if (result) success = true;
        } else {
          result = await addSong(songData);
          if (result) success = true;
        }

        if (success && result) {
          Alert.alert('Success', `Song ${isEditMode ? 'updated' : 'created'} successfully!`);
          navigation.goBack(); // Or navigate to song list/detail
        } else if (!isLoadingSongs) { // Only show general error if not already handled by context's songsError
            setFormError(songsError || 'Failed to save song. Please try again.');
        }
      };

      return (
        <ScrollView style={styles.container}>
          <Text style={styles.header}>{isEditMode ? 'Edit Song' : 'Create New Song'}</Text>
          <InputField label="Title" value={title} onChangeText={setTitle} placeholder="Enter song title" error={formError && formError.includes('Title') ? formError : null} />
          <InputField label="Composer" value={composer} onChangeText={setComposer} placeholder="Enter composer name" />
          <InputField label="Lyrics" value={lyrics} onChangeText={setLyrics} placeholder="Enter lyrics" multiline numberOfLines={6} />
          <InputField label="Tabs Image URL" value={tabsImageUrl} onChangeText={setTabsImageUrl} placeholder="http://example.com/tabs.png" />
          <InputField label="Score Image URL" value={scoreImageUrl} onChangeText={setScoreImageUrl} placeholder="http://example.com/score.png" />

          {isLoadingSongs && <LoadingIndicator />}
          {songsError && !formError && <ErrorMessage message={songsError} />} 
          {formError && <ErrorMessage message={formError} />}


          <CustomButton title={isEditMode ? 'Save Changes' : 'Create Song'} onPress={handleSubmit} disabled={isLoadingSongs} />
        </ScrollView>
      );
    };

    const styles = StyleSheet.create({
      container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
      header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    });

    export default AdminSongScreen;
