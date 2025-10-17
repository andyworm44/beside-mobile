import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function TestReceivedScreen() {
  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>收到的回應</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>4</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.responseCard}>
          <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Ionicons name="male" size={20} color="white" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>小明</Text>
                <Text style={styles.userAge}>25歲 • 0.3km</Text>
              </View>
            </View>
            <View style={styles.unreadDot} />
          </View>
          
          <Text style={styles.messageText}>我陪你</Text>
          
          <View style={styles.cardFooter}>
            <Text style={styles.timeText}>5分鐘前</Text>
            <TouchableOpacity style={styles.replyButton}>
              <Text style={styles.replyText}>謝謝！</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.responseCard}>
          <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Ionicons name="female" size={20} color="white" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>小美</Text>
                <Text style={styles.userAge}>22歲 • 0.8km</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.messageText}>我陪你</Text>
          
          <View style={styles.cardFooter}>
            <Text style={styles.timeText}>10分鐘前</Text>
            <TouchableOpacity style={styles.replyButton}>
              <Text style={styles.replyText}>謝謝！</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
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
    backgroundColor: '#4ECDC4',
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
  timeText: {
    fontSize: 12,
    color: '#BBB',
  },
  replyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  replyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

