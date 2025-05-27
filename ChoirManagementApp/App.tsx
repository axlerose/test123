// App.tsx (Updated)
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'; // Removed SafeAreaView, StatusBar for now from here
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { SongProvider } from './src/contexts/SongContext';
import { RehearsalProvider } from './src/contexts/RehearsalContext';
import AppTabNavigator from './src/navigation/AppTabNavigator'; // Import the main app navigator
import { LoadingIndicator } from './src/components'; // Assuming LoadingIndicator is in components

const AppRoot = () => {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LoadingIndicator size="large" />
        <Text>Initializing App...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTabNavigator />
      ) : (
        // Simple Login Prompt UI - Can be expanded into its own screen/navigator
        <View style={styles.centered}>
          <Text style={styles.title}>Choir Management App</Text>
          <Text style={{marginBottom: 20}}>Please log in to continue.</Text>
          <Button title="Login with Keycloak" onPress={login} />
        </View>
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SongProvider>
        <RehearsalProvider>
          <AppRoot />
        </RehearsalProvider>
      </SongProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
