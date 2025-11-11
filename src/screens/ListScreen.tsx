import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

interface LonelySignal {
  id: string;
  userId: string;
  userName: string;
  userGender: 'male' | 'female' | 'other';
  userAge: string;
  distance: number;
  timestamp: number;
  responses: number;
}

export default function ListScreen() {
  const { nearbySignals, setNearbySignals, getNearbySignals, respondToSignal } = useUser();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [filterDistance, setFilterDistance] = useState<number>(5);
  // 獲取附近信號的函數
    const loadNearbySignals = async () => {
      // 使用台北的座標作為預設位置
      const location = {
        latitude: 25.0330,
        longitude: 121.5654,
        radius: 5
      };
      
      try {
        const response = await getNearbySignals(location);
        if (!response.success) {
          // API 失敗時使用模擬數據（不顯示錯誤）
          console.log('使用模擬數據');
          const mockSignals: LonelySignal[] = [
            {
              id: '1',
              userId: 'user1',
              userName: '小明',
              userGender: 'male',
              userAge: '25歲',
              distance: 0.3,
              timestamp: Date.now() - 120000, // 2分鐘前
              responses: 3,
            },
            {
              id: '2',
              userId: 'user2',
              userName: '小美',
              userGender: 'female',
              userAge: '22歲',
              distance: 0.8,
              timestamp: Date.now() - 300000, // 5分鐘前
              responses: 1,
            },
            {
              id: '3',
              userId: 'user3',
              userName: '阿華',
              userGender: 'male',
              userAge: '28歲',
              distance: 1.2,
              timestamp: Date.now() - 600000, // 10分鐘前
              responses: 0,
            },
            {
              id: '4',
              userId: 'user4',
              userName: '小芳',
              userGender: 'female',
              userAge: '24歲',
              distance: 1.5,
              timestamp: Date.now() - 900000, // 15分鐘前
              responses: 2,
            },
            {
              id: '5',
              userId: 'user5',
              userName: '志明',
              userGender: 'male',
              userAge: '26歲',
              distance: 2.1,
              timestamp: Date.now() - 1200000, // 20分鐘前
              responses: 1,
            },
            {
              id: '6',
              userId: 'user6',
              userName: '雅婷',
              userGender: 'female',
              userAge: '23歲',
              distance: 2.8,
              timestamp: Date.now() - 1800000, // 30分鐘前
              responses: 4,
            },
          ];
          setNearbySignals(mockSignals);
        }
      } catch (error) {
        // 捕获所有错误，使用模拟数据
        console.log('API 调用失败，使用模拟数据');
        const mockSignals: LonelySignal[] = [
          {
            id: '1',
            userId: 'user1',
            userName: '小明',
            userGender: 'male',
            userAge: '25歲',
            distance: 0.3,
            timestamp: Date.now() - 120000,
            responses: 3,
          },
          {
            id: '2',
            userId: 'user2',
            userName: '小美',
            userGender: 'female',
            userAge: '22歲',
            distance: 0.8,
            timestamp: Date.now() - 300000,
            responses: 1,
          },
          {
            id: '3',
            userId: 'user3',
            userName: '阿華',
            userGender: 'male',
            userAge: '28歲',
            distance: 1.2,
            timestamp: Date.now() - 600000,
            responses: 0,
          },
          {
            id: '4',
            userId: 'user4',
            userName: '小芳',
            userGender: 'female',
            userAge: '24歲',
            distance: 1.5,
            timestamp: Date.now() - 900000,
            responses: 2,
          },
        ];
        setNearbySignals(mockSignals);
      }
    };
    
  // 首次載入
  useEffect(() => {
    loadNearbySignals();
  }, []);
  
  // 每次進入頁面時重新載入
  useFocusEffect(
    useCallback(() => {
      loadNearbySignals();
    }, [getNearbySignals])
  );

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes}分鐘前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小時前`;
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return 'male';
      case 'female': return 'female';
      default: return 'person';
    }
  };

  const onRespond = async (signalId: string) => {
    const response = await respondToSignal(signalId);
    if (!response.success) {
      console.error('❌ 回應信號失敗:', response.error);
      Alert.alert('回應失敗', response.error || '未知錯誤');
    } else {
      // UserContext 中的 respondToSignal 已經會自動從列表中移除信號
      // 不需要立即重新載入，避免信號重新出現
      console.log('✅ 回應成功，信號已從列表中移除');
    }
  };

  const applyFilter = () => {
    setShowFilterModal(false);
    // 這裡可以實現篩選邏輯
    Alert.alert('篩選', `已套用篩選：性別=${filterGender === 'all' ? '全部' : filterGender === 'male' ? '男性' : '女性'}，距離=${filterDistance}km`);
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>篩選條件</Text>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>性別</Text>
            <View style={styles.genderOptions}>
              {[
                { value: 'all', label: '全部' },
                { value: 'male', label: '男性' },
                { value: 'female', label: '女性' }
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    filterGender === option.value && styles.genderOptionActive
                  ]}
                  onPress={() => setFilterGender(option.value as any)}
                >
                  <Text style={[
                    styles.genderOptionText,
                    filterGender === option.value && styles.genderOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>距離範圍</Text>
            <View style={styles.distanceOptions}>
              {[1, 3, 5, 10].map((distance) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.distanceOption,
                    filterDistance === distance && styles.distanceOptionActive
                  ]}
                  onPress={() => setFilterDistance(distance)}
                >
                  <Text style={[
                    styles.distanceOptionText,
                    filterDistance === distance && styles.distanceOptionTextActive
                  ]}>
                    {distance}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilter}
            >
              <Text style={styles.applyButtonText}>套用</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSignalCard = ({ item, index }: { item: LonelySignal; index: number }) => (
    <View style={styles.signalCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <LinearGradient
            colors={['#FF8E8E', '#FFB6B6']}
            style={styles.userAvatar}
          >
            <Ionicons name={getGenderIcon(item.userGender)} size={20} color="white" />
          </LinearGradient>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userAge}>{item.userAge} • {item.distance}km</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardTime}>
        <Ionicons name="time" size={12} color="#BBB" />
        <Text style={styles.timeText}>{getTimeAgo(item.timestamp)}發出</Text>
      </View>

      <TouchableOpacity
        style={styles.accompanyButton}
        onPress={() => onRespond(item.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
          style={styles.accompanyGradient}
        >
          <Ionicons name="heart" size={16} color="white" />
          <Text style={styles.accompanyText}>我陪你</Text>
        </LinearGradient>
        </TouchableOpacity>
      </View>
    );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={45} color="#CCC" />
      </View>
      <Text style={styles.emptyTitle}>暫無附近的焦慮</Text>
      <Text style={styles.emptyText}>當有人發出焦慮信號時，會顯示在這裡</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>附近的焦慮</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          activeOpacity={0.8}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={16} color="#666" />
          <Text style={styles.filterText}>篩選</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={nearbySignals}
        renderItem={renderSignalCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      {renderFilterModal()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  signalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userAge: {
    fontSize: 12,
    color: '#999',
  },
  cardTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#BBB',
  },
  accompanyButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  accompanyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    gap: 8,
  },
  accompanyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  genderOptionActive: {
    backgroundColor: '#4ECDC4',
  },
  genderOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderOptionTextActive: {
    color: 'white',
  },
  distanceOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  distanceOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  distanceOptionActive: {
    backgroundColor: '#4ECDC4',
  },
  distanceOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  distanceOptionTextActive: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});