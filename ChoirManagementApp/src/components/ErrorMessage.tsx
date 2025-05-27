// src/components/ErrorMessage.tsx
import React from 'react';
import { Text, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'; // Added ViewStyle

interface ErrorMessageProps {
  message: string | null | undefined;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style, containerStyle }) => {
  if (!message) {
    return null;
  }
  return (
    <View style={[styles.container, containerStyle]}>
        <Text style={[styles.errorText, style]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffebee', // Light red background
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: '#c62828', // Darker red text
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ErrorMessage;
