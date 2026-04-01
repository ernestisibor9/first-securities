import React from 'react';
import { 
  StyleSheet, 
  Pressable, 
  ViewStyle, 
  TextStyle, 
  Platform 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
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
  type?: 'primary' | 'secondary' | 'outline';
}

export const BrandButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  type = 'primary'
}: BrandButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'outline': return styles.outlineButton;
      case 'secondary': return styles.secondaryButton;
      default: return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'outline': return { color: Colors.brand.primary };
      case 'secondary': return { color: '#fff' };
      default: return { color: '#fff' };
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          getButtonStyle(),
          style,
          pressed && styles.pressed
        ]}
      >
        <ThemedText 
          type="defaultSemiBold" 
          style={[styles.text, getTextStyle(), textStyle]}
        >
          {title}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginVertical: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
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
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.brand.primary,
  },
  text: {
    fontSize: 16,
  },
  pressed: {
    opacity: 0.9,
  },
});
