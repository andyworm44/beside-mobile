import React from 'react';
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

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, setLoggedIn } = useUser();
  const fadeAnim = new Animated.Value(0);

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
            </Animated.View>
          ))}

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>登出</Text>
          </TouchableOpacity>
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
});