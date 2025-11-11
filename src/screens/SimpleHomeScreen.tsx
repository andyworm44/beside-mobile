import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SimpleHomeScreen() {
  const [lonelySignal, setLonelySignal] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  const handleLonelyClick = () => {
    if (lonelySignal) {
      setLonelySignal(false);
      setResponseCount(0);
    } else {
      setLonelySignal(true);
      // 模擬收到回應
      setTimeout(() => {
        setResponseCount(3);
      }, 2000);
    }
  };

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>12:35</Text>
        <View style={styles.statusIcons}>
          <Text style={styles.statusIcon}>●●●</Text>
          <Text style={styles.statusIcon}>📶</Text>
          <Text style={styles.statusIcon}>📶</Text>
          <Text style={styles.statusIcon}>🔋</Text>
        </View>
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <LinearGradient
            colors={['#FF8E8E', '#FFB6B6']}
            style={styles.userAvatar}
          >
            <Ionicons name="person" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.userName}>andy</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {!lonelySignal ? (
          <Animated.View
            style={[
              styles.lonelyContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.lonelyCircle}
              onPress={handleLonelyClick}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FFB6B6']}
                style={styles.lonelyGradient}
              >
                <Ionicons name="heart" size={60} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            
            <Text style={styles.mainText}>感到焦慮了嗎？</Text>
            <Text style={styles.subText}>
              輕觸上方按鈕{'\n'}
              讓附近的人知道你需要陪伴
            </Text>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.statusCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })}],
              },
            ]}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.statusIcon}
            >
              <Ionicons name="send" size={30} color="white" />
            </LinearGradient>
            
            <Text style={styles.statusTitle}>你的信號已發出</Text>
            <Text style={styles.statusDesc}>附近的人可以看到你需要陪伴</Text>
            
            <Text style={styles.responseCount}>{responseCount}</Text>
            <Text style={styles.responseLabel}>人說「我陪你」</Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleLonelyClick}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>取消信號</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
    color: '#333',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  lonelyContainer: {
    alignItems: 'center',
  },
  lonelyCircle: {
    marginBottom: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  lonelyGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 10,
    width: '100%',
    maxWidth: 350,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  statusDesc: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  responseCount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  responseLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#FFE0E0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600',
  },
});

