import React, { useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  disabled?: boolean;
  activeScale?: number;
}

export function AnimatedButton({
  onPress,
  children,
  style,
  disabled = false,
  activeScale = 0.96,
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (_event: GestureResponderEvent) => {
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  const handlePressOut = (_event: GestureResponderEvent) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.button, style]}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container for the animated transform
  },
  button: {
    // Default button styling - consumers will override
  },
});
