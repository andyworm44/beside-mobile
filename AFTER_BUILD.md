# 構建完成後的步驟

## ✅ 構建已完成！

---

## 📱 下一步：提交到 TestFlight

### 方法 1：自動提交（如果構建時使用了 --auto-submit）

如果構建時使用了 `--auto-submit`，構建會自動提交到 App Store Connect。

### 方法 2：手動提交

```bash
cd /Users/andyh/beside/beside-mobile
npm run submit:ios
```

或：

```bash
eas submit --platform ios
```

---

## 🎯 在 App Store Connect 中管理

### 1. 登入 App Store Connect

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 選擇你的 App（如果還沒有，需要先創建）

### 2. 創建 App（如果還沒有）

1. 點擊「我的 App」
2. 點擊「+」創建新 App
3. 填寫資訊：
   - **名稱**：Beside
   - **主要語言**：繁體中文
   - **Bundle ID**：`com.beside.mobile`
   - **SKU**：`beside-mobile-001`

### 3. 前往 TestFlight

1. 選擇你的 App
2. 點擊「TestFlight」標籤
3. 應該會看到剛提交的構建版本

---

## 👥 添加測試人員

### 內部測試（最多 100 人，不需要審核）

1. 在 TestFlight 頁面，點擊「內部測試」
2. 點擊「+」添加測試人員
3. 輸入測試人員的 Apple ID 郵件
4. 測試人員會收到邀請郵件

### 外部測試（最多 10,000 人，首次需要審核）

1. 點擊「外部測試」
2. 創建測試群組
3. 添加測試人員
4. 提交審核（首次需要）

---

## 📲 測試人員如何安裝

測試人員需要：

1. 在 iPhone/iPad 上安裝「TestFlight」App（從 App Store）
2. 打開收到的邀請郵件
3. 點擊「在 TestFlight 中查看」
4. 或直接打開 TestFlight App，會看到邀請

---

## ✅ 檢查清單

- [ ] 構建已完成
- [ ] 提交到 App Store Connect（如果沒有自動提交）
- [ ] 在 App Store Connect 中創建 App（如果還沒有）
- [ ] 看到構建版本在 TestFlight 中
- [ ] 添加測試人員
- [ ] 測試人員收到邀請

---

**現在可以開始測試了！** 🎉




