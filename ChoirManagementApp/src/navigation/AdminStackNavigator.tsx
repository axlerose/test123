// src/navigation/AdminStackNavigator.tsx
    import React from 'react';
    import { createStackNavigator } from '@react-navigation/stack';
    import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
    import AdminSongScreen from '../screens/admin/AdminSongScreen';
    import AdminRehearsalScreen from '../screens/admin/AdminRehearsalScreen';
    import { AdminStackParamList } from './types';

    const Stack = createStackNavigator<AdminStackParamList>();

    const AdminStackNavigator = () => {
      return (
        <Stack.Navigator>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Control Panel' }} />
          <Stack.Screen name="AdminSongForm" component={AdminSongScreen} options={({ route }) => ({ title: route.params?.songId ? 'Edit Song' : 'Create Song' })} />
          <Stack.Screen name="AdminRehearsalForm" component={AdminRehearsalScreen} options={({ route }) => ({ title: route.params?.rehearsalId ? 'Edit Rehearsal' : 'Create Rehearsal' })} />
        </Stack.Navigator>
      );
    };
    export default AdminStackNavigator;
