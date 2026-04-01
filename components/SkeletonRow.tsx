import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const SkeletonRow = () => {
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
    <View style={styles.container}>
      <Animated.View style={[styles.shimmer, styles.title, animatedStyle]} />
      <View style={styles.rightSide}>
        <Animated.View style={[styles.shimmer, styles.smallBar, animatedStyle]} />
        <Animated.View style={[styles.shimmer, styles.smallBar, animatedStyle]} />
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
