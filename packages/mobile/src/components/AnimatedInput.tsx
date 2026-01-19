import React, { useRef, useState } from 'react';
import {
  Animated,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';

interface AnimatedInputProps extends TextInputProps {
  focusBorderColor?: string;
  unfocusedBorderColor?: string;
  containerStyle?: ViewStyle;
}

export function AnimatedInput({
  focusBorderColor = colors.primary,
  unfocusedBorderColor = 'transparent',
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...textInputProps
}: AnimatedInputProps) {
  const borderAnim = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // borderColor cannot use native driver
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const animatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [unfocusedBorderColor, focusBorderColor],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          borderColor: animatedBorderColor,
          borderWidth: 2,
        },
      ]}
    >
      <TextInput
        {...textInputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[styles.input, style]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    // Default input styling - consumers will override
  },
});
