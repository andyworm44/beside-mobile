# TestFlight 測試版發布指南

## 📋 前置準備

### 1. Apple Developer 帳號

你需要：
- ✅ **Apple Developer Program 會員資格**（$99/年）
- ✅ 前往 [developer.apple.com](https://developer.apple.com) 註冊或登入

### 2. App Store Connect 設置

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 使用你的 Apple Developer 帳號登入
3. 創建新 App（如果還沒有）：
   - 點擊「我的 App」
   - 點擊「+」創建新 App
   - 填寫 App 資訊：
     - **名稱**：Beside
     - **主要語言**：繁體中文
     - **Bundle ID**：`com.beside.mobile`（需先在 Apple Developer 中註冊）
     - **SKU**：`beside-mobile-001`

### 3. 安裝必要工具

```bash
# 安裝 EAS CLI
npm install -g eas-cli

# 安裝 Expo CLI（如果還沒有）
npm install -g expo-cli
```

---

## 🚀 發布步驟

### 步驟 1：登入 Expo 和 Apple Developer

```bash
# 登入 Expo
eas login

# 配置 Apple 憑證（首次運行會引導你）
eas build:configure
```

### 步驟 2：配置測試服務器地址

編輯 `app.config.js`，設置你的測試服務器地址：

```javascript
extra: {
  apiUrl: process.env.API_URL || "https://your-test-server.com/api/v1",
}
```

**重要**：測試版本需要連接到實際的後端服務器，不能使用 `localhost`！

### 步驟 3：構建並提交到 TestFlight

#### 方法 A：一鍵構建並提交（推薦）

```bash
# 構建 iOS 版本並自動提交到 TestFlight
eas build --platform ios --profile preview-testflight --auto-submit
```

#### 方法 B：分步進行

**1. 構建：**
```bash
npm run build:ios-testflight
```

**2. 等待構建完成**（約 15-30 分鐘）

**3. 提交到 App Store Connect：**
```bash
npm run submit:ios
```

或者手動提交：
```bash
eas submit --platform ios
```

---

## 📱 在 TestFlight 中管理測試版本

### 1. 訪問 App Store Connect

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 選擇你的 App
3. 點擊「TestFlight」標籤

### 2. 添加測試人員

#### 內部測試（最多 100 人）
- 點擊「內部測試」
- 添加測試人員的 Apple ID 郵件
- 測試人員會收到邀請郵件

#### 外部測試（最多 10,000 人，需要 App Review）
- 點擊「外部測試」
- 創建測試群組
- 添加測試人員
- 提交審核（首次需要）

### 3. 發送測試邀請

1. 選擇構建版本
2. 點擊「提交審核」（外部測試）或直接啟用（內部測試）
3. 測試人員會收到邀請

---

## 🤖 Android 測試版本

Android 不需要 TestFlight，可以直接分發 APK：

### 方法 1：構建 APK

```bash
npm run build:android
```

構建完成後，EAS 會提供下載鏈接。你可以：
- 直接分享 APK 文件給測試人員
- 上傳到 Google Play Console 進行內部測試

### 方法 2：Google Play 內部測試

1. 前往 [Google Play Console](https://play.google.com/console)
2. 創建應用
3. 上傳 APK 到「內部測試」軌道
4. 添加測試人員

---

## ⚙️ 配置說明

### Bundle ID 和 Package Name

已在 `app.config.js` 中設置：
- **iOS**: `com.beside.mobile`
- **Android**: `com.beside.mobile`

### 版本號

每次構建新版本時，需要更新版本號：

**編輯 `app.config.js`：**
```javascript
version: "1.0.1",  // 增加版本號
```

或使用 EAS 自動遞增：
```bash
eas build --platform ios --auto-increment
```

---

## 🔍 常見問題

### 1. 憑證問題

**問題**：構建時出現憑證錯誤

**解決方案**：
```bash
# 清除憑證並重新生成
eas credentials
```

### 2. Bundle ID 衝突

**問題**：Bundle ID 已被使用

**解決方案**：
- 在 `app.config.js` 中修改 Bundle ID
- 或使用你自己的 Bundle ID（需先在 Apple Developer 註冊）

### 3. 測試服務器連接失敗

**問題**：App 無法連接到後端

**解決方案**：
- 確認 `app.config.js` 中的 `apiUrl` 是正確的測試服務器地址
- 確保後端服務器正在運行
- 檢查防火牆和網絡設置

### 4. 提交審核被拒

**問題**：外部測試需要 App Review

**解決方案**：
- 首次外部測試需要通過 Apple 審核
- 準備測試說明和截圖
- 或使用內部測試（不需要審核）

---

## 📝 檢查清單

發布前請確認：

- [ ] Apple Developer 帳號已激活
- [ ] App Store Connect 中已創建 App
- [ ] Bundle ID 已在 Apple Developer 中註冊
- [ ] `app.config.js` 中的測試服務器地址已設置
- [ ] 後端服務器正在運行並可訪問
- [ ] 版本號已更新
- [ ] 所有功能已測試

---

## 🎯 下一步

1. **構建測試版本**：`npm run build:ios-testflight`
2. **等待構建完成**（約 15-30 分鐘）
3. **提交到 TestFlight**：`npm run submit:ios` 或自動提交
4. **添加測試人員**：在 App Store Connect 中添加
5. **收集反饋**：通過 TestFlight 收集測試反饋
6. **修復問題**：根據反饋修復 bug
7. **準備正式發布**：當測試穩定後，準備正式版本

---

**祝你發布順利！** 🚀

如有問題，請查看 [EAS Build 文檔](https://docs.expo.dev/build/introduction/) 或 [Apple 官方文檔](https://developer.apple.com/testflight/)。




