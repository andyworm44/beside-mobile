import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PickingHand from '../components/PickingHand';

export default function PickingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>摳手紓壓</Text>
        <Text style={styles.subtitle}>點擊下方的手指</Text>
        
        <View style={styles.animationContainer}>
          <PickingHand scale={3} />
        </View>

        <Text style={styles.hint}>每按一下，焦慮就少一點</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  animationContainer: {
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  hint: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});


