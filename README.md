# Beside — Someone's here. (React Native)

一個溫暖的陪伴應用程式，讓寂寞的人們能夠找到彼此的支持。使用 React Native + Expo 開發，完美適配手機端。

## 🌟 功能特色

- **寂寞信號發送**：當你感到寂寞時，可以發送信號讓附近的人知道你需要陪伴
- **附近列表**：瀏覽附近正在尋求陪伴的人
- **溫暖回應**：簡單的「我陪你」回應，傳遞溫暖
- **即時互動**：看到有多少人回應你的信號
- **隱私保護**：無法聊天，只有簡單的陪伴確認
- **原生體驗**：使用 React Native 提供流暢的原生體驗

## 🎨 設計理念

- **溫暖色調**：使用粉紅色系營造溫暖氛圍
- **簡潔界面**：專注於核心功能，避免複雜操作
- **情感設計**：每個元素都傳遞溫暖和支持的感覺
- **原生動畫**：流暢的過渡動畫和視覺反饋

## 🚀 技術棧

- **框架**：React Native + Expo
- **導航**：React Navigation 6
- **狀態管理**：React Context
- **動畫**：React Native Animated API
- **圖標**：Expo Vector Icons
- **漸變**：Expo Linear Gradient
- **類型安全**：TypeScript

## 📱 頁面結構

1. **歡迎頁**：應用介紹和開始使用
2. **註冊頁**：創建用戶資料
3. **登入頁**：手機號碼驗證登入
4. **主頁**：發送寂寞信號或查看回應
5. **附近頁**：瀏覽附近需要陪伴的人
6. **收到頁**：查看收到的回應
7. **設置頁**：個人資料和隱私設置

## 🎯 核心交互流程

1. **用戶A發送寂寞信號**：點擊主頁按鈕 → 信號發送到附近列表
2. **用戶B看到並回應**：瀏覽附近列表 → 選擇一個 → 點擊「我陪你」
3. **用戶A收到回應**：主頁顯示回應數量和列表
4. **信號管理**：可隨時取消信號

## 🛠️ 開發指南

### 安裝依賴

```bash
npm install
```

### 啟動開發服務器

```bash
# 啟動 Expo 開發服務器
npm start

# 或者直接運行在特定平台
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### 構建應用程式

```bash
# 構建 Android APK
expo build:android

# 構建 iOS IPA
expo build:ios

# 構建 Web 版本
expo build:web
```

## 📦 項目結構

```
src/
├── context/           # 狀態管理
│   └── UserContext.tsx
└── screens/          # 頁面組件
    ├── WelcomeScreen.tsx
    ├── RegistrationScreen.tsx
    ├── LoginScreen.tsx
    ├── HomeScreen.tsx
    ├── ListScreen.tsx
    └── SettingsScreen.tsx
```

## 🎨 設計規範

### 顏色系統
- **主色調**：#FF6B6B (溫暖紅)
- **輔助色**：#4ECDC4 (青綠)
- **背景色**：#FFF5F5, #FFE5E5
- **文字色**：#333 (主), #666 (次), #999 (輔)

### 間距系統
- **主要間距**：30px, 20px, 15px
- **圓角**：按鈕30px, 卡片20px
- **陰影**：原生陰影效果

### 字體系統
- **標題**：24px, 粗體
- **副標題**：18-20px, 中粗
- **正文**：14-16px, 常規
- **輔助文字**：12-13px, 常規

## 📱 平台支持

- **iOS**：完全支持，包含原生動畫和手勢
- **Android**：完全支持，適配 Material Design
- **Web**：支持，但建議在手機上使用

## 🔧 自定義配置

### 導航配置
使用 React Navigation 6 實現：
- Stack Navigator：頁面間導航
- Tab Navigator：底部標籤導航
- 自定義過渡動畫

### 狀態管理
使用 React Context 實現：
- 用戶資料管理
- 寂寞信號狀態
- 附近列表數據
- 登入狀態

### 動畫系統
使用 React Native Animated API：
- 淡入淡出動畫
- 縮放動畫
- 滑動動畫
- 彈性動畫

## 📱 原生功能

### 已實現
- 響應式設計
- 原生動畫
- 手勢支持
- 狀態欄適配

### 可擴展
- 推送通知
- 地理位置
- 相機功能
- 生物識別

## 🌐 國際化

目前支持繁體中文，可輕鬆擴展到其他語言。

## 📱 安裝和運行

### 開發環境要求
- Node.js 18+
- Expo CLI
- Android Studio (Android 開發)
- Xcode (iOS 開發)

### 快速開始
```bash
# 克隆項目
git clone <repository-url>
cd beside-mobile

# 安裝依賴
npm install

# 啟動開發服務器
npm start

# 掃描 QR 碼在手機上預覽
# 或按 'a' 在 Android 模擬器中運行
# 或按 'i' 在 iOS 模擬器中運行
```

## 🤝 貢獻指南

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 推送到分支
5. 創建 Pull Request

## 📄 許可證

MIT License

## 💝 致謝

感謝所有為這個項目貢獻的人們，讓世界變得更溫暖。

---

**Beside — Someone's here.** 💕

*使用 React Native + Expo 構建，提供原生移動體驗*


