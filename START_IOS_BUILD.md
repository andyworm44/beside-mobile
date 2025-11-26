# iOS 測試版構建 - 快速開始

## 📋 第一步：登入帳號

### 1. 登入 Expo 帳號

```bash
cd /Users/andyh/beside/beside-mobile
eas login
```

如果沒有 Expo 帳號：
- 前往 [expo.dev](https://expo.dev) 註冊
- 或執行 `eas register` 直接註冊

### 2. 檢查登入狀態

```bash
eas whoami
```

應該會顯示你的 Expo 帳號郵件。

---

## 🔧 第二步：配置項目

### 首次配置

```bash
eas build:configure
```

這會：
- 創建 EAS 項目（如果還沒有）
- 詢問是否要設置 Apple 憑證
- 引導你配置 iOS 構建設置

### 配置選項說明

當提示時，選擇：
- **Apple 憑證**：選擇「自動管理」（推薦）
- **Bundle Identifier**：使用 `com.beside.mobile`（或你的）
- **Apple Team ID**：需要輸入你的 Apple Developer Team ID

---

## 🍎 第三步：Apple Developer 設置

### 需要準備的資訊

1. **Apple Developer 帳號**
   - 如果還沒有，前往 [developer.apple.com](https://developer.apple.com) 註冊
   - 需要付費會員資格（$99/年）

2. **Apple Team ID**
   - 登入 Apple Developer
   - 在「Membership」頁面可以找到 Team ID

3. **Bundle ID 註冊**
   - 在 Apple Developer → Certificates, Identifiers & Profiles
   - 創建新的 App ID：`com.beside.mobile`

### 配置 Apple 憑證

EAS 會自動處理憑證，但首次需要你的 Apple Developer 帳號資訊：

```bash
eas credentials
```

選擇：
- Platform: iOS
- Action: Set up credentials
- 選擇「自動管理」

---

## 🚀 第四步：設置測試服務器地址

**重要**：測試版本需要連接到實際的後端服務器！

編輯 `app.config.js`：

```javascript
extra: {
  apiUrl: process.env.API_URL || "https://your-test-server.com/api/v1",
}
```

**選項 A：使用本地網絡 IP（快速測試）**

1. 找到你的電腦 IP：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. 編輯 `app.config.js`：
   ```javascript
   apiUrl: "http://192.168.1.100:3001/api/v1"  // 替換為你的 IP
   ```

3. 確保後端正在運行：
   ```bash
   cd /Users/andyh/beside/beside-backend
   npm run dev
   ```

**選項 B：使用部署的測試服務器**

直接設置服務器 URL 即可。

---

## 📱 第五步：構建 iOS 測試版本

### 構建命令

```bash
npm run build:ios-testflight
```

或：

```bash
eas build --platform ios --profile preview-testflight
```

### 構建過程

1. **上傳代碼**：EAS 會上傳你的項目到構建服務器
2. **構建 App**：在 Apple 的構建服務器上編譯（約 15-30 分鐘）
3. **下載鏈接**：構建完成後會提供下載鏈接

### 自動提交到 TestFlight（可選）

如果想構建後自動提交到 TestFlight：

```bash
eas build --platform ios --profile preview-testflight --auto-submit
```

---

## 📝 構建完成後

### 1. 提交到 App Store Connect（如果沒有自動提交）

```bash
npm run submit:ios
```

或：

```bash
eas submit --platform ios
```

### 2. 在 App Store Connect 中管理

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 選擇你的 App
3. 點擊「TestFlight」標籤
4. 添加測試人員並發送邀請

---

## ⚠️ 常見問題

### 1. 登入失敗

**問題**：`eas login` 失敗

**解決方案**：
- 確認網絡連接正常
- 檢查 Expo 帳號是否正確
- 嘗試 `eas logout` 後重新登入

### 2. Apple 憑證錯誤

**問題**：構建時出現憑證問題

**解決方案**：
```bash
eas credentials
```
選擇 iOS → 清除憑證 → 重新設置

### 3. Bundle ID 衝突

**問題**：Bundle ID 已被使用

**解決方案**：
- 在 `app.config.js` 中修改 `bundleIdentifier`
- 或使用你自己的 Bundle ID

### 4. 構建失敗

**問題**：構建過程中出現錯誤

**解決方案**：
- 查看構建日誌中的錯誤訊息
- 檢查 `app.config.js` 配置是否正確
- 確認所有依賴都已正確安裝

---

## 🎯 下一步

1. ✅ 登入 Expo：`eas login`
2. ✅ 配置項目：`eas build:configure`
3. ✅ 設置測試服務器地址
4. ✅ 構建：`npm run build:ios-testflight`
5. ✅ 提交到 TestFlight：`npm run submit:ios`

---

**開始吧！** 🚀








