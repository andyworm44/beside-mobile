import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
  const { user, lonelySignal, setLonelySignal } = useUser();
  const [responseCount, setResponseCount] = useState(0);
  // 移除複雜的動畫，使用簡單的實現

  const handleLonelyClick = () => {
    if (lonelySignal) {
      // 取消信號
      setLonelySignal(null);
      setResponseCount(0);
    } else {
      // 發送寂寞信號
      const newSignal = {
        id: Date.now().toString(),
        userId: user?.id || '',
        timestamp: Date.now(),
        responses: [],
      };
      setLonelySignal(newSignal);
      setResponseCount(0);
      
      // 模擬收到回應的動畫效果
      setTimeout(() => {
        setResponseCount(1);
        console.log('💝 小明說：「我陪你」');
      }, 1500);
      setTimeout(() => {
        setResponseCount(2);
        console.log('💝 小美說：「我陪你」');
      }, 3000);
      setTimeout(() => {
        setResponseCount(3);
        console.log('💝 阿華說：「我陪你」');
      }, 4500);
      setTimeout(() => {
        setResponseCount(4);
        console.log('💝 小芳說：「我陪你」');
        // 當有人回應後，信號自動消失（模擬被回應）
        setTimeout(() => {
          setLonelySignal(null);
          setResponseCount(0);
          console.log('✅ 信號已被回應，自動消失');
        }, 2000);
      }, 6000);
    }
  };

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      {/* 移除狀態欄，使用系統狀態欄 */}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <LinearGradient
            colors={['#FF8E8E', '#FFB6B6']}
            style={styles.userAvatar}
          >
            <Ionicons name="person" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.userName}>{user?.name || '用戶'}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {!lonelySignal ? (
            <View style={styles.lonelyContainer}>
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
              
              <Text style={styles.mainText}>感到寂寞了嗎？</Text>
              <Text style={styles.subText}>
                輕觸上方按鈕{'\n'}
                讓附近的人知道你需要陪伴
              </Text>
            </View>
          ) : (
            <View style={styles.statusCard}>
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
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
  scrollView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
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