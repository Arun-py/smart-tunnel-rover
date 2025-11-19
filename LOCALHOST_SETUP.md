# 🖥️ RoadScan Localhost Setup Script

## Step 1: Install MongoDB Locally (Windows)

### Download and Install MongoDB
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service (recommended)

### Verify MongoDB Installation
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it
net start MongoDB

# Test MongoDB connection
mongo --version
```

---

## Step 2: Setup Backend (localhost)

### Navigate to backend folder
```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\backend"
```

### Install dependencies
```powershell
npm install
```

### Create .env file for localhost
Create a file named `.env` in the backend folder:

```env
# MongoDB local connection
MONGODB_URI=mongodb://localhost:27017/roadscan

# Server port
PORT=5000

# Environment
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Start the backend server
```powershell
# Development mode with auto-reload
npm run dev

# OR production mode
npm start
```

**Expected Output:**
```
=================================
🚗 RoadScan Backend Server
=================================
✓ Server running on port 5000
✓ MongoDB Connected: localhost
✓ Database: roadscan
✓ Environment: development
✓ API: http://localhost:5000/api
✓ Socket.IO: Enabled
=================================
```

---

## Step 3: Setup Frontend (localhost)

### Open NEW terminal/PowerShell window
```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\frontend"
```

### Install dependencies
```powershell
npm install
```

### Create .env file (optional - defaults to localhost:5000)
Create a file named `.env` in the frontend folder:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Start the React development server
```powershell
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view roadscan-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Browser should automatically open to `http://localhost:3000`

---

## Step 4: Get Your Computer's IP Address (for ESP32)

```powershell
ipconfig
```

**Look for:** IPv4 Address under your WiFi adapter (e.g., `192.168.1.100`)

---

## Step 5: Configure ESP32 for Localhost

### Edit the Arduino file
Open: `arduino\roadscan_esp32\roadscan_esp32.ino`

### Update these lines:
```cpp
// Line 9-11: Add your WiFi credentials
const char* ssid = "YourWiFiName";              // Your WiFi SSID
const char* password = "YourWiFiPassword";      // Your WiFi password
const char* serverUrl = "http://192.168.1.100:5000/api/sensor-data"; // Use YOUR IP!
```

**⚠️ Important:** 
- Replace `192.168.1.100` with YOUR computer's IP from Step 4
- Use your actual WiFi name and password
- Make sure ESP32 and computer are on the SAME WiFi network

---

## Step 6: Test the Complete System

### A. Test Backend API
Open browser or use PowerShell:

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get

# Expected response:
# status: OK
# uptime: (number)
# mongodb: Connected
```

### B. Test Frontend
Open browser to: `http://localhost:3000`

You should see:
- ✅ RoadScan Command Center dashboard
- ✅ Connection status (should show "Connected")
- ✅ Sensor cards (showing "--" initially)
- ✅ Hazard map
- ✅ Event log

### C. Upload ESP32 Code
1. Open Arduino IDE
2. Open `arduino\roadscan_esp32\roadscan_esp32.ino`
3. Update WiFi credentials and server URL (Step 5)
4. Select Board: ESP32 Dev Module
5. Select Port
6. Click Upload

### D. Monitor ESP32
Open Serial Monitor (115200 baud):

Expected output:
```
=== RoadScan ESP32 Starting ===
Connecting to WiFi: YourWiFiName
....
✓ WiFi Connected!
IP Address: 192.168.1.xxx
=== Setup Complete ===

--- Sensor Data ---
Temp: 25.5 °C
Humidity: 60 %
Distance: 45 cm
Pothole: NO
Status: Patrolling
✓ Data sent | Response: 201
-------------------
```

### E. Watch Dashboard Update
Go back to `http://localhost:3000` and watch:
- Temperature, humidity, distance update in real-time
- Event log shows new entries
- Hazard map shows markers when potholes/obstacles detected

---

## 🎯 Quick Command Summary

### Terminal 1 (Backend):
```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\backend"
npm install
# Create .env file with MongoDB URI
npm run dev
```

### Terminal 2 (Frontend):
```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\frontend"
npm install
npm start
```

### Browser:
```
http://localhost:3000    # Dashboard
http://localhost:5000    # API
```

---

## 🔧 Troubleshooting Localhost Setup

### Backend won't start

**Error: "MongoDB connection failed"**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Or install MongoDB if not installed
# Download from: https://www.mongodb.com/try/download/community
```

**Error: "Port 5000 already in use"**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Frontend won't start

**Error: "Port 3000 already in use"**
```
Would you like to run the app on another port instead? (Y/n)
```
Type `Y` and press Enter

**Error: "Cannot connect to backend"**
- Check if backend is running on port 5000
- Verify `REACT_APP_BACKEND_URL` in frontend/.env
- Check browser console for CORS errors

### ESP32 won't connect

**WiFi connection fails:**
- Check SSID and password spelling
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Move ESP32 closer to router

**Data not sending:**
- Verify serverUrl uses your computer's IP (not localhost)
- Check if computer firewall is blocking port 5000
- Ensure ESP32 and computer on same WiFi network

**Get your IP again:**
```powershell
ipconfig | findstr IPv4
```

---

## 📊 Verify Everything is Working

### Checklist:

- [ ] MongoDB service is running
- [ ] Backend shows "MongoDB Connected" in console
- [ ] Backend accessible at http://localhost:5000
- [ ] Frontend opens at http://localhost:3000
- [ ] Frontend shows "Connected" status (green)
- [ ] ESP32 connects to WiFi (check Serial Monitor)
- [ ] ESP32 sends data (Response: 200 or 201)
- [ ] Dashboard updates with real sensor data
- [ ] Event log shows entries
- [ ] Hazard map shows markers

---

## 🎨 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend Dashboard** | http://localhost:3000 | Main UI |
| **Backend API** | http://localhost:5000 | API server |
| **API Health** | http://localhost:5000/health | Health check |
| **Latest Sensor Data** | http://localhost:5000/api/sensor-data/latest | Get latest reading |
| **All Hazards** | http://localhost:5000/api/hazards | Get hazards |
| **Analytics** | http://localhost:5000/api/analytics | Get statistics |

---

## 🧪 Test Without Hardware

You can test the full system without ESP32 by sending fake data:

```powershell
# Send test sensor data
$body = @{
    deviceId = "ESP32_Test"
    temperature = 28.5
    humidity = 65
    distance = 15
    potholeDetected = $true
    vehicleStatus = "Testing"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/sensor-data" -Method Post -Body $body -ContentType "application/json"
```

Watch the dashboard update instantly!

---

## 🔥 Quick Start Script (All-in-One)

Save this as `start-roadscan.ps1`:

```powershell
# Start MongoDB
Write-Host "Starting MongoDB..." -ForegroundColor Green
net start MongoDB

# Start Backend (in new window)
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY''S\RoadScan\backend'; npm run dev"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend (in new window)
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY''S\RoadScan\frontend'; npm start"

Write-Host "`n✅ RoadScan is starting!" -ForegroundColor Green
Write-Host "Dashboard will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API running at: http://localhost:5000" -ForegroundColor Cyan
```

Run with:
```powershell
powershell -ExecutionPolicy Bypass -File start-roadscan.ps1
```

---

## 🎯 Next Steps After Localhost Setup

1. **Test without hardware** using the PowerShell commands above
2. **Add WiFi credentials** to ESP32 code
3. **Get your IP address** using `ipconfig`
4. **Upload to ESP32** and watch real-time updates
5. **Build the vehicle** following HARDWARE_GUIDE.md

---

**🚀 Your localhost setup is ready! Follow the steps above to get started.**

For detailed hardware setup, see: [HARDWARE_GUIDE.md](../HARDWARE_GUIDE.md)
