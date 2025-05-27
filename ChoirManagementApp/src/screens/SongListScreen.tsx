// src/screens/SongListScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useSongs } from '../contexts/SongContext';
import { CustomButton, ErrorMessage, ListItem, LoadingIndicator } from '../components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SongStackParamList } from '../navigation/types';
import { SongResponseDto } from '../types/api';

type SongListNavigationProp = NavigationProp<SongStackParamList, 'SongList'>;

const SongListScreen = () => {
  const { songsPage, isLoadingSongs, songsError, fetchSongs } = useSongs();
  const navigation = useNavigation<SongListNavigationProp>();

  useEffect(() => {
    fetchSongs(undefined, { page: 0, size: 20 }); // Initial fetch
  }, [fetchSongs]);

  const renderSongItem = ({ item }: { item: SongResponseDto }) => (
    <ListItem
      title={item.title}
      subtitle={item.composer || 'Unknown Composer'}
      onPress={() => navigation.navigate('SongDetail', { songId: item.id })}
    />
  );

  if (isLoadingSongs && !songsPage?.content?.length) {
    return <LoadingIndicator isFullScreen />;
  }

  if (songsError) {
    return <ErrorMessage message={songsError} containerStyle={styles.centeredMessage} />;
  }
  
  if (!songsPage || songsPage.content.length === 0) {
     return <View style={styles.centeredMessage}><Text>No songs found.</Text><CustomButton title="Retry" onPress={() => fetchSongs(undefined, { page: 0, size: 20 })}/></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songsPage.content}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={isLoadingSongs ? <LoadingIndicator /> : null}
        // Add onEndReached for pagination later
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
});
export default SongListScreen;
