# Deployment Guide - Smart Tunnel Inspection Rover

## Architecture Overview
```
ESP32 (Rover) → Backend (Render/Railway) → Frontend (Vercel)
                      ↓
                  WebSocket
                      ↓
                React Dashboard
```

## Prerequisites
- GitHub account
- Vercel account (free tier)
- Render/Railway account (for backend - free tier)
- Git installed locally

---

## Step 1: Git Setup

### Initialize Repository
```bash
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan"
git init
git add .
git commit -m "Initial commit: Smart Tunnel Inspection Rover"
```

### Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `smart-tunnel-rover`
3. Description: "Autonomous tunnel inspection rover with real-time monitoring"
4. Public/Private: Choose based on preference
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-tunnel-rover.git
git branch -M main
git push -u origin main
```

---

## Step 2: Backend Deployment (Render - Recommended)

### Why Backend First?
The frontend needs the backend URL to connect. Deploy backend first to get the production URL.

### Option A: Render (Recommended - Free)

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `smart-tunnel-rover`
   - Service name: `tunnel-rover-backend`

3. **Configure Build Settings**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server-http-direct.js`
   - **Environment**: `Node`

4. **Environment Variables**
   - Add `PORT` = `5000` (auto-set by Render)
   - Add `NODE_ENV` = `production`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - Note the URL: `https://tunnel-rover-backend.onrender.com`

### Option B: Railway (Alternative - Free)

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Select `smart-tunnel-rover` repository
4. Root directory: `backend`
5. Start command: `node src/server-http-direct.js`
6. Note the generated URL

---

## Step 3: Frontend Deployment (Vercel)

### Update Backend URL in Code

**Before deploying**, update the backend URL in `frontend/src/Dashboard.js`:

```javascript
// Change this line (around line 8)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
```

Then create `frontend/.env.production`:
```
REACT_APP_BACKEND_URL=https://tunnel-rover-backend.onrender.com
```

### Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select GitHub repository: `smart-tunnel-rover`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**
   - Key: `REACT_APP_BACKEND_URL`
   - Value: `https://tunnel-rover-backend.onrender.com`
   - (Replace with your actual backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Note the URL: `https://tunnel-rover.vercel.app`

---

## Step 4: Update Backend CORS

### Update server-http-direct.js

After deployment, update CORS to allow your Vercel domain:

```javascript
// In backend/src/server-http-direct.js
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://tunnel-rover.vercel.app',  // Add your Vercel URL
    'https://*.vercel.app'               // Allow all Vercel preview deployments
  ],
  credentials: true
};
```

**Commit and push changes:**
```bash
git add backend/src/server-http-direct.js
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the update.

---

## Step 5: Update ESP32 Code

### Change SERVER_URL

In `arduino/esp32_http_rover/esp32_http_rover.ino` (line 22):

```cpp
// Change from:
const char* SERVER_URL = "http://10.33.64.133:5000/api/sensor-data";

// To:
const char* SERVER_URL = "https://tunnel-rover-backend.onrender.com/api/sensor-data";
```

**Upload to ESP32** using Arduino IDE.

---

## Step 6: Testing

### Test Backend API
```bash
curl https://tunnel-rover-backend.onrender.com/api/health
# Should return: {"status":"ok","mode":"HTTP Direct"}
```

### Test Frontend
1. Visit: `https://tunnel-rover.vercel.app`
2. Should see landing page with video background
3. Click "Launch Dashboard"
4. Should see sensor cards (waiting for data)

### Test ESP32 → Backend → Frontend
1. Power on ESP32
2. Check Serial Monitor (115200 baud)
3. Should see: "✓ Data sent to server"
4. Refresh dashboard - should show live sensor data
5. Data should update every 2 seconds during scan phase

---

## Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs: Dashboard → "Logs"
- Verify start command: `node src/server-http-direct.js`
- Ensure `PORT` environment variable is set

**ESP32 can't reach backend**
- Use HTTPS URL (not HTTP) for deployed backend
- Check Render logs for incoming POST requests
- Verify SERVER_URL in ESP32 code

### Frontend Issues

**"Failed to load"**
- Check Vercel deployment logs
- Verify root directory is `frontend`
- Ensure build command is `npm run build`

**Dashboard shows "Waiting for data"**
- Check browser console (F12) for WebSocket errors
- Verify REACT_APP_BACKEND_URL environment variable
- Ensure backend is running (check Render dashboard)

**CORS errors**
- Update backend CORS to include Vercel URL
- Redeploy backend after CORS update

### ESP32 Issues

**"Connection failed"**
- Ensure using HTTPS URL for production backend
- Check WiFi credentials
- Verify backend is accessible: `curl https://your-backend.onrender.com/api/health`

---

## URLs Summary

After deployment, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://tunnel-rover.vercel.app` | Public-facing dashboard |
| **Backend** | `https://tunnel-rover-backend.onrender.com` | API + WebSocket server |
| **GitHub** | `https://github.com/YOUR_USERNAME/smart-tunnel-rover` | Source code |

---

## Free Tier Limitations

### Render Free Tier
- ✅ 750 hours/month (sufficient for testing)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds
- 💡 Solution: Keep a browser tab open, or upgrade to paid tier ($7/month)

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ Always online
- ✅ Auto-deploy on git push
- ✅ 100GB bandwidth/month

---

## Continuous Deployment

After initial setup, updates are automatic:

1. **Make code changes locally**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```
3. **Auto-deployment:**
   - Vercel rebuilds frontend automatically
   - Render rebuilds backend automatically
4. **Wait 1-2 minutes** for changes to go live

---

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```
REACT_APP_BACKEND_URL=https://tunnel-rover-backend.onrender.com
```

### ESP32 (hardcoded)
```cpp
const char* SERVER_URL = "https://tunnel-rover-backend.onrender.com/api/sensor-data";
```

---

## Security Notes

1. **Never commit** `firebase-service-account.json` (already in .gitignore)
2. **Never commit** `.env` files with sensitive data
3. **Use environment variables** for all configuration
4. **HTTPS only** for production (Vercel and Render provide this automatically)

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update ESP32 code with production URL
4. ✅ Test end-to-end data flow
5. 📝 Document hardware assembly (see HARDWARE_WIRING_GUIDE.md)
6. 🎥 Record demo video for project presentation

---

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- ESP32 HTTPS: Use `HTTPClient` with `client.setInsecure()` for self-signed certs (if needed)

**Project complete! 🎉**
