// src/screens/SongDetailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSongs } from '../contexts/SongContext';
import { LoadingIndicator, ErrorMessage, Card } from '../components';
import { SongStackParamList } from '../navigation/types';

type SongDetailRouteProp = RouteProp<SongStackParamList, 'SongDetail'>;

const SongDetailScreen = () => {
  const route = useRoute<SongDetailRouteProp>();
  const { songId } = route.params;
  const { currentSong, isLoadingSongs, songsError, fetchSongById, clearCurrentSong } = useSongs();

  useEffect(() => {
    fetchSongById(songId);
    return () => {
      clearCurrentSong(); // Clear current song when screen is left
    };
  }, [songId, fetchSongById, clearCurrentSong]);

  if (isLoadingSongs && !currentSong) {
    return <LoadingIndicator isFullScreen />;
  }

  if (songsError && !currentSong) {
    return <ErrorMessage message={songsError} containerStyle={styles.centeredMessage} />;
  }

  if (!currentSong) {
    return <View style={styles.centeredMessage}><Text>Song not found.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>{currentSong.title}</Text>
        <Text style={styles.composer}>{currentSong.composer || 'Unknown Composer'}</Text>
      </Card>
      {currentSong.lyrics && (
        <Card>
          <Text style={styles.sectionTitle}>Lyrics</Text>
          <Text style={styles.lyrics}>{currentSong.lyrics}</Text>
        </Card>
      )}
      {currentSong.tabsImageUrl && (
        <Card>
          <Text style={styles.sectionTitle}>Guitar Tabs</Text>
          <Image source={{ uri: currentSong.tabsImageUrl }} style={styles.image} resizeMode="contain" />
        </Card>
      )}
      {currentSong.scoreImageUrl && (
        <Card>
          <Text style={styles.sectionTitle}>SATB Score</Text>
          <Image source={{ uri: currentSong.scoreImageUrl }} style={styles.image} resizeMode="contain" />
        </Card>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  composer: { fontSize: 18, color: '#555', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  lyrics: { fontSize: 16, lineHeight: 24 },
  image: { width: '100%', height: 300, marginTop: 10, marginBottom: 10, backgroundColor: '#e0e0e0' },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
});
export default SongDetailScreen;
