import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

import { useOrientation } from '@/hooks/useOrientation';

export const SkeletonRow = () => {
  const { scale } = useOrientation();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { padding: 16 * scale }]}>
      <Animated.View style={[styles.shimmer, styles.title, { height: 18 * scale, borderRadius: 4 * scale }, animatedStyle]} />
      <View style={[styles.rightSide, { gap: 8 * scale }]}>
        <Animated.View style={[styles.shimmer, styles.smallBar, { width: 60 * scale, height: 18 * scale, borderRadius: 4 * scale }, animatedStyle]} />
        <Animated.View style={[styles.shimmer, styles.smallBar, { width: 60 * scale, height: 18 * scale, borderRadius: 4 * scale }, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  shimmer: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  title: {
    width: '40%',
    height: 18,
  },
  rightSide: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBar: {
    width: 60,
    height: 18,
  },
});
