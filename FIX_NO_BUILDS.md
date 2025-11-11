# 修復 "No Builds Available" 問題

## ❌ 問題

測試人員狀態顯示「No Builds Available」，表示他們還沒有可用的構建版本。

---

## 🔍 檢查步驟

### 1. 檢查 TestFlight 中是否有構建版本

在 App Store Connect 中：

1. 選擇你的 App
2. 點擊「TestFlight」標籤
3. 查看「iOS Builds」部分
4. 應該會看到構建版本（可能是「Processing」狀態）

### 2. 如果沒有看到構建版本

這表示構建還沒有提交到 App Store Connect，需要手動上傳。

---

## 🔧 解決方案

### 方法 1：手動上傳 .ipa 文件（推薦）

1. **下載構建文件**：
   - 構建鏈接：https://expo.dev/artifacts/eas/4Wx6B2Qui8DeYS8Wqtu535.ipa
   - 或從 Expo 構建頁面下載

2. **使用 Transporter App 上傳**：
   - 下載 [Transporter App](https://apps.apple.com/app/transporter/id1450874784)
   - 打開 Transporter，登入你的 Apple ID
   - 拖拽 .ipa 文件到 Transporter
   - 點擊「交付」或「Deliver」

3. **等待處理**：
   - Apple 需要幾分鐘處理構建
   - 在 TestFlight 中查看狀態

### 方法 2：使用 EAS Submit（如果配置正確）

如果配置了 App Store Connect 資訊，可以嘗試：

```bash
cd /Users/andyh/beside/beside-mobile
eas submit --platform ios --latest
```

但這需要先在 `eas.json` 中配置正確的 App Store Connect 資訊。

---

## 📝 分配構建給測試群組

構建處理完成後：

1. 在 TestFlight 中，找到你的構建版本
2. 點擊構建版本
3. 選擇「內部測試」或「外部測試」
4. 啟用構建版本
5. 測試人員的狀態應該會更新

---

## ⚠️ 常見問題

### 問題 1：構建還在「Processing」狀態

**解決方案**：等待幾分鐘，Apple 正在處理構建。

### 問題 2：構建顯示「Missing Compliance」

**解決方案**：
1. 點擊構建版本
2. 回答「Export Compliance」問題
3. 選擇「No」或根據實際情況回答

### 問題 3：協議問題還沒解決

**解決方案**：
- 確保已接受 Apple Developer Program License Agreement
- 確保已提供 Trader Status

---

## ✅ 檢查清單

- [ ] 構建已完成 ✅
- [ ] 在 TestFlight 中看到構建版本
- [ ] 構建狀態不是「Processing」
- [ ] 構建已分配給測試群組
- [ ] 測試人員狀態更新為「可用」

---

**建議先檢查 TestFlight 中是否有構建版本！** 🔍




