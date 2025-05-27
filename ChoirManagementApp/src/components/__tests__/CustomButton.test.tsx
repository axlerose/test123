// src/components/__tests__/CustomButton.test.tsx
    import React from 'react';
    import { render, fireEvent } from '@testing-library/react-native';
    import CustomButton from '../CustomButton';

    describe('CustomButton', () => {
      it('renders correctly with a title', () => {
        const { getByText } = render(<CustomButton title="Test Button" onPress={() => {}} />);
        expect(getByText('Test Button')).toBeTruthy();
      });

      it('calls onPress when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(<CustomButton title="Press Me" onPress={mockOnPress} />);
        fireEvent.press(getByText('Press Me'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      });

      it('is disabled when the disabled prop is true', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
          <CustomButton title="Disabled Button" onPress={mockOnPress} disabled={true} />
        );
        const buttonElement = getByText('Disabled Button');
        // TouchableOpacity's disabled prop is passed down.
        // We can check if onPress is not called.
        fireEvent.press(buttonElement);
        expect(mockOnPress).not.toHaveBeenCalled();
        // Check style if disabled style is visually distinct and testable, or rely on behavior.
        // For example, if opacity changes, it's harder to test directly without snapshot or specific style checks.
      });
    });
