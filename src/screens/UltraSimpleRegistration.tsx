import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function UltraSimpleRegistration({ navigation }: any) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('請輸入暱稱');
      return;
    }
    console.log('註冊完成，暱稱：', name);
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F5', '#FFE5E5']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>創建你的資料</Text>
          <Text style={styles.subtitle}>簡單幾步，開始溫暖的陪伴</Text>
          
          <View style={styles.inputContainer}>
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

          <Text style={styles.displayText}>你輸入的是：{name}</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>完成註冊</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFE0E0',
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333',
  },
  displayText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

