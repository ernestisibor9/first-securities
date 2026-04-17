import React from 'react';
import { 
  StyleSheet, 
  Pressable, 
  ViewStyle, 
  TextStyle, 
  Platform,
  ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useOrientation } from '@/hooks/useOrientation';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

interface BrandButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  type?: 'primary' | 'secondary' | 'outline' | 'yellow';
  disabled?: boolean;
  loading?: boolean;
}

export const BrandButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  type = 'primary',
  disabled = false,
  loading = false
}: BrandButtonProps) => {
  const { scale: globalScale } = useOrientation();
  const pressScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  const handlePressIn = () => {
    if (disabled) return;
    pressScale.value = withSpring(0.96);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'outline': return styles.outlineButton;
      case 'secondary': return styles.secondaryButton;
      case 'yellow': return styles.yellowButton;
      default: return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'outline': return { color: Colors.brand.primary };
      case 'yellow': return { color: '#11181C' };
      default: return { color: '#fff' };
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          getButtonStyle(),
          { paddingVertical: 16 * globalScale, borderRadius: 12 * globalScale },
          style,
          pressed && styles.pressed
        ]}
      >
        {loading ? (
          <ActivityIndicator color={type === 'yellow' ? '#11181C' : '#fff'} />
        ) : (
          <ThemedText 
            type="defaultSemiBold" 
            style={[
              styles.text, 
              { fontSize: 16 * globalScale },
              getTextStyle(), 
              textStyle
            ]}
          >
            {title}
          </ThemedText>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: Colors.brand.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.brand.secondary,
  },
  yellowButton: {
    backgroundColor: Colors.brand.yellow,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.brand.primary,
  },
  text: {
  },
  pressed: {
    opacity: 0.9,
  },
});
