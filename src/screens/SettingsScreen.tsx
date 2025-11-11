import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import StatisticsChart from '../components/StatisticsChart';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, setLoggedIn } = useUser();
  const fadeAnim = new Animated.Value(0);
  const [showStatistics, setShowStatistics] = useState(false);

  // 模擬數據
  const signalData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const accompanyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const timeLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      '確認登出',
      '你確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '登出',
          style: 'destructive',
          onPress: () => {
            setLoggedIn(false);
            navigation.navigate('Welcome' as never);
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: '統計數據',
      items: [
        { label: '發出訊號次數', value: '12', isStat: true },
        { label: '陪伴他人次數', value: '8', isStat: true },
        { label: '查看詳細統計', value: '', isChart: true },
      ],
    },
    {
      title: '個人資料',
      items: [
        { label: '暱稱', value: user?.name, hasArrow: true },
        { label: '性別', value: user?.gender === 'male' ? '男' : user?.gender === 'female' ? '女' : '其他', hasArrow: true },
        { label: '生日', value: user?.birthday, hasArrow: true },
      ],
    },
    {
      title: '隱私設置',
      items: [
        { label: '顯示距離範圍', value: '5km', hasArrow: true },
        { label: '接收通知', isToggle: true, isActive: true },
        { label: '顯示在附近列表', isToggle: true, isActive: true },
      ],
    },
    {
      title: '關於',
      items: [
        { label: '版本', value: '1.0.0' },
        { label: '使用條款', hasArrow: true },
        { label: '隱私政策', hasArrow: true },
      ],
    },
  ];

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
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })}],
            },
          ]}
        >
          <Text style={styles.title}>設置</Text>

          {settingsSections.map((section, sectionIndex) => (
            <Animated.View
              key={section.title}
              style={[
                styles.section,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  })}],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.settingItem}
                    onPress={() => {
                      if (item.label === '使用條款' || item.label === '隱私政策') {
                        Alert.alert('提示', `${item.label}功能開發中`);
                      } else if (item.isStat) {
                        // 統計數據項目不需要點擊功能
                        return;
                      } else if (item.isChart) {
                        console.log('點擊查看詳細統計');
                        setShowStatistics(true);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <View style={styles.settingRight}>
                      {item.isStat ? (
                        <Text style={styles.statValue}>{item.value || '0'}</Text>
                      ) : item.isChart ? (
                        <Text style={styles.chartText}>圖表</Text>
                      ) : item.value && (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      )}
                      {item.isToggle ? (
                        <View style={[styles.toggle, item.isActive && styles.toggleActive]}>
                          <View style={[styles.toggleThumb, item.isActive && styles.toggleThumbActive]} />
                        </View>
                      ) : (
                        (item.hasArrow || item.isChart) && <Ionicons name="chevron-forward" size={16} color="#CCC" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>登出</Text>
          </TouchableOpacity>
          
          {/* 測試按鈕 */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#4ECDC4', marginTop: 10 }]}
            onPress={() => {
              console.log('測試按鈕點擊');
              setShowStatistics(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.logoutText, { color: '#fff' }]}>測試統計圖表</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Statistics Chart Modal */}
      {showStatistics && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>詳細統計</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  console.log('關閉統計圖表');
                  setShowStatistics(false);
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.chartScrollView}>
              <View style={styles.simpleChart}>
                <Text style={styles.chartTitle}>發出訊號統計</Text>
                <View style={styles.chartContainer}>
                  {signalData.map((value, index) => (
                    <View key={index} style={styles.chartBar}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: value > 0 ? `${Math.min(value * 3, 100)}%` : '2%',
                            backgroundColor: value > 0 ? '#FF6B6B' : '#555'
                          }
                        ]} 
                      />
                      <Text style={styles.barLabel}>{timeLabels[index]}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.chartTitle}>陪伴他人統計</Text>
                <View style={styles.chartContainer}>
                  {accompanyData.map((value, index) => (
                    <View key={index} style={styles.chartBar}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: value > 0 ? `${Math.min(value * 3, 100)}%` : '2%',
                            backgroundColor: value > 0 ? '#4ECDC4' : '#555'
                          }
                        ]} 
                      />
                      <Text style={styles.barLabel}>{timeLabels[index]}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>發出訊號總次數</Text>
                    <Text style={styles.statValue}>{signalData.reduce((a, b) => a + b, 0)}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statLabel}>陪伴他人總次數</Text>
                    <Text style={styles.statValue}>{accompanyData.reduce((a, b) => a + b, 0)}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  statValue: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  chartText: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4ECDC4',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  logoutButton: {
    backgroundColor: '#FFE0E0',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '95%',
    height: '90%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartScrollView: {
    flex: 1,
  },
  simpleChart: {
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  bar: {
    width: '80%',
    borderRadius: 2,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
});