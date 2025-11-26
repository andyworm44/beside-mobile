# ✅ 準備構建 iOS 測試版本

## 當前狀態

✅ **Expo 項目已連結**
- 項目：`@andy8044/beside-mobile`
- 項目 ID：`9073d3db-6296-43a4-82ff-0299e8b2af04`

✅ **測試服務器已配置**
- API URL：`http://10.45.216.238:3001/api/v1`
- 後端服務器：正在運行

---

## 🚀 開始構建

### 方法 1：直接構建（推薦）

```bash
cd /Users/andyh/beside/beside-mobile
npm run build:ios-testflight
```

### 方法 2：使用 EAS 命令

```bash
cd /Users/andyh/beside/beside-mobile
eas build --platform ios --profile preview-testflight
```

---

## ⚠️ 首次構建會發生什麼？

1. **EAS 會詢問 Apple 憑證配置**
   - 選擇「自動管理」（推薦）
   - 需要輸入你的 Apple Developer Team ID
   - 需要輸入 Apple ID 和密碼

2. **構建過程**（約 15-30 分鐘）
   - 上傳代碼到 EAS 構建服務器
   - 編譯 iOS App
   - 生成 .ipa 文件

3. **構建完成後**
   - 會提供下載鏈接
   - 可以選擇自動提交到 TestFlight

---

## 📝 需要準備的資訊

### Apple Developer 帳號資訊

如果還沒有，需要：
1. 前往 [developer.apple.com](https://developer.apple.com) 註冊
2. 付費會員資格：$99/年
3. 獲取 Team ID（在 Membership 頁面）

### App Store Connect

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 創建新 App（如果還沒有）
3. Bundle ID：`com.beside.mobile`

---

## 🎯 現在可以開始了！

執行構建命令後，按照提示操作即可。

```bash
npm run build:ios-testflight
```

---

**注意**：如果使用本地 IP，確保測試手機和電腦在同一個 Wi-Fi 網絡！








