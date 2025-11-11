import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function TestSettingsScreen() {
  const navigation = useNavigation();
  const { user, setLoggedIn } = useUser();

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
            // 不需要導航，AppNavigator 會自動處理登出狀態
            console.log('用戶已登出');
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: '個人資料',
      items: [
        { label: '暱稱', value: user?.name || '未設置', hasArrow: true },
        { label: '性別', value: user?.gender === 'male' ? '男' : user?.gender === 'female' ? '女' : '其他', hasArrow: true },
        { label: '生日', value: user?.birthday || '未設置', hasArrow: true },
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
        <View style={styles.content}>
          <Text style={styles.title}>設置</Text>
          
          {/* 用戶信息調試 */}
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>調試信息：</Text>
            <Text style={styles.debugText}>用戶ID: {user?.id || '無'}</Text>
            <Text style={styles.debugText}>用戶名稱: {user?.name || '無'}</Text>
            <Text style={styles.debugText}>性別: {user?.gender || '無'}</Text>
            <Text style={styles.debugText}>生日: {user?.birthday || '無'}</Text>
          </View>

          {settingsSections.map((section, sectionIndex) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.settingItem}
                    onPress={() => {
                      if (item.label === '使用條款' || item.label === '隱私政策') {
                        Alert.alert('提示', `${item.label}功能開發中`);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <View style={styles.settingRight}>
                      {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                      {item.isToggle ? (
                        <View style={[styles.toggle, item.isActive && styles.toggleActive]}>
                          <View style={[styles.toggleThumb, item.isActive && styles.toggleThumbActive]} />
                        </View>
                      ) : (
                        item.hasArrow && <Ionicons name="chevron-forward" size={16} color="#CCC" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>登出</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  debugSection: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#FF6B6B',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
