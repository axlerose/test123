// src/navigation/AppTabNavigator.tsx (Updated)
    import React from 'react';
    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
    import SongStackNavigator from './SongStackNavigator';
    import RehearsalStackNavigator from './RehearsalStackNavigator';
    import AdminStackNavigator from './AdminStackNavigator'; // Import Admin Stack
    import { AppTabParamList } from './types';
    import { useAuth } from '../contexts/AuthContext'; // Import useAuth

    const Tab = createBottomTabNavigator<AppTabParamList>();

    const AppTabNavigator = () => {
      const { isAdmin } = useAuth(); // Get isAdmin flag

      return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="SongsTab"
            component={SongStackNavigator}
            options={{ tabBarLabel: 'Repertoire' /* tabBarIcon: ... */ }}
          />
          <Tab.Screen
            name="RehearsalsTab"
            component={RehearsalStackNavigator}
            options={{ tabBarLabel: 'Practices' /* tabBarIcon: ... */ }}
          />
          {isAdmin && ( // Conditionally render AdminTab
            <Tab.Screen
              name="AdminTab"
              component={AdminStackNavigator}
              options={{ tabBarLabel: 'Admin' /* tabBarIcon: ... */ }}
            />
          )}
        </Tab.Navigator>
      );
    };
    export default AppTabNavigator;
