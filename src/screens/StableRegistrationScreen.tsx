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

export default function StableRegistrationScreen() {
  const navigation = useNavigation();
  const { setUser, setLoggedIn } = useUser();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male' as 'male' | 'female' | 'other');
  const [birthday, setBirthday] = useState('');

  const genderOptions = [
    { value: 'male', label: '男', icon: 'male' as keyof typeof Ionicons.glyphMap },
    { value: 'female', label: '女', icon: 'female' as keyof typeof Ionicons.glyphMap },
    { value: 'other', label: '其他', icon: 'person' as keyof typeof Ionicons.glyphMap },
  ];

  // 移除年齡選項，改用生日輸入

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('請輸入暱稱');
      return;
    }

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      gender: gender,
      birthday: birthday,
    };

    setUser(user);
    setLoggedIn(true);
    
    setTimeout(() => {
      navigation.navigate('Main' as never);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F5', '#FFE5E5']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                  onChangeText={setBirthday}
                  placeholder="請輸入生日 (例如：1990-01-01)"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.locationInfo}>
                <Ionicons name="location" size={20} color="#FF6B6B" />
                <Text style={styles.locationText}>我們需要你的位置來尋找附近的人</Text>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E8E']}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>完成註冊</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  ageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
});
