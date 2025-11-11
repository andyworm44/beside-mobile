# 🔧 修復 TestFlight 網絡錯誤

## ❌ 問題

在 TestFlight 中出現：
```
註冊失敗: Network request failed
```

**原因**：TestFlight 的 app 無法連接到本地後端服務器。

---

## ✅ 解決方案

### 方案 1：部署後端到公共服務器（推薦）

#### 選項 A：使用 Railway（最簡單）

1. **註冊 Railway**
   - 前往 https://railway.app
   - 使用 GitHub 登入

2. **創建新項目**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇 `beside-backend` 倉庫

3. **配置環境變數**
   - 在 Railway 項目設置中，添加以下環境變數：
     ```
     SUPABASE_URL=你的_supabase_url
     SUPABASE_ANON_KEY=你的_anon_key
     SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
     JWT_SECRET=你的_jwt_secret
     PORT=3001
     NODE_ENV=production
     CORS_ORIGIN=*
     ```

4. **獲取部署 URL**
   - Railway 會自動生成一個 URL，例如：
     `https://beside-backend-production.up.railway.app`
   - API 端點：`https://beside-backend-production.up.railway.app/api/v1`

5. **更新 EAS 配置**
   - 編輯 `beside-mobile/eas.json`
   - 將 `API_URL` 更新為你的 Railway URL：
     ```json
     "env": {
       "API_URL": "https://beside-backend-production.up.railway.app/api/v1"
     }
     ```

6. **重新構建**
   ```bash
   cd /Users/andyh/beside/beside-mobile
   eas build --platform ios --profile preview-testflight
   ```

---

#### 選項 B：使用 Render

1. **註冊 Render**
   - 前往 https://render.com
   - 使用 GitHub 登入

2. **創建 Web Service**
   - 連接 `beside-backend` 倉庫
   - 設置：
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **配置環境變數**（同 Railway）

4. **獲取 URL**（格式：`https://beside-backend.onrender.com/api/v1`）

---

#### 選項 C：使用 Fly.io

1. **安裝 Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **初始化 Fly 應用**
   ```bash
   cd /Users/andyh/beside/beside-backend
   fly launch
   ```

3. **配置環境變數**
   ```bash
   fly secrets set SUPABASE_URL=你的_supabase_url
   fly secrets set SUPABASE_ANON_KEY=你的_anon_key
   fly secrets set SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
   fly secrets set JWT_SECRET=你的_jwt_secret
   fly secrets set NODE_ENV=production
   fly secrets set PORT=3001
   ```

4. **部署**
   ```bash
   fly deploy
   ```

---

### 方案 2：使用臨時測試服務器（快速測試）

如果你想快速測試，可以使用：

1. **ngrok**（臨時隧道）
   ```bash
   # 安裝 ngrok
   brew install ngrok
   
   # 啟動本地後端
   cd /Users/andyh/beside/beside-backend
   npm run dev
   
   # 在另一個終端創建隧道
   ngrok http 3001
   ```
   
   ngrok 會提供一個臨時 URL，例如：`https://abc123.ngrok.io`
   - API 端點：`https://abc123.ngrok.io/api/v1`
   
   ⚠️ **注意**：ngrok 免費版 URL 每次重啟都會變化，僅適合臨時測試。

2. **更新配置**
   ```json
   "env": {
     "API_URL": "https://abc123.ngrok.io/api/v1"
   }
   ```

---

## 📝 更新配置步驟

### 1. 編輯 `eas.json`

找到 `preview-testflight` profile，更新 `API_URL`：

```json
"preview-testflight": {
  "distribution": "store",
  "ios": {
    "simulator": false,
    "buildConfiguration": "Release"
  },
  "env": {
    "API_URL": "https://你的實際服務器地址/api/v1"
  }
}
```

### 2. 重新構建

```bash
cd /Users/andyh/beside/beside-mobile
eas build --platform ios --profile preview-testflight
```

### 3. 上傳到 TestFlight

使用 Transporter 或 `eas submit` 上傳新的構建。

---

## 🎯 推薦流程

1. **立即**：使用 ngrok 快速測試（5分鐘）
2. **之後**：部署到 Railway（15分鐘，永久解決）

---

## ❓ 需要幫助？

如果你已經有部署的後端 URL，直接告訴我，我會幫你更新配置！



