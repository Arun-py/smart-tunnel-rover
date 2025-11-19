# Firebase Mode Setup Guide

## 🔥 Firebase Configuration Complete!

### ESP32 Code: `esp32_firebase_rover_v2.ino`

**Upload this file to your ESP32 for Firebase mode.**

**Features:**
- ✅ Autonomous circular movement (2s forward, 10s scan, 0.5s turn)
- ✅ Direct Firebase Realtime Database connection
- ✅ DHT22, MQ-2, HC-SR04 sensors
- ✅ L298N motor control
- ✅ WiFi credentials: ZORO/zoro1111

**Firebase Database Path:**
```
/sensors
  ├── temperature (float)
  ├── humidity (float)
  ├── gasLevel (int)
  ├── distance (float)
  ├── condition (string: Good/Warning/Bad)
  ├── timestamp (long)
  └── deviceId (string: rover_001)
```

---

## 📱 Frontend Setup

### Firebase Config (Already Updated)
- File: `frontend/src/firebase.js`
- Database: `https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app`
- API Key: Configured ✅

### Dashboard Mode Toggle
File: `frontend/src/App.js`
```javascript
const USE_FIREBASE_MODE = true; // Currently set to Firebase mode
```

**To switch modes:**
- `USE_FIREBASE_MODE = true` → Uses Firebase (DashboardFirebase.js)
- `USE_FIREBASE_MODE = false` → Uses HTTP Direct (Dashboard.js)

---

## 🚀 Deployment Steps

### 1. Upload ESP32 Code
```bash
1. Open Arduino IDE
2. Load: esp32_firebase_rover/esp32_firebase_rover_v2.ino
3. Select Board: ESP32 Dev Module
4. Select Port: Your ESP32 COM port
5. Upload
6. Open Serial Monitor (115200 baud)
```

**Expected Serial Output:**
```
=== Smart Tunnel Inspection Rover ===
Civil Engineering Department - 2025

✅ WiFi connected!
IP Address: 192.168.x.x
✅ Firebase anonymous sign-in successful
✓ Firebase initialized
✓ Motors initialized

=== Rover Initialized ===
Starting autonomous navigation...

📡 Scanning... (1/5)
📊 Sensor Data:
  🌡 Temp: 30.5°C
  💧 Humidity: 75.2%
  🧪 Gas: 42 ppm
  📏 Distance: 125.3 cm
  🧠 Condition: Good
✅ Data uploaded to Firebase successfully
```

### 2. Test Firebase Connection

**Check Firebase Console:**
1. Go to https://console.firebase.google.com
2. Select project: `rover-6126b`
3. Navigate to Realtime Database
4. You should see `/sensors` path updating every 2 seconds

**Or test with curl:**
```bash
curl "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app/sensors.json"
```

### 3. Deploy Frontend

**Auto-deployment already configured!**
```bash
# Changes are already committed
git status
# Should show: "Your branch is up to date with 'origin/main'"
```

**Vercel will auto-deploy:**
- Firebase mode enabled by default
- Dashboard reads from `/sensors` path
- Real-time updates every time ESP32 sends data

---

## 🔧 Troubleshooting

### ESP32 Issues

**"Firebase sign-up failed"**
- Check WiFi connection
- Verify API_KEY matches Firebase console
- Ensure Firebase Authentication is enabled (Anonymous sign-in)

**"Temp/Hum upload failed"**
- Check Firebase database rules (should be `.read: true, .write: true`)
- Verify database URL ends with `.firebasedatabase.app`
- Check Serial Monitor for error messages

**"WiFi connection failed"**
- Verify SSID: "ZORO"
- Verify password: "zoro1111"
- Check WiFi signal strength

### Frontend Issues

**"No data available"**
- Check Firebase Console → Realtime Database
- Verify `/sensors` path exists
- Ensure ESP32 is running and uploading data

**Dashboard shows "--"**
- Open browser console (F12)
- Look for Firebase connection errors
- Verify `USE_FIREBASE_MODE = true` in App.js

**"Permission denied"**
- Check Firebase database rules:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

---

## 📊 Data Flow

```
ESP32 Rover
    ↓
WiFi (ZORO)
    ↓
Firebase Realtime Database
(/sensors path)
    ↓
React Dashboard
(Real-time listener)
    ↓
Live Charts & Alerts
```

---

## 🔄 Switching Between Modes

### Use Firebase Mode (Current)
```javascript
// In App.js
const USE_FIREBASE_MODE = true;
```
- ESP32: Upload `esp32_firebase_rover_v2.ino`
- Dashboard: Reads from Firebase

### Use HTTP Direct Mode
```javascript
// In App.js
const USE_FIREBASE_MODE = false;
```
- ESP32: Upload `esp32_http_rover.ino`
- Backend: Run `npm start` in `backend/`
- Dashboard: Connects via Socket.IO

---

## 📝 Firebase Database Rules

**Current rules** (already set):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**For production** (recommended):
```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": true
    }
  }
}
```

---

## ✅ Verification Checklist

- [ ] ESP32 code uploaded successfully
- [ ] Serial Monitor shows "✅ Firebase anonymous sign-in successful"
- [ ] Firebase Console shows `/sensors` data updating
- [ ] Dashboard shows live sensor values
- [ ] Graphs update in real-time
- [ ] Motor movement: 2s forward → 10s scan → 0.5s turn
- [ ] Alerts trigger when thresholds exceeded

---

## 🎉 Success Indicators

**ESP32:**
- ✅ WiFi connected
- ✅ Firebase sign-in successful  
- ✅ Data uploaded every 2 seconds (during scan)

**Firebase:**
- ✅ `/sensors` path exists
- ✅ All 7 fields present (temp, hum, gas, distance, condition, timestamp, deviceId)
- ✅ Timestamp updates every 2 seconds

**Dashboard:**
- ✅ Connection status: Connected
- ✅ All sensor cards show live values
- ✅ Graphs populate with data points
- ✅ Alerts appear when needed
- ✅ Last update time shows recent timestamp

---

## 🆘 Need Help?

Check these files:
- ESP32: `arduino/esp32_firebase_rover/esp32_firebase_rover_v2.ino`
- Frontend: `frontend/src/DashboardFirebase.js`
- Config: `frontend/src/firebase.js`
- Mode Switch: `frontend/src/App.js` (line 16)

Firebase project URL: https://console.firebase.google.com/project/rover-6126b
