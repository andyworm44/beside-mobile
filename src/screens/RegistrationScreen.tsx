import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const { register } = useUser();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male' as 'male' | 'female' | 'other');
  const [birthday, setBirthday] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = [
    { value: 'male', label: '男', icon: 'male' as keyof typeof Ionicons.glyphMap },
    { value: 'female', label: '女', icon: 'female' as keyof typeof Ionicons.glyphMap },
    { value: 'other', label: '其他', icon: 'person' as keyof typeof Ionicons.glyphMap },
  ];

  // 驗證生日格式（YYYY-MM-DD）
  const validateBirthday = (dateStr: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    const today = new Date();
    
    // 檢查日期是否有效且不是未來日期
    return date instanceof Date && !isNaN(date.getTime()) && date <= today;
  };

  // 格式化生日輸入（自動添加連字符）
  const formatBirthdayInput = (text: string): string => {
    // 移除所有非數字字符
    const numbers = text.replace(/\D/g, '');
    
    // 限制長度為8位數字（YYYYMMDD）
    const limited = numbers.slice(0, 8);
    
    // 添加連字符
    if (limited.length <= 4) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 4)}-${limited.slice(4)}`;
    } else {
      return `${limited.slice(0, 4)}-${limited.slice(4, 6)}-${limited.slice(6)}`;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('請輸入暱稱');
      return;
    }

    if (!birthday.trim()) {
      alert('請輸入生日');
      return;
    }

    if (!validateBirthday(birthday)) {
      alert('請輸入正確的生日格式（YYYY-MM-DD），例如：1991-04-04');
      return;
    }

    setIsLoading(true);

    try {
      // 調用真實的註冊 API
      const response = await register({
        name: name.trim(),
        gender: gender,
        birthday: birthday.trim(),
      });

      if (response.success) {
        // 註冊成功，已經在 UserContext 中設置了用戶和登入狀態
        // App.tsx 會根據 isLoggedIn 狀態自動切換到主畫面
        // 不需要手動導航，等待狀態更新即可
        console.log('✅ 註冊成功，等待導航到主畫面...');
        // 不設置 setIsLoading(false)，讓用戶看到成功狀態
        // 如果 2 秒後還沒導航，顯示錯誤
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } else {
        console.error('❌ 註冊失敗:', response.error);
        alert(`註冊失敗：${response.error || '未知錯誤'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Registration exception:', error);
      alert('註冊時發生錯誤，請稍後再試');
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>創建你的資料</Text>
            <Text style={styles.subtitle}>簡單幾步，開始溫暖的陪伴</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>暱稱</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="輸入你的暱稱"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={20}
                keyboardType="default"
                textContentType="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>性別</Text>
              <View style={styles.optionsContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      gender === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setGender(option.value)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={option.icon} size={16} color={gender === option.value ? 'white' : '#666'} />
                    <Text style={[styles.optionButtonText, gender === option.value && styles.optionButtonTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>生日</Text>
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={(text) => setBirthday(formatBirthdayInput(text))}
                placeholder="YYYY-MM-DD（例如：1991-04-04）"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={10}
                textContentType="none"
              />
              <Text style={styles.hintText}>請輸入生日，格式：1991-04-04</Text>
            </View>

            <View style={styles.locationInfo}>
              <Ionicons name="location" size={20} color="#FF6B6B" />
              <Text style={styles.locationText}>我們需要你的位置來尋找附近的人</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#CCCCCC', '#AAAAAA'] : ['#FF6B6B', '#FF8E8E']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>
                  {isLoading ? '註冊中...' : '完成註冊'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 30,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    marginLeft: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFE0E0',
    backgroundColor: 'white',
    gap: 8,
  },
  optionButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionButtonTextActive: {
    color: 'white',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    gap: 10,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  submitButton: {
    borderRadius: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});