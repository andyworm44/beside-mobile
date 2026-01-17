// API 服務 - 連接後端
import Constants from 'expo-constants';

// 從環境變數或配置中獲取 API URL
// 開發環境：使用 localhost
// 測試環境：使用實際的測試服務器地址
// 生產環境：使用生產服務器地址
const getApiBaseUrl = (): string => {
  // 優先使用 app.config.js 中的 extra.apiUrl
  const configApiUrl = Constants.expoConfig?.extra?.apiUrl;
  
  // 添加日誌來調試
  // console.log('🔍 API URL 配置檢查:');
  // console.log('  - Constants.expoConfig?.extra?.apiUrl:', configApiUrl);
  // console.log('  - Constants.appOwnership:', Constants.appOwnership);
  // console.log('  - Constants.executionEnvironment:', Constants.executionEnvironment);
  
  if (configApiUrl) {
    // console.log('✅ 使用配置的 API URL:', configApiUrl);
    return configApiUrl;
  }
  
  // 開發環境默認值（使用 expo-constants 判斷）
  // 如果 appOwnership 是 'expo'，說明是在 Expo Go 中運行（開發環境）
  const isDev = Constants.appOwnership === 'expo' || Constants.executionEnvironment === 'storeClient';
  
  const defaultUrl = isDev 
    ? 'http://localhost:3001/api/v1'
    : 'https://beside-backend-production.up.railway.app/api/v1';
  
  // console.log('⚠️ 使用默認 API URL:', defaultUrl);
  return defaultUrl;
};

const API_BASE_URL = getApiBaseUrl();
// console.log('🌐 最終使用的 API Base URL:', API_BASE_URL);

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // 通用請求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('📡 API 請求:', {
        method: options.method || 'GET',
        url: url,
        body: options.body,
      });
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // console.log('📡 API 響應狀態:', response.status, response.statusText);
      
      // 檢查響應是否成功
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API HTTP Error:', {
          url: url,
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
        });
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }
      
      const data = await response.json();
      console.log('📡 API 響應數據:', data);
      
      // 只在錯誤時記錄日誌
      if (!data.success) {
        console.error('❌ API Error Response:', {
          url: url,
          status: response.status,
          error: data.error,
        });
      }
      
      return data;
    } catch (error) {
      console.error('❌ API Network Error:', {
        endpoint: endpoint,
        url: `${this.baseURL}${endpoint}`,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof TypeError ? 'TypeError (可能是網絡連接問題)' : 'Other',
      });
      
      // 提供更友好的錯誤訊息
      let errorMessage = 'Network error';
      if (error instanceof TypeError) {
        errorMessage = '無法連接到服務器，請檢查網絡連接';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // 健康檢查
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // 用戶註冊
  async register(userData: {
    name: string;
    gender: 'male' | 'female' | 'other';
    birthday: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 用戶登入
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // 獲取用戶資料
  async getProfile(token: string): Promise<ApiResponse> {
    return this.request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 更新用戶資料
  async updateProfile(token: string, userData: {
    name?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // 發送焦慮信號
  async createSignal(token: string, location?: {
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse> {
    return this.request('/signals', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: location ? JSON.stringify(location) : JSON.stringify({}),
    });
  }

  // 獲取附近的焦慮信號
  async getNearbySignals(location: {
    latitude: number;
    longitude: number;
    radius?: number;
  }): Promise<ApiResponse> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      radius: (location.radius || 5).toString(),
    });
    
    return this.request(`/signals/nearby?${params}`);
  }

  // 回應焦慮信號
  async respondToSignal(token: string, signalId: string, message?: string): Promise<ApiResponse> {
    return this.request(`/signals/${signalId}/respond`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: message || '我陪你' }),
    });
  }

  // 取消焦慮信號
  async cancelSignal(token: string, signalId: string): Promise<ApiResponse> {
    return this.request(`/signals/${signalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 獲取我的信號
  async getMySignals(token: string): Promise<ApiResponse> {
    return this.request('/signals/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 獲取收到的回應
  async getMyResponses(token: string): Promise<ApiResponse> {
    return this.request('/signals/responses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 獲取統計數據
  async getStatistics(token: string): Promise<ApiResponse> {
    return this.request('/signals/statistics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 更新位置
  async updateLocation(token: string, location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  }): Promise<ApiResponse> {
    return this.request('/users/location', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(location),
    });
  }
}

// 導出單例
export const apiService = new ApiService();
export default apiService;
