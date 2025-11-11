import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E8E']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>Beside</Text>
        <Text style={styles.tagline}>Someone's here.</Text>
        <Text style={styles.description}>
          在焦慮的時候{'\n'}
          總有人陪在你身邊
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
});

