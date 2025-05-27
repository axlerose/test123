// src/screens/admin/AdminRehearsalScreen.tsx
    import React, { useState, useEffect, useCallback } from 'react';
    import { View, StyleSheet, ScrollView, Alert, Text, FlatList } from 'react-native';
    import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
    import { useRehearsals } from '../../contexts/RehearsalContext';
    import { InputField, CustomButton, LoadingIndicator, ErrorMessage, ListItem } from '../../components';
    import { RehearsalRequestDto, RehearsalSongDto } from '../../types/api';
    import { RehearsalStackParamList } from '../../navigation/types'; // Assuming admin screens could be part of a rehearsal stack

    type AdminRehearsalScreenRouteProp = RouteProp<{ AdminRehearsalForm: { rehearsalId?: number } }, 'AdminRehearsalForm'>;
    type AdminRehearsalNavigationProp = NavigationProp<RehearsalStackParamList>;


    const AdminRehearsalScreen = () => {
      const navigation = useNavigation<AdminRehearsalNavigationProp>();
      const route = useRoute<AdminRehearsalScreenRouteProp>();
      const { rehearsalId } = route.params || {};

      const { currentRehearsal, fetchRehearsalById, addRehearsal, updateRehearsalState, isLoadingRehearsals, rehearsalsError, clearCurrentRehearsal } = useRehearsals();

      const [dateTime, setDateTime] = useState(''); // ISO string e.g. "2024-08-15T19:00:00"
      const [location, setLocation] = useState('');
      const [notes, setNotes] = useState('');
      const [songs, setSongs] = useState<RehearsalSongDto[]>([]);
      const [formError, setFormError] = useState<string | null>(null);

      // For adding new songs to the list
      const [newSongId, setNewSongId] = useState('');
      const [newSongOrder, setNewSongOrder] = useState('');


      const isEditMode = !!rehearsalId;

      useEffect(() => {
        if (isEditMode && rehearsalId) {
          fetchRehearsalById(rehearsalId);
        }
        return () => {
          clearCurrentRehearsal();
        };
      }, [rehearsalId, isEditMode, fetchRehearsalById, clearCurrentRehearsal]);

      useEffect(() => {
        if (isEditMode && currentRehearsal && currentRehearsal.id === rehearsalId) {
          setDateTime(currentRehearsal.dateTime);
          setLocation(currentRehearsal.location || '');
          setNotes(currentRehearsal.notes || '');
          setSongs(currentRehearsal.songs || []);
        } else if (!isEditMode) {
            setDateTime(''); setLocation(''); setNotes(''); setSongs([]);
        }
      }, [currentRehearsal, isEditMode, rehearsalId]);
      
      const handleAddSongToList = () => {
        const songIdNum = parseInt(newSongId, 10);
        const songOrderNum = parseInt(newSongOrder, 10);

        if (isNaN(songIdNum) || songIdNum <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid Song ID.');
            return;
        }
        if (isNaN(songOrderNum) || songOrderNum <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid Song Order (positive number).');
            return;
        }
        if (songs.find(s => s.songId === songIdNum)) {
            Alert.alert('Duplicate Song', 'This song ID is already in the list.');
            return;
        }
        if (songs.find(s => s.songOrder === songOrderNum)) {
            Alert.alert('Duplicate Order', 'This song order is already used.');
            return;
        }

        setSongs(prevSongs => [...prevSongs, { songId: songIdNum, songOrder: songOrderNum }].sort((a,b) => a.songOrder - b.songOrder));
        setNewSongId('');
        setNewSongOrder('');
      };

      const handleRemoveSongFromList = (songIdToRemove: number) => {
        setSongs(prevSongs => prevSongs.filter(s => s.songId !== songIdToRemove));
      };


      const handleSubmit = async () => {
        setFormError(null);
        if (!dateTime.trim()) { // Basic validation, can use a date picker later
          setFormError('Date/Time is required.');
          return;
        }
        if (songs.length === 0) {
            setFormError('At least one song is required for the rehearsal.');
            return;
        }

        const rehearsalData: RehearsalRequestDto = { dateTime, location, notes, songs };

        let success = false;
        let result = null;
        if (isEditMode && rehearsalId) {
          result = await updateRehearsalState(rehearsalId, rehearsalData);
          if (result) success = true;
        } else {
          result = await addRehearsal(rehearsalData);
          if (result) success = true;
        }

        if (success && result) {
          Alert.alert('Success', `Rehearsal ${isEditMode ? 'updated' : 'created'} successfully!`);
          navigation.goBack();
        } else if (!isLoadingRehearsals) {
            setFormError(rehearsalsError || 'Failed to save rehearsal. Please try again.');
        }
      };

      return (
        <ScrollView style={styles.container}>
          <Text style={styles.header}>{isEditMode ? 'Edit Rehearsal' : 'Create New Rehearsal'}</Text>
          <InputField label="Date/Time (YYYY-MM-DDTHH:MM:SS)" value={dateTime} onChangeText={setDateTime} placeholder="e.g., 2024-08-15T19:00:00" error={formError && formError.includes('Date/Time') ? formError : null}/>
          <InputField label="Location" value={location} onChangeText={setLocation} placeholder="Enter location" />
          <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Enter notes (optional)" multiline numberOfLines={4} />

          <View style={styles.songListSection}>
            <Text style={styles.subHeader}>Songs for Rehearsal</Text>
            <FlatList
                data={songs}
                keyExtractor={(item) => item.songId.toString()}
                renderItem={({item}) => (
                    <ListItem 
                        title={`Song ID: ${item.songId}`} 
                        subtitle={`Order: ${item.songOrder}`}
                        rightIcon={<CustomButton title="X" onPress={() => handleRemoveSongFromList(item.songId)} style={styles.removeButton} textStyle={styles.removeButtonText}/>}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No songs added yet.</Text>}
            />
            <View style={styles.addSongContainer}>
                <InputField inputStyle={styles.smallInput} value={newSongId} onChangeText={setNewSongId} placeholder="Song ID" keyboardType="numeric"/>
                <InputField inputStyle={styles.smallInput} value={newSongOrder} onChangeText={setNewSongOrder} placeholder="Order" keyboardType="numeric"/>
                <CustomButton title="Add Song" onPress={handleAddSongToList} style={styles.addButton} />
            </View>
          </View>
          
          {isLoadingRehearsals && <LoadingIndicator />}
          {rehearsalsError && !formError && <ErrorMessage message={rehearsalsError} />}
          {formError && <ErrorMessage message={formError} />}

          <CustomButton title={isEditMode ? 'Save Changes' : 'Create Rehearsal'} onPress={handleSubmit} disabled={isLoadingRehearsals} />
        </ScrollView>
      );
    };

    const styles = StyleSheet.create({
      container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
      header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
      subHeader: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 10 },
      songListSection: { marginVertical: 20, padding:10, borderWidth:1, borderColor:'#ddd', borderRadius: 5},
      addSongContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
      smallInput: { flex:1, marginRight: 10, paddingVertical: 8 },
      addButton: { paddingVertical: 8, minWidth: 100 },
      removeButton: { backgroundColor: '#dc3545', paddingVertical: 5, paddingHorizontal: 10, borderRadius:4 },
      removeButtonText: { fontSize: 12, color: 'white' },
      emptyText: { textAlign: 'center', color: '#777', marginVertical: 10 }
    });

    export default AdminRehearsalScreen;
