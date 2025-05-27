// src/navigation/SongStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SongListScreen from '../screens/SongListScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import { SongStackParamList } from './types';

const Stack = createStackNavigator<SongStackParamList>();

const SongStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SongList" component={SongListScreen} options={{ title: 'Repertoire' }} />
      <Stack.Screen name="SongDetail" component={SongDetailScreen} options={{ title: 'Song Details' }} />
    </Stack.Navigator>
  );
};
export default SongStackNavigator;
