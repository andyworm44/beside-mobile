import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
  const { nearbySignals, setNearbySignals } = useUser();
  // 移除複雜的動畫，使用簡單的實現
  useEffect(() => {
    // 如果沒有附近信號，初始化模擬數據
    if (nearbySignals.length === 0) {
      // 模擬數據 - 豐富的假資料
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
  }, [nearbySignals.length, setNearbySignals]);

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

  const onRespond = (signalId: string) => {
    console.log('回應信號:', signalId);
    
    // 從全局狀態中移除該信號（因為已經被回應了）
    setNearbySignals(prevSignals => 
      prevSignals.filter(signal => signal.id !== signalId)
    );
    
    // 顯示回應成功訊息
    console.log('✅ 已回應信號，信號從列表中消失');
    
    // 這裡可以添加更多回應邏輯，比如發送通知等
  };

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
      <Text style={styles.emptyTitle}>暫無附近的寂寞</Text>
      <Text style={styles.emptyText}>當有人發出寂寞信號時，會顯示在這裡</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>附近的寂寞</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
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
    paddingTop: 50,
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
});