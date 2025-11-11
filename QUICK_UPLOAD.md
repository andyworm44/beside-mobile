# 快速上傳到 TestFlight

## ✅ 已配置完成

- App Store Connect App ID: `6754879063` ✅

---

## 🚀 使用 Transporter App 上傳（最簡單）

### 步驟 1：下載構建文件

點擊下載：
- https://expo.dev/artifacts/eas/4Wx6B2Qui8DeYS8Wqtu535.ipa

或從構建頁面：
- https://expo.dev/accounts/andy8044/projects/beside-mobile/builds/1fe8be58-32d4-4735-9df4-31ce83bce218

### 步驟 2：下載 Transporter App

1. 打開 Mac App Store
2. 搜索「Transporter」
3. 或直接訪問：https://apps.apple.com/app/transporter/id1450874784
4. 下載並安裝

### 步驟 3：上傳

1. 打開 Transporter App
2. 使用你的 Apple Developer 帳號登入
3. 將下載的 `.ipa` 文件拖到 Transporter 視窗
4. 點擊「交付」或「Deliver」
5. 等待上傳完成

### 步驟 4：等待處理

- Apple 需要 5-10 分鐘處理
- 在 App Store Connect → TestFlight 查看狀態

### 步驟 5：分配給測試群組

處理完成後：

1. 前往 [App Store Connect](https://appstoreconnect.apple.com)
2. 選擇你的 App（ID: 6754879063）
3. 點擊「TestFlight」標籤
4. 找到你的構建版本
5. 點擊構建版本
6. 在「內部測試」中啟用
7. 測試人員的狀態會更新！

---

## 🔄 如果想使用 EAS Submit（稍後配置）

需要在終端中執行：

```bash
cd /Users/andyh/beside/beside-mobile
eas submit --platform ios --latest
```

然後按照提示配置 App Store Connect API Key。

---

**現在先用 Transporter 上傳吧！** 📤


