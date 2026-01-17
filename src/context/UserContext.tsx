import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  phone?: string;
}

interface LonelySignal {
  id: string;
  userId: string;
  timestamp: number;
  responses: Array<{
    id: string;
    userId: string;
    userName: string;
    timestamp: number;
  }>;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  lonelySignal: LonelySignal | null;
  setLonelySignal: (signal: LonelySignal | null) => void;
  nearbySignals: LonelySignal[];
  setNearbySignals: (signals: LonelySignal[]) => void;
  // 今日統計
  todaySignalCount: number;
  todayIntensitySum: number;
  trackTodaySignal: (intensity: number) => void;
  // API 方法
  register: (userData: { name: string; gender: 'male' | 'female' | 'other'; birthday: string; email: string; password: string; phone?: string }) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  createSignal: (location?: { latitude: number; longitude: number }) => Promise<any>;
  getNearbySignals: (location: { latitude: number; longitude: number; radius?: number }) => Promise<any>;
  respondToSignal: (signalId: string, message?: string) => Promise<any>;
  cancelSignal: (signalId: string) => Promise<any>;
  getMyResponses: () => Promise<any>;
  markResponseAsThanked: (responseId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [lonelySignal, setLonelySignal] = useState<LonelySignal | null>(null);
  const [nearbySignals, setNearbySignals] = useState<LonelySignal[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [thankedResponseIds, setThankedResponseIds] = useState<string[]>([]);
  // 今日統計
  const [todaySignalCount, setTodaySignalCount] = useState<number>(0);
  const [todayIntensitySum, setTodayIntensitySum] = useState<number>(0);
  const [todayKey, setTodayKey] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const ensureToday = () => {
    const key = new Date().toISOString().slice(0, 10);
    if (key !== todayKey) {
      setTodayKey(key);
      setTodaySignalCount(0);
      setTodayIntensitySum(0);
    }
  };

  const trackTodaySignal = (intensity: number) => {
    ensureToday();
    setTodaySignalCount(prev => prev + 1);
    setTodayIntensitySum(prev => prev + Math.floor(intensity));
  };

  // 註冊
  const register = async (userData: { name: string; gender: 'male' | 'female' | 'other'; birthday: string; email: string; password: string; phone?: string }) => {
    try {
      console.log('📝 開始註冊，用戶資料:', { ...userData, password: '***' });
      const response = await apiService.register(userData);
      console.log('📝 註冊 API 響應:', response);
      
      if (response.success) {
        // 設置用戶資料
        const userToSet = response.data?.user || response.data;
        if (userToSet) {
          console.log('✅ 設置用戶資料:', userToSet);
          setUser(userToSet);
        } else {
          console.error('❌ 響應中沒有用戶資料:', response.data);
        }
        
        // 設置 session token
        if (response.data?.session?.access_token) {
          setAuthToken(response.data.session.access_token);
          console.log('✅ 註冊成功，已設置認證 Token');
        } else {
          console.warn('⚠️ 註冊成功但沒有 Session Token');
          console.warn('⚠️ Response data:', JSON.stringify(response.data, null, 2));
        }
        
        // 最後設置登入狀態
        setLoggedIn(true);
        console.log('✅ 註冊完成，已設置登入狀態');
        
        return response;
      } else {
        console.error('❌ 註冊失敗:', response.error);
      }
      return response;
    } catch (error) {
      console.error('❌ Registration exception:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  // 登入
  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
        setAuthToken(response.data.session?.access_token);
        setLoggedIn(true);
        return response;
      }
      return response;
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  // 登出
  const logout = () => {
    setUser(null);
    setAuthToken(null);
    setLoggedIn(false);
    setLonelySignal(null);
    setNearbySignals([]);
  };

  // 發送焦慮信號
  const createSignal = async (location?: { latitude: number; longitude: number }) => {
    try {
      if (!authToken) {
        console.error('❌ 無法發送訊號：沒有認證 Token');
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await apiService.createSignal(authToken, location);
      if (response.success && response.data) {
        // 轉換後端格式到前端格式
        const signal: LonelySignal = {
          id: response.data.id,
          userId: response.data.user_id,
          timestamp: new Date(response.data.created_at).getTime(),
      responses: []
    };
        setLonelySignal(signal);
        return { success: true, data: signal };
      }
      return response;
    } catch (error) {
      console.error('Create signal error:', error);
      return { success: false, error: 'Failed to create signal' };
    }
  };

  // 獲取附近信號
  const getNearbySignals = async (location: { latitude: number; longitude: number; radius?: number }) => {
    try {
      const response = await apiService.getNearbySignals(location);
      if (response.success && response.data) {
        // 轉換後端格式到前端格式
        const formattedSignals: LonelySignal[] = response.data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          userName: item.user_name,
          userGender: item.user_gender,
          userAge: item.user_age,
          distance: 0, // 後端沒有提供距離，可以後續計算
          timestamp: new Date(item.created_at).getTime(),
          responses: item.response_count || 0
        }));
        setNearbySignals(formattedSignals);
        return { success: true, data: formattedSignals };
      }
      return response;
    } catch (error) {
      // 捕获所有错误，返回失败状态（ListScreen 会处理）
      return { success: false, error: error instanceof Error ? error.message : 'Network error' };
    }
  };

  // 回應信號
  const respondToSignal = async (signalId: string, message?: string) => {
    try {
      if (!authToken) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await apiService.respondToSignal(authToken, signalId, message);
      if (response.success) {
        // 從列表中移除已回應的訊號（立即移除，避免UI閃爍）
        setNearbySignals(prev => prev.filter(signal => signal.id !== signalId));
        console.log('✅ 已從列表中移除回應的訊號:', signalId);
      }
      return response;
    } catch (error) {
      console.error('Respond to signal error:', error);
      return { success: false, error: 'Failed to respond to signal' };
    }
  };

  // 取消信號
  const cancelSignal = async (signalId: string) => {
    try {
      if (!authToken) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await apiService.cancelSignal(authToken, signalId);
      if (response.success) {
      setLonelySignal(null);
      console.log('✅ 信號已取消');
      }
      return response;
    } catch (error) {
      console.error('Cancel signal error:', error);
      return { success: false, error: 'Failed to cancel signal' };
    }
  };

  // 標記回應為已感謝
  const markResponseAsThanked = (responseId: string) => {
    setThankedResponseIds(prev => {
      if (!prev.includes(responseId)) {
        return [...prev, responseId];
      }
      return prev;
    });
  };

  // 獲取我的回應
  const getMyResponses = async () => {
    try {
      if (!authToken) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await apiService.getMyResponses(authToken);
      if (response.success && response.data) {
        // 轉換後端格式到前端格式
        const formattedResponses = response.data.map((item: any) => ({
          id: item.id,
          userName: item.responder_name,
          userGender: item.responder_gender,
          userAge: item.responder_age,
          distance: 0, // 後端沒有提供距離，可以後續計算
          timestamp: new Date(item.created_at).getTime(),
          message: item.message || '拍拍你',
          isRead: false, // 後端沒有提供此欄位
        }));
        
        // 過濾掉已感謝的回應
        const filteredResponses = formattedResponses.filter((r: any) => !thankedResponseIds.includes(r.id));
        
        // 只返回最新的一個回應（確保只顯示一個）
        const latestResponse = filteredResponses.length > 0 ? [filteredResponses[0]] : [];
        
        return { success: true, data: latestResponse };
      }
      return response;
    } catch (error) {
      console.error('Get my responses error:', error);
      return { success: false, error: 'Failed to get responses' };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setLoggedIn,
        authToken,
        setAuthToken,
        lonelySignal,
        setLonelySignal,
        nearbySignals,
        setNearbySignals,
        todaySignalCount,
        todayIntensitySum,
        trackTodaySignal,
        register,
        login,
        logout,
        createSignal,
        getNearbySignals,
        respondToSignal,
        cancelSignal,
        getMyResponses,
        markResponseAsThanked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};