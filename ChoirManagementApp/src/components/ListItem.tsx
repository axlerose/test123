// src/components/ListItem.tsx
import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, onPress, style, leftIcon, rightIcon }) => {
  const content = (
    <View style={styles.contentContainer}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.container, styles.nonTappableContainer, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nonTappableContainer: {
    // Add any specific styles for non-tappable items if needed
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: 8,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default ListItem;
