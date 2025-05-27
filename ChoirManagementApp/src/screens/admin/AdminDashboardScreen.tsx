// src/screens/admin/AdminDashboardScreen.tsx
    import React from 'react';
    import { View, StyleSheet, Text } from 'react-native';
    import { useNavigation, NavigationProp } from '@react-navigation/native';
    import { CustomButton } from '../../components';
    import { AdminStackParamList } from '../../navigation/types';

    type AdminDashboardNavigationProp = NavigationProp<AdminStackParamList, 'AdminDashboard'>;

    const AdminDashboardScreen = () => {
      const navigation = useNavigation<AdminDashboardNavigationProp>();

      return (
        <View style={styles.container}>
          <Text style={styles.header}>Admin Dashboard</Text>
          <CustomButton
            title="Create New Song"
            onPress={() => navigation.navigate('AdminSongForm', {})} // No songId means create mode
          />
          {/* Future: Button to "Manage Existing Songs" (navigate to a list) */}
          <CustomButton
            title="Create New Rehearsal"
            onPress={() => navigation.navigate('AdminRehearsalForm', {})} // No rehearsalId means create mode
          />
          {/* Future: Button to "Manage Existing Rehearsals" */}
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0', alignItems: 'center' },
      header: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    });

    export default AdminDashboardScreen;
