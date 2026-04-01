import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

export const SkeletonCard = () => {
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
    <View style={styles.card}>
      <Animated.View style={[styles.shimmer, styles.title, animatedStyle]} />
      <Animated.View style={[styles.shimmer, styles.descLine1, animatedStyle]} />
      <Animated.View style={[styles.shimmer, styles.descLine2, animatedStyle]} />
      <View style={styles.footer}>
        <Animated.View style={[styles.shimmer, styles.smallBar, animatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shimmer: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  title: {
    width: '80%',
    height: 18,
    marginBottom: 12,
  },
  descLine1: {
    width: '100%',
    height: 14,
    marginBottom: 8,
  },
  descLine2: {
    width: '90%',
    height: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smallBar: {
    width: 60,
    height: 12,
  },
});
