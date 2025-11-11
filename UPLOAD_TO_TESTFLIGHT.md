# 📤 上傳到 TestFlight

## ✅ 已完成
- ✅ 後端已部署到 Railway
- ✅ API URL 已更新：`https://beside-backend-production.up.railway.app/api/v1`
- ✅ iOS 構建已完成

---

## 🚀 上傳到 TestFlight

### 方法 1：使用 EAS Submit（推薦）

在終端執行：

```bash
cd /Users/andyh/beside/beside-mobile
eas submit --platform ios --latest
```

**注意**：如果遇到 API Key 配置問題，使用下面的方法 2。

---

### 方法 2：使用 Transporter App（更簡單）

#### 步驟 1：下載構建文件

1. 在瀏覽器中打開構建頁面：
   - https://expo.dev/accounts/andy8044/projects/beside-mobile/builds
   
2. 找到最新的構建（應該顯示 "Finished" 或 "Ready"）
3. 點擊下載 `.ipa` 文件

#### 步驟 2：下載 Transporter App

1. 打開 Mac App Store
2. 搜索 "Transporter"
3. 或直接訪問：https://apps.apple.com/app/transporter/id1450874784
4. 下載並安裝

#### 步驟 3：上傳

1. 打開 Transporter App
2. 使用你的 Apple Developer 帳號登入
3. 將下載的 `.ipa` 文件拖到 Transporter 視窗
4. 點擊 "交付" 或 "Deliver"
5. 等待上傳完成

#### 步驟 4：等待處理

- Apple 需要 5-10 分鐘處理
- 在 App Store Connect → TestFlight 查看狀態

#### 步驟 5：分配給測試群組

處理完成後：

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 選擇你的 App（ID: 6754879063）
3. 點擊 "TestFlight" 標籤
4. 找到你的構建版本
5. 點擊構建版本
6. 在 "內部測試" 或 "外部測試" 中啟用
7. 測試人員的狀態會更新！

---

## 🎯 測試

上傳完成後：

1. 在 TestFlight 中安裝新版本
2. 測試註冊功能
3. 確認能連接到後端 API（不應該再出現 "Network request failed"）

---

## ✅ 完成！

現在 TestFlight 的 app 應該能正常連接到後端了！
