// src/screens/RehearsalCalendarScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useRehearsals } from '../contexts/RehearsalContext';
import { ListItem, LoadingIndicator, ErrorMessage, CustomButton } from '../components';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { RehearsalStackParamList } from '../navigation/types';
import { RehearsalResponseDto } from '../types/api';

// type RehearsalNavigationProp = NavigationProp<RehearsalStackParamList, 'RehearsalCalendar'>;

const RehearsalCalendarScreen = () => {
  const { rehearsalsPage, isLoadingRehearsals, rehearsalsError, fetchRehearsals } = useRehearsals();
  // const navigation = useNavigation<RehearsalNavigationProp>();

  useEffect(() => {
    fetchRehearsals(undefined, undefined, { page: 0, size: 20 }); // Initial fetch
  }, [fetchRehearsals]);

  const renderRehearsalItem = ({ item }: { item: RehearsalResponseDto }) => (
    <ListItem
      title={`Practice on ${new Date(item.dateTime).toLocaleDateString()} at ${new Date(item.dateTime).toLocaleTimeString()}`}
      subtitle={item.location || 'No location specified'}
      // onPress={() => navigation.navigate('RehearsalDetail', { rehearsalId: item.id })} // For future
    />
  );

  if (isLoadingRehearsals && !rehearsalsPage?.content?.length) {
    return <LoadingIndicator isFullScreen />;
  }

  if (rehearsalsError) {
    return <ErrorMessage message={rehearsalsError} containerStyle={styles.centeredMessage} />;
  }
  
  if (!rehearsalsPage || rehearsalsPage.content.length === 0) {
     return <View style={styles.centeredMessage}><Text>No rehearsals found.</Text><CustomButton title="Retry" onPress={() => fetchRehearsals(undefined, undefined, { page: 0, size: 20 })}/></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rehearsalsPage.content}
        renderItem={renderRehearsalItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={isLoadingRehearsals ? <LoadingIndicator /> : null}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
});
export default RehearsalCalendarScreen;
