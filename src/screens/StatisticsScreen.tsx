import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const { user, authToken, todaySignalCount, todayIntensitySum } = useUser();
  const fadeAnimRef = useRef(new Animated.Value(0));
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('today');
  const [statistics, setStatistics] = useState({
    totalSignalsSent: 0,
    totalResponsesReceived: 0,
    totalAccompanied: 0,
    peopleHelped: 0,
    avgResponseTime: 0,
    activeDays: 0,
    avgIntensity: 0,
    maxIntensity: 0,
    signalHourlyData: new Array(24).fill(0),
    dailyActivity: new Array(7).fill(0),
  });
  const [signalData, setSignalData] = useState<any[]>([]);

  // 從API獲取統計數據
  const loadStatistics = useCallback(async () => {
    if (!authToken) return;
    
    try {
      const response = await apiService.getStatistics(authToken);
      if (response.success && response.data) {
        const signals = response.data.signals || [];
        setSignalData(signals);
        
        // 計算統計數據
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // 24小時分布
        const hourlyData = new Array(24).fill(0);
        signals.forEach((signal: any) => {
          const signalDate = new Date(signal.created_at);
          if (signalDate >= today) {
            const hour = signalDate.getHours();
            hourlyData[hour]++;
          }
        });
        
        // 最近7天分布
        const dailyData = new Array(7).fill(0);
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(today);
          dayStart.setDate(dayStart.getDate() - (6 - i));
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);
          
          const count = signals.filter((signal: any) => {
            const signalDate = new Date(signal.created_at);
            return signalDate >= dayStart && signalDate < dayEnd;
          }).length;
          dailyData[i] = count;
        }
        
        // 計算平均強度（使用今日累積強度除以今日信號次數）
        const avgIntensity = todaySignalCount > 0 && todayIntensitySum > 0 
          ? Math.round(todayIntensitySum / todaySignalCount) 
          : 0;
        
        setStatistics({
          totalSignalsSent: response.data.totalSignalsSent || 0,
          totalResponsesReceived: response.data.totalResponsesReceived || 0,
          totalAccompanied: response.data.totalAccompanied || 0,
          peopleHelped: 0, // 可以後續計算
          avgResponseTime: 0, // 可以後續計算
          activeDays: new Set(signals.map((s: any) => new Date(s.created_at).toDateString())).size,
          avgIntensity: avgIntensity,
          maxIntensity: 0, // 可以後續計算
          signalHourlyData: hourlyData,
          dailyActivity: dailyData,
        });
      }
    } catch (error) {
      console.error('Load statistics error:', error);
    }
  }, [authToken, todaySignalCount, todayIntensitySum]);

  // 根據選擇的時間範圍獲取對應的數據和標籤
  const getChartData = () => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        // 今日：24小時數據
        return {
          data: statistics.signalHourlyData,
          labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          title: '今日發送信號時間分布'
        };
      case 'week':
        // 最近7天
        return {
          data: statistics.dailyActivity,
          labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
          title: '最近7天活動趨勢'
        };
      case 'month':
        // 本月：計算每週數據
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyData = new Array(5).fill(0);
        const weekLabels = ['第1週', '第2週', '第3週', '第4週', '第5週'];
        
        signalData.forEach((signal: any) => {
          const signalDate = new Date(signal.created_at);
          if (signalDate >= monthStart) {
            const weekIndex = Math.floor((signalDate.getDate() - 1) / 7);
            if (weekIndex < 5) {
              monthlyData[weekIndex]++;
            }
          }
        });
        
        return {
          data: monthlyData,
          labels: weekLabels,
          title: '本月活動趨勢'
        };
      case 'year':
        // 全年：12個月
        const yearlyData = new Array(12).fill(0);
        const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        
        signalData.forEach((signal: any) => {
          const signalDate = new Date(signal.created_at);
          const monthIndex = signalDate.getMonth();
          yearlyData[monthIndex]++;
        });
        
        return {
          data: yearlyData,
          labels: monthLabels,
          title: '全年活動趨勢'
        };
      default:
        return {
          data: statistics.signalHourlyData,
          labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          title: '今日發送信號時間分布'
        };
    }
  };

  const chartData = getChartData();
  
  // 根據不同時間範圍設定最大刻度值
  const getMaxScale = () => {
    switch (selectedPeriod) {
      case 'today':
        return 20; // 每小時最高20次
      case 'week':
        return 100; // 每天最高100次
      case 'month':
        return 200; // 每週最高200次
      case 'year':
        return 400; // 每月最高400次
      default:
        return 20;
    }
  };
  
  const maxScale = getMaxScale();
  const chartMax = Math.max(...chartData.data, 1);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useFocusEffect(
    React.useCallback(() => {
      // 每次進入頁面時重新載入數據
      loadStatistics();
      
      // Reset to 0 and animate in every time the screen is focused
      fadeAnimRef.current.setValue(0);
      const anim = Animated.timing(fadeAnimRef.current, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      });
      anim.start();

      return () => {
        // Stop any running animation on blur to avoid state leaks
        fadeAnimRef.current.stopAnimation();
      };
    }, [loadStatistics])
  );


  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnimRef.current,
              transform: [{ translateY: fadeAnimRef.current.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })}],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>統計</Text>
            <View style={styles.placeholder} />
          </View>

          {/* 時間選擇按鈕 */}
          <View style={styles.timePeriodSection}>
            <View style={styles.timePeriodContainer}>
              {[
                { key: 'today', label: '今日' },
                { key: 'week', label: '最近7天' },
                { key: 'month', label: '本月' },
                { key: 'year', label: '全年' }
              ].map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.timePeriodButton,
                    selectedPeriod === period.key && styles.timePeriodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period.key as TimePeriod)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.timePeriodButtonText,
                      selectedPeriod === period.key && styles.timePeriodButtonTextActive,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 長條圖 */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>{chartData.title}</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartWrapper}>
                {/* Y軸標籤 */}
                <View style={styles.yAxisLabels}>
                  {[
                    maxScale,
                    Math.floor(maxScale * 0.75),
                    Math.floor(maxScale * 0.5),
                    Math.floor(maxScale * 0.25),
                    0
                  ].map((value, index) => (
                    <Text key={index} style={styles.yAxisLabel}>{value}</Text>
                  ))}
                </View>
                
                {/* 圖表區域 */}
                <View style={styles.chartContainer}>
                  {chartData.data.map((value, index) => {
                    // 使用設定的最大刻度值計算高度
                    const barHeight = value > 0 ? (value / maxScale) * 85 : 1;
                    return (
                      <View key={index} style={styles.chartBar}>
                        <View style={styles.barWrapper}>
                          {value > 0 ? (
                            <View 
                              style={[
                                styles.bar, 
                                { 
                                  height: `${barHeight}%`,
                                  backgroundColor: '#FF6B6B'
                                }
                              ]} 
                            />
                          ) : (
                            <View 
                              style={[
                                styles.bar, 
                                styles.barZero,
                                { 
                                  height: `${barHeight}%`,
                                }
                              ]} 
                            />
                          )}
                        </View>
                        <Text 
                          style={styles.barLabel}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.7}
                        >
                          {chartData.labels[index]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <Text style={styles.chartNote}>
                {selectedPeriod === 'today' && '24小時內發送信號次數分布'}
                {selectedPeriod === 'week' && '每日活動次數'}
                {selectedPeriod === 'month' && '每週活動次數'}
                {selectedPeriod === 'year' && '每月活動次數'}
              </Text>
            </View>
          </View>

          {/* 總覽卡片 */}
          <View style={styles.overviewSection}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#FF6B6B', '#FFB6B6']}
                style={styles.statCardGradient}
              >
                <Ionicons name="send" size={30} color="white" />
                <Text style={styles.statCardValue}>{statistics.totalSignalsSent}</Text>
                <Text style={styles.statCardLabel}>發送信號次數</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                style={styles.statCardGradient}
              >
                <Ionicons name="heart" size={30} color="white" />
                <Text style={styles.statCardValue}>{statistics.totalResponsesReceived}</Text>
                <Text style={styles.statCardLabel}>收到回應次數</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#9B59B6', '#8E44AD']}
                style={styles.statCardGradient}
              >
                <Ionicons name="people" size={30} color="white" />
                <Text style={styles.statCardValue}>{statistics.totalAccompanied}</Text>
                <Text style={styles.statCardLabel}>陪伴他人次數</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['#FF6B9D', '#FF8E8E']}
                style={styles.statCardGradient}
              >
                <Ionicons name="pulse" size={30} color="white" />
                <Text style={styles.statCardValue}>{statistics.avgIntensity}</Text>
                <Text style={styles.statCardLabel}>平均強度指數</Text>
              </LinearGradient>
            </View>
          </View>

          {/* 詳細統計 */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>詳細統計</Text>
            <View style={styles.detailCard}>
              <View style={[styles.detailRow, { borderBottomWidth: 1 }]}>
                <View style={styles.detailLeft}>
                  <Ionicons name="help-circle" size={20} color="#666" />
                  <Text style={styles.detailLabel}>幫助過的人數</Text>
                </View>
                <Text style={styles.detailValue}>{statistics.peopleHelped} 人</Text>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 1 }]}>
                <View style={styles.detailLeft}>
                  <Ionicons name="time" size={20} color="#666" />
                  <Text style={styles.detailLabel}>平均回應時間</Text>
                </View>
                <Text style={styles.detailValue}>{statistics.avgResponseTime} 分鐘</Text>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 1 }]}>
                <View style={styles.detailLeft}>
                  <Ionicons name="pulse" size={20} color="#666" />
                  <Text style={styles.detailLabel}>平均強度指數</Text>
                </View>
                <Text style={styles.detailValue}>{statistics.avgIntensity}</Text>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 1 }]}>
                <View style={styles.detailLeft}>
                  <Ionicons name="trending-up" size={20} color="#666" />
                  <Text style={styles.detailLabel}>最高強度指數</Text>
                </View>
                <Text style={styles.detailValue}>{statistics.maxIntensity}</Text>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <View style={styles.detailLeft}>
                  <Ionicons name="calendar" size={20} color="#666" />
                  <Text style={styles.detailLabel}>最近活躍天數</Text>
                </View>
                <Text style={styles.detailValue}>{statistics.activeDays} 天</Text>
              </View>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  overviewSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    width: '47%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  statCardLabel: {
    fontSize: 13,
    color: 'white',
    fontWeight: '500',
    opacity: 0.9,
  },
  detailSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  chartSection: {
    marginBottom: 25,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 150,
    marginBottom: 10,
  },
  yAxisLabels: {
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    paddingBottom: 20,
    height: '100%',
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#999',
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 0,
    height: '100%',
  },
  timePeriodSection: {
    marginBottom: 25,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  timePeriodButton: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePeriodButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  timePeriodButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  timePeriodButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 0,
    height: '100%',
    justifyContent: 'flex-end',
    minWidth: 0,
    maxWidth: '100%',
  },
  barWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  bar: {
    width: '85%',
    borderRadius: 3,
    minHeight: 1,
  },
  barZero: {
    backgroundColor: '#E0E0E0',
    width: '85%',
    height: 1,
    borderRadius: 0,
  },
  barLabel: {
    fontSize: 7,
    color: '#999',
    marginTop: 3,
    textAlign: 'center',
    includeFontPadding: false,
    numberOfLines: 1,
    width: '100%',
  },
  chartNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  dailyChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    marginBottom: 10,
  },
  dailyChartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
    height: '100%',
    justifyContent: 'flex-end',
  },
  dailyBar: {
    width: '80%',
    borderRadius: 6,
    minHeight: 2,
  },
  dailyBarLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  dailyBarValue: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontWeight: '600',
  },
  intensityDistributionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    marginBottom: 10,
  },
  intensityBarContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
    height: '100%',
    justifyContent: 'flex-end',
  },
  intensityBarWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  intensityBar: {
    width: '85%',
    borderRadius: 8,
    minHeight: 2,
  },
  intensityBarLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  intensityBarValue: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontWeight: '600',
  },
});

