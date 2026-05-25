# FortuneAI 部署指南

## 目录结构
```
fortune-ai/
├── proto/               # 前端 (React + Vite)
│   ├── dist/            # 构建产物
│   └── src/
├── backend/             # 后端 (FastAPI + Python)
│   ├── server.py
│   ├── baziCalculator.py
│   └── llmClient.py
└── agents/             # AI Agent 定义
```

---

## 前端部署 (Vercel)

### 方式1: Vercel CLI
```bash
npm i -g vercel
cd proto
vercel
```

### 方式2: GitHub + Vercel
1. 创建 GitHub repo
2. Push 代码
3. Vercel 控制台 Import 项目

### 环境变量
```
VITE_API_URL=https://your-backend.railway.app
```

### 访问码白名单
修改 `src/components/AccessGate.tsx` 中的 `VALID_CODES` 数组

---

## 后端部署 (Railway)

### 1. 创建 Railway 项目
```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
```

### 2. 环境变量
```
MINIMAX_API_KEY=your_api_key
```

### 3. 端口
Railway 自动设置 `PORT` 环境变量，FastAPI 用:
```python
uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
```

---

## 本地开发

### 前端
```bash
cd proto
npm install
npm run dev
```

### 后端
```bash
cd backend
python3 server.py
```

### 构建
```bash
cd proto && npm run build
# 产物在 dist/
```

---

## 付费流程

1. Gumroad 销售访问码
2. 用户购买后获得访问码
3. 输入访问码解锁 App
4. 访问码添加到 `AccessGate.tsx` 的白名单

### Gumroad 产品设置
- 产品名: FortuneAI 访问码
- 价格: ¥9.9 (一次性)
- 交付: 自动发送访问码
- 链接: https://pei362.gumroad.com/l/fortuneai
