# 測試版構建 - 快速開始

## 🚀 快速構建步驟

### 1. 安裝 EAS CLI（如果還沒有）

```bash
npm install -g eas-cli
```

### 2. 登入 Expo 帳號

```bash
eas login
```

### 3. 配置項目（首次運行）

```bash
cd beside-mobile
eas build:configure
```

### 4. 設置測試服務器地址

編輯 `app.config.js`，將 `apiUrl` 改為你的測試服務器地址：

```javascript
extra: {
  apiUrl: process.env.API_URL || "https://your-test-server.com/api/v1",
}
```

**或者使用本地網絡 IP（如果手機和電腦在同一個 Wi-Fi）：**

```javascript
extra: {
  apiUrl: process.env.API_URL || "http://192.168.1.100:3001/api/v1",
}
```

### 5. 構建測試版本

**Android:**
```bash
npm run build:android
```

**iOS:**
```bash
npm run build:ios
```

**兩者:**
```bash
npm run build:all
```

---

## 📱 使用本地網絡 IP（快速測試）

如果你只想在手機上測試，而不想部署後端：

1. **找到電腦的 IP 地址：**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **編輯 `app.config.js`：**
   ```javascript
   apiUrl: "http://你的IP:3001/api/v1"
   ```
   例如：`http://192.168.1.100:3001/api/v1`

3. **確保後端正在運行：**
   ```bash
   cd beside-backend
   npm run dev
   ```

4. **構建測試版本：**
   ```bash
   cd beside-mobile
   npm run build:android
   ```

---

## ⚠️ 注意事項

- 構建過程可能需要 10-20 分鐘
- 首次構建需要配置證書（iOS 需要 Apple Developer 帳號）
- 構建完成後，EAS 會提供下載鏈接
- Android APK 可以直接安裝，iOS 需要通過 TestFlight 或 Ad Hoc 分發

---

詳細說明請查看 `BUILD_TEST_VERSION.md`








