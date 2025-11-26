# 配置 EAS Submit 自動提交

## 🔍 需要找到的資訊

### 1. App Store Connect App ID (ascAppId)

這是一個純數字的 ID，例如：`1234567891`

**如何找到**：
1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 選擇你的 App
3. 在 App 資訊頁面，URL 會顯示類似：
   `https://appstoreconnect.apple.com/apps/1234567891/appstore`
   - 這裡的 `1234567891` 就是 App ID
4. 或者在 App 資訊頁面頂部可以看到 App ID

### 2. Apple Team ID

這是 10 個大寫字母或數字的組合，例如：`AB32CZE81F`

**如何找到**：
1. 前往 [Apple Developer](https://developer.apple.com)
2. 登入你的帳號
3. 前往「Membership」頁面
4. 在「Team ID」欄位可以看到 Team ID

---

## 📝 配置步驟

找到這些資訊後，我會幫你更新 `eas.json` 配置。

---

## 🚀 配置完成後

就可以使用：

```bash
eas submit --platform ios --latest
```

自動提交到 TestFlight！

---

**現在請告訴我：**
1. **App Store Connect App ID**（純數字）
2. **Apple Team ID**（10 個字符）

找到後告訴我，我會幫你配置！🔧








