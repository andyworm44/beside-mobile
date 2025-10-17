import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Response {
  id: string;
  userName: string;
  userGender: 'male' | 'female' | 'other';
  userAge: string;
  distance: number;
  timestamp: number;
  message: string;
  isRead: boolean;
}

export default function ReceivedScreen() {
  const [responses, setResponses] = useState<Response[]>([]);
  // 移除複雜的動畫，使用簡單的實現
  useEffect(() => {

    // 模擬收到的回應數據
    const mockResponses: Response[] = [
      {
        id: '1',
        userName: '小明',
        userGender: 'male',
        userAge: '25歲',
        distance: 0.3,
        timestamp: Date.now() - 300000, // 5分鐘前
        message: '我陪你',
        isRead: false,
      },
      {
        id: '2',
        userName: '小美',
        userGender: 'female',
        userAge: '22歲',
        distance: 0.8,
        timestamp: Date.now() - 600000, // 10分鐘前
        message: '我陪你',
        isRead: true,
      },
      {
        id: '3',
        userName: '阿華',
        userGender: 'male',
        userAge: '28歲',
        distance: 1.2,
        timestamp: Date.now() - 900000, // 15分鐘前
        message: '我陪你',
        isRead: true,
      },
      {
        id: '4',
        userName: '小芳',
        userGender: 'female',
        userAge: '24歲',
        distance: 1.5,
        timestamp: Date.now() - 1200000, // 20分鐘前
        message: '我陪你',
        isRead: false,
      },
    ];

    setResponses(mockResponses);
  }, []);

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

  const onResponsePress = (responseId: string) => {
    console.log('回應:', responseId);
    // 這裡可以添加回應邏輯
  };

  const renderResponseCard = ({ item, index }: { item: Response; index: number }) => (
    <View style={styles.responseCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.userAvatar}
          >
            <Ionicons name={getGenderIcon(item.userGender)} size={20} color="white" />
          </LinearGradient>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userAge}>{item.userAge} • {item.distance}km</Text>
          </View>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      <Text style={styles.messageText}>{item.message}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.timeContainer}>
          <Ionicons name="time" size={12} color="#BBB" />
          <Text style={styles.timeText}>{getTimeAgo(item.timestamp)}</Text>
        </View>

        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => onResponsePress(item.id)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.replyGradient}
          >
            <Ionicons name="chatbubble" size={16} color="white" />
            <Text style={styles.replyText}>謝謝！</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={45} color="#CCC" />
      </View>
      <Text style={styles.emptyTitle}>暫無收到的回應</Text>
      <Text style={styles.emptyText}>當有人回應你的寂寞信號時，會顯示在這裡</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>收到的回應</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{responses.filter(r => !r.isRead).length}</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={responses}
        renderItem={renderResponseCard}
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
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  responseCard: {
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
    justifyContent: 'space-between',
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
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#BBB',
  },
  replyButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  replyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  replyText: {
    color: 'white',
    fontSize: 12,
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
