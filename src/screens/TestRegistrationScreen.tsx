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

export default function TestRegistrationScreen() {
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

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('請輸入暱稱');
      return;
    }

    if (!birthday.trim()) {
      alert('請輸入生日');
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
        setTimeout(() => {
          navigation.navigate('Main' as never);
        }, 500);
      } else {
        alert(`註冊失敗：${response.error || '未知錯誤'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('註冊時發生錯誤，請稍後再試');
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#FFF5F5', '#FFE5E5']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>建立帳號</Text>
          <Text style={styles.subtitle}>讓我們認識你</Text>

          {/* 暱稱輸入 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>暱稱</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="請輸入你的暱稱"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* 性別選擇 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>性別</Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    gender === option.value && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(option.value as 'male' | 'female' | 'other')}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={gender === option.value ? '#FF6B6B' : '#999'}
                  />
                  <Text
                    style={[
                      styles.genderLabel,
                      gender === option.value && styles.genderLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 生日輸入 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>生日</Text>
            <TextInput
              style={styles.input}
              value={birthday}
              onChangeText={setBirthday}
              placeholder="YYYY-MM-DD (例如: 1995-01-15)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          {/* 提交按鈕 */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.buttonGradient}
            >
              <Text style={styles.submitButtonText}>完成註冊</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 登入連結 */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login' as never)}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkText}>已有帳號？登入</Text>
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
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFE0E0',
  },
  genderOptionSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  genderLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  genderLabelSelected: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 20,
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
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
});
