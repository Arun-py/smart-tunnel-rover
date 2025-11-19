# 🚀 Quick Start Guide - RoadScan Project

This guide will help you get the entire RoadScan system up and running.

## 📋 Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed (local) OR MongoDB Atlas account (cloud)
- [ ] Arduino IDE installed
- [ ] ESP32 board and sensors
- [ ] WiFi network (2.4GHz)

## 🎯 Step-by-Step Setup

### Step 1: Setup Backend Server

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy and configure environment file
cp .env.example .env
# Edit .env file - set your MongoDB connection string

# Start the server
npm run dev
```

✅ **Verify:** Server should be running on `http://localhost:5000`

---

### Step 2: Setup Frontend Dashboard

```powershell
# Open new terminal/PowerShell window
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

✅ **Verify:** Dashboard should open at `http://localhost:3000`

---

### Step 3: Setup MongoDB

#### Option A: Local MongoDB
```powershell
# Start MongoDB service (Windows)
net start MongoDB

# Verify connection
# Backend logs should show "MongoDB Connected"
```

#### Option B: MongoDB Atlas (Recommended)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

---

### Step 4: Upload ESP32 Code

1. **Open Arduino IDE**
2. **Open File:** `arduino/roadscan_esp32/roadscan_esp32.ino`
3. **Configure WiFi:**
   ```cpp
   const char* ssid = "YourWiFiName";
   const char* password = "YourWiFiPassword";
   ```
4. **Get Your Computer's IP:**
   ```powershell
   ipconfig
   # Note the IPv4 Address (e.g., 192.168.1.100)
   ```
5. **Update Server URL:**
   ```cpp
   const char* serverUrl = "http://192.168.1.100:5000/api/sensor-data";
   ```
6. **Select Board:** Tools → Board → ESP32 Dev Module
7. **Select Port:** Tools → Port → (your ESP32 port)
8. **Upload:** Click Upload button (→)

---

### Step 5: Test the System

#### Test Backend API
```powershell
# Test endpoint
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
```

#### Test ESP32
1. Open Serial Monitor (115200 baud)
2. Check WiFi connection
3. Verify sensor readings
4. Confirm data sending to server

#### Test Frontend
1. Open `http://localhost:3000`
2. Check connection status (should be green)
3. Watch for real-time sensor data
4. Trigger pothole detection (black paper under IR sensor)
5. Watch hazard map update

---

## 🔍 System Architecture Flow

```
┌─────────────────┐
│   ESP32 Vehicle │ ──WiFi──┐
│  (Sensor Data)  │         │
└─────────────────┘         │
                            ▼
                    ┌─────────────────┐
                    │  Node.js API    │
                    │  (Port 5000)    │
                    └─────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
                    ▼                ▼
            ┌─────────────┐  ┌─────────────┐
            │  MongoDB    │  │  Socket.IO  │
            │  (Storage)  │  │  (Real-time)│
            └─────────────┘  └─────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  React Dashboard│
                            │  (Port 3000)    │
                            └─────────────────┘
```

---

## ✅ Verification Checklist

### Backend Running ✓
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] API endpoint `/health` responds
- [ ] Socket.IO initialized

### Frontend Running ✓
- [ ] React app loads in browser
- [ ] Connection status shows "Connected"
- [ ] Dashboard UI displays correctly
- [ ] No console errors

### ESP32 Running ✓
- [ ] WiFi connects successfully
- [ ] Serial monitor shows sensor data
- [ ] HTTP POST requests succeed (response 200/201)
- [ ] Motors respond to obstacles

### End-to-End ✓
- [ ] Dashboard shows real-time temperature
- [ ] Dashboard shows real-time humidity
- [ ] Dashboard shows obstacle distance
- [ ] Pothole detection triggers alert
- [ ] Hazard map shows markers
- [ ] Event log updates

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution:** 
- Check if MongoDB is running
- Verify `.env` file exists and is configured
- Run `npm install` again

### Issue: Frontend shows "Disconnected"
**Solution:**
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify no firewall blocking

### Issue: ESP32 won't connect to WiFi
**Solution:**
- Check SSID/password spelling
- Ensure 2.4GHz WiFi (not 5GHz)
- Move ESP32 closer to router
- Check Serial Monitor for error messages

### Issue: Data not showing on dashboard
**Solution:**
- Verify ESP32 is sending data (check Serial Monitor)
- Check serverUrl uses computer's IP, not localhost
- Ensure ESP32 and computer on same network
- Check backend logs for incoming requests

---

## 📊 Testing Without Hardware

You can test the full stack without ESP32:

### Simulate Sensor Data
```powershell
# Send test data to backend
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

Watch the dashboard update in real-time!

---

## 🎨 Next Steps

1. **Calibrate Sensors:** Adjust IR sensor sensitivity
2. **Test Navigation:** Place obstacles and watch avoidance
3. **Monitor Data:** Check MongoDB for stored records
4. **Customize Dashboard:** Modify colors, add features
5. **Add GPS:** Integrate GPS module for location tracking
6. **Deploy:** Host backend and frontend online

---

## 📚 Additional Resources

- **Backend API Docs:** `backend/README.md`
- **Frontend Guide:** `frontend/README.md`
- **Arduino Setup:** `arduino/README.md`
- **Hardware Wiring:** `arduino/README.md` (Pin Reference Table)

---

## 🆘 Need Help?

Check the detailed README files in each folder:
- Hardware issues → `arduino/README.md`
- Backend issues → `backend/README.md`
- Frontend issues → `frontend/README.md`

---

## 🎉 Success!

If all checkmarks are complete, your RoadScan system is fully operational!

The autonomous vehicle should now:
- ✅ Navigate and avoid obstacles
- ✅ Detect potholes
- ✅ Monitor environment
- ✅ Send real-time data to cloud
- ✅ Display on professional dashboard

**Happy road scanning! 🚗💨**
