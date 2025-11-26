import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider, useUser } from './src/context/UserContext';
import ErrorBoundary from './src/components/ErrorBoundary';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import TestRegistrationScreen from './src/screens/TestRegistrationScreen';
import SimpleTestScreen from './src/screens/SimpleTestScreen';
import UltraSimpleRegistration from './src/screens/UltraSimpleRegistration';
import UltraSimpleLogin from './src/screens/UltraSimpleLogin';
import StableRegistrationScreen from './src/screens/StableRegistrationScreen';
import StableLoginScreen from './src/screens/StableLoginScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import TestHomeScreen from './src/screens/TestHomeScreen';
import TestListScreen from './src/screens/TestListScreen';
import ReceivedScreen from './src/screens/ReceivedScreen';
import TestReceivedScreen from './src/screens/TestReceivedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

// Icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Received') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: '首頁' }}
      />
      <Tab.Screen 
        name="List" 
        component={ListScreen}
        options={{ tabBarLabel: '附近' }}
      />
      <Tab.Screen 
        name="Received" 
        component={ReceivedScreen}
        options={{ tabBarLabel: '收到' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ tabBarLabel: '設置' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, isLoggedIn, setUser, setLoggedIn, setAuthToken } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查是否有已保存的登入狀態（可以後續添加）
    // 目前不自動登入，讓用戶進行註冊或登入
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  // 檢查登入狀態
  if (!isLoggedIn || !user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFF5F5' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  // 已登入，顯示主頁面
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFF5F5' },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}