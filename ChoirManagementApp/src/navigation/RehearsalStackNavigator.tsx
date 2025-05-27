// src/navigation/RehearsalStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RehearsalCalendarScreen from '../screens/RehearsalCalendarScreen';
// import RehearsalDetailScreen from '../screens/RehearsalDetailScreen'; // For future
import { RehearsalStackParamList } from './types';

const Stack = createStackNavigator<RehearsalStackParamList>();

const RehearsalStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RehearsalCalendar" component={RehearsalCalendarScreen} options={{ title: 'Practices' }} />
      {/* <Stack.Screen name="RehearsalDetail" component={RehearsalDetailScreen} options={{ title: 'Practice Details' }} /> */}
    </Stack.Navigator>
  );
};
export default RehearsalStackNavigator;
