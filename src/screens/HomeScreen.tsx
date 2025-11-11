import React, { useState, useRef, useEffect } from 'react';
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
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, lonelySignal, setLonelySignal, createSignal, cancelSignal, todaySignalCount, todayIntensitySum, trackTodaySignal, authToken } = useUser();
  const [responseCount, setResponseCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [intensity, setIntensity] = useState(0);
  const [lastHitTime, setLastHitTime] = useState<number | null>(null); // 最後一次拍打時間（用 state 以便觸發 useEffect）
  
  const autoSendTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 5秒自動發送計時器
  const hasSentSignalRef = useRef<boolean>(false);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const statusCardAnim = useRef(new Animated.Value(0)).current;
  const hitAnim = useRef(new Animated.Value(1)).current; // 拍打動畫（scaleY）
  const shakeAnim = useRef(new Animated.Value(0)).current; // 震動動畫
  const rotateAnim = useRef(new Animated.Value(0)).current; // 旋轉動畫
  const colorAnim = useRef(new Animated.Value(0)).current; // 顏色變化動畫
  
  // 初始加载动画
  useEffect(() => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // 拍打動畫（向下壓縮 + 震動 + 旋轉 + 顏色變化）
  const playHitAnimation = () => {
    // 觸覺反饋 - 強烈震動
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // 重置動畫值
    shakeAnim.setValue(0);
    rotateAnim.setValue(0);
    colorAnim.setValue(0);
    
    // 並行動畫：壓縮 + 震動 + 旋轉 + 顏色
    Animated.parallel([
      // 壓縮動畫（更強烈）
      Animated.sequence([
        Animated.timing(hitAnim, {
          toValue: 0.6, // 壓縮到60%（更扁）
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(hitAnim, {
          toValue: 1,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // 震動動畫（左右搖擺）
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      // 旋轉動畫（被拍打時稍微旋轉）
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(rotateAnim, {
          toValue: 0,
          tension: 300,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      // 顏色變化（被拍打時變紅）
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false, // 顏色動畫不能用 native driver
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };
  
  // 根據強度獲取痛苦表情
  const getRabbitFace = (intensity: number): string => {
    if (intensity === 0) return '🧸'; // 正常熊
    if (intensity < 20) return '😐'; // 開始不舒服
    if (intensity < 40) return '😟'; // 有點痛苦
    if (intensity < 60) return '😰'; // 很痛苦
    if (intensity < 80) return '😭'; // 非常痛苦
    return '😱'; // 極度痛苦
  };
  
  // 5秒無操作後自動發送訊號
  useEffect(() => {
    // 清除之前的計時器
    if (autoSendTimeoutRef.current) {
      clearTimeout(autoSendTimeoutRef.current);
      autoSendTimeoutRef.current = null;
    }
    
    // 如果有最後一次拍打時間且強度 > 0，設置5秒計時器
    if (lastHitTime && intensity > 0 && !lonelySignal) {
      const timeSinceLastHit = Date.now() - lastHitTime;
      const remainingTime = Math.max(0, 5000 - timeSinceLastHit);
      
      if (remainingTime > 0) {
        console.log(`⏰ 設置 ${remainingTime}ms 後自動發送訊號，當前強度:`, intensity);
        autoSendTimeoutRef.current = setTimeout(() => {
          console.log('⏰ 5秒無操作，自動發送訊號，強度:', intensity);
          sendSignal(intensity);
          // 重置
          setIntensity(0);
          setLastHitTime(null);
        }, remainingTime);
      } else {
        // 已經超過5秒，立即發送
        console.log('⏰ 已超過5秒，立即發送訊號，強度:', intensity);
        sendSignal(intensity);
        setIntensity(0);
        setLastHitTime(null);
      }
    }
    
    return () => {
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current);
        autoSendTimeoutRef.current = null;
      }
    };
  }, [intensity, lastHitTime, lonelySignal]);

  // 拍打兔子（點擊時）
  const handleHit = () => {
    if (lonelySignal) {
      // 如果已有訊號，點擊取消
      sendSignal(0);
      return;
    }
    
    // 播放拍打動畫
    playHitAnimation();
    
    // 增加強度（每次拍打 +5，最多200）
    setIntensity(prev => {
      const newIntensity = Math.min(prev + 5, 200);
      console.log('👊 拍打兔子，強度:', newIntensity);
      return newIntensity;
    });
    
    // 更新最後拍打時間
    setLastHitTime(Date.now());
    
    // 重置5秒計時器（會在 useEffect 中處理）
  };

  const sendSignal = async (intensityValue: number = 0) => {
    if (lonelySignal) {
      // 取消信號
      // 清除自动隐藏定时器
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
      }
      
      const response = await cancelSignal(lonelySignal.id);
      if (response.success) {
        // 隐藏动画
        Animated.timing(statusCardAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setLonelySignal(null);
          setResponseCount(0);
        });
        console.log('✅ 信號已取消');
      } else {
        console.error('❌ 取消信號失敗:', response.error);
      }
    } else {
      // 發送焦慮信號
      const response = await createSignal();
      if (response.success) {
        setLonelySignal(response.data);
        setResponseCount(0);
        // 記錄今日統計
        trackTodaySignal(intensityValue || intensity);
        console.log('📡 焦慮信號已發送，強度:', intensityValue || intensity);
        
        // 重置強度和計時器
        setIntensity(0);
        setLastHitTime(null);
        if (autoSendTimeoutRef.current) {
          clearTimeout(autoSendTimeoutRef.current);
          autoSendTimeoutRef.current = null;
        }
        
        // 显示状态卡片动画
        statusCardAnim.setValue(0);
        Animated.spring(statusCardAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
        
        // 2.5秒后自动隐藏状态卡片，回到兔子画面
        if (autoHideTimeoutRef.current) {
          clearTimeout(autoHideTimeoutRef.current);
        }
        autoHideTimeoutRef.current = setTimeout(() => {
          // 隐藏动画
          Animated.timing(statusCardAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setLonelySignal(null);
            setResponseCount(0);
          });
        }, 2500);
      } else {
        console.error('❌ 發送信號失敗:', response.error);
      }
    }
  };

  const handlePressIn = () => {
    setIsPressed(true);
    // 按下時稍微壓縮（視覺反饋）
    Animated.timing(hitAnim, {
      toValue: 0.95,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    // 鬆開時恢復
    Animated.spring(hitAnim, {
      toValue: 1,
      tension: 300,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    return () => {
      if (autoSendTimeoutRef.current) {
        clearTimeout(autoSendTimeoutRef.current);
      }
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, []);

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
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Statistics' as never)}
          activeOpacity={0.8}
        >
          <Ionicons name="stats-chart" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* 今日統計 */}
          <View style={styles.todayStatsRow}>
            <View style={styles.todayCard}>
              <Text style={styles.todayLabel}>今日發送</Text>
              <Text style={styles.todayValue}>{todaySignalCount}</Text>
            </View>
            <View style={styles.todayCard}>
              <Text style={styles.todayLabel}>今日累積強度</Text>
              <Text style={styles.todayValue}>{todayIntensitySum}</Text>
            </View>
          </View>
          {!lonelySignal ? (
            <View style={styles.lonelyContainer}>
              <View style={styles.heartWrapper}>
                <Animated.View
                  style={[
                    styles.lonelyCircle,
                    {
                      transform: [
                        { scale: scaleAnim },
                        { scaleY: hitAnim }, // 拍打時向下壓縮
                        {
                          translateX: shakeAnim.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [-15, 0, 15], // 左右震動15px
                          }),
                        },
                        {
                          rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '8deg'], // 旋轉8度
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={handleHit}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={1}
                    style={styles.touchableArea}
                  >
                    <Animated.View
                      style={[
                        styles.lonelyGradient,
                        {
                          backgroundColor: colorAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['transparent', 'rgba(255, 0, 0, 0.3)'], // 被拍打時變紅
                          }),
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={['#FF6B6B', '#FFB6B6']}
                        style={styles.lonelyGradientInner}
                      >
                        <Text style={styles.rabbitEmoji}>
                          {getRabbitFace(intensity)}
                        </Text>
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
                
                {/* 孤单强度指数显示 */}
                {intensity > 0 && (
                  <View style={styles.intensityContainer}>
                    <View style={styles.intensityBox}>
                      <Text style={styles.intensityLabel}>孤單強度指數</Text>
                      <Text style={styles.intensityValue}>{intensity}</Text>
                    </View>
                  </View>
                )}
              </View>
              
              <Text style={styles.mainText}>感到焦慮了嗎？</Text>
              <Text style={styles.subText}>
                拍打熊熊累積強度{'\n'}
                5秒不拍打會自動發送訊號
              </Text>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.statusCard,
                {
                  opacity: statusCardAnim,
                  transform: [
                    {
                      scale: statusCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                    {
                      translateY: statusCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
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
            </Animated.View>
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
    paddingTop: 60,
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
    paddingTop: 30, // 再調低整體頂部間距，讓上方統計更往上
  },
  todayStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  todayCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  todayLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    fontWeight: '500',
  },
  todayValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  lonelyContainer: {
    alignItems: 'center',
  },
  heartWrapper: {
    alignItems: 'center',
    marginTop: 60, // 再增加頂部間距，避免與上方統計重疊
    marginBottom: 50, // 增加底部间距，防止文字压到爱心
  },
  lonelyCircle: {
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  touchableArea: {
    width: 280,
    height: 280,
  },
  lonelyGradient: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lonelyGradientInner: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 36,
  },
  rabbitEmoji: {
    fontSize: 110,
    textAlign: 'center',
  },
  intensityContainer: {
    position: 'absolute',
    bottom: -60,
    alignItems: 'center',
  },
  intensityBox: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFB6B6',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  intensityLabel: {
    fontSize: 11,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  intensityValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 60, // 再增加一点顶部间距，让文字往下移
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