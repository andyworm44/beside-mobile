import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

export default function StableLoginScreen() {
  const navigation = useNavigation();
  const { setLoggedIn } = useUser();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (!phone.trim()) {
      alert('請輸入手機號碼');
      return;
    }
    if (!code.trim()) {
      alert('請輸入驗證碼');
      return;
    }

    setLoggedIn(true);
    navigation.navigate('Main' as never);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F5', '#FFE5E5']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>歡迎回來</Text>
            <Text style={styles.subtitle}>繼續你的陪伴之旅</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>手機號碼</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="輸入你的手機號碼"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={15}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>驗證碼</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="輸入驗證碼"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={6}
              />
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
                <Text style={styles.submitText}>登入</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>返回註冊</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
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
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
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
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#999',
    fontSize: 14,
  },
});

