import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import apiService from '../services/api';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, setUser, setLoggedIn, authToken } = useUser();
  const fadeAnim = new Animated.Value(0);
  
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert('提示', '暱稱不能為空');
      return;
    }
    
    if (!authToken) {
      Alert.alert('錯誤', '未登入');
      return;
    }

    setIsSaving(true);
    try {
      if (user) {
        console.log('準備更新暱稱:', { newName: newName.trim(), userId: user.id });
      }
      const response = await apiService.updateProfile(authToken, { name: newName.trim() });
      console.log('更新暱稱結果:', response);
      
      if (response.success) {
        // 更新本地 user state
        if (user) {
          // 確保所有必要的屬性都存在
          setUser({
            ...user,
            name: newName.trim()
          });
        }
        
        // 確保 Modal 先關閉
        setEditNameVisible(false);
        
        // 使用 setTimeout 來延遲 Alert，避免動畫衝突
        setTimeout(() => {
          Alert.alert('成功', '暱稱已更新');
        }, 500);
      } else {
        setEditNameVisible(false);
        setTimeout(() => {
          Alert.alert('錯誤', response.error || '更新失敗');
        }, 500);
      }
    } catch (error) {
      setEditNameVisible(false);
      setTimeout(() => {
        Alert.alert('錯誤', '網絡錯誤');
      }, 500);
    } finally {
      setIsSaving(false);
    }
  };

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
            // navigation.navigate('Welcome' as never); // 移除這行，因為 setLoggedIn(false) 會自動觸發 AppNavigator 切換到 Auth Stack
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: '個人資料',
      items: [
        { 
          label: '暱稱', 
          value: user?.name, 
          // hasArrow: true, // 暫時隱藏編輯功能
          // onPress: () => {
          //   setNewName(user?.name || '');
          //   setEditNameVisible(true);
          // }
        },
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
                      if (item.onPress) {
                        item.onPress();
                        return;
                      }
                      
                      if (item.label === '使用條款' || item.label === '隱私政策') {
                        Alert.alert('提示', `${item.label}功能開發中`);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <View style={styles.settingRight}>
                      {item.value && (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      )}
                      {item.isToggle ? (
                        <View style={[styles.toggle, item.isActive && styles.toggleActive]}>
                          <View style={[styles.toggleThumb, item.isActive && styles.toggleThumbActive]} />
                        </View>
                      ) : (
                        (item.hasArrow) && <Ionicons name="chevron-forward" size={16} color="#CCC" />
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

      {/* Edit Name Modal */}
      <Modal
        visible={editNameVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditNameVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>修改暱稱</Text>
            
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="請輸入新暱稱"
              placeholderTextColor="#999"
              autoFocus={true}
              maxLength={20}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setEditNameVisible(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleUpdateName}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>{isSaving ? '保存中...' : '保存'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  editModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});