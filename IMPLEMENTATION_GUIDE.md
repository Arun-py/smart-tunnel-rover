# Complete Implementation Guide
## Smart Tunnel and Parking Safety Inspection Rover

Step-by-step guide to build, configure, and deploy the entire system.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Hardware Assembly](#hardware-assembly)
3. [Software Setup](#software-setup)
4. [Firebase Configuration](#firebase-configuration)
5. [Arduino & ESP32 Programming](#arduino--esp32-programming)
6. [Backend Setup](#backend-setup)
7. [Frontend Setup](#frontend-setup)
8. [System Testing](#system-testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Hardware Components

- ✅ Arduino UNO R3
- ✅ ESP32 DevKit (ESP-WROOM-32)
- ✅ DHT22 temperature/humidity sensor
- ✅ MQ-2 gas sensor module
- ✅ HC-SR04 ultrasonic sensor
- ✅ L298N motor driver
- ✅ 4x DC motors (6V-12V)
- ✅ RC transmitter & receiver (2.4GHz)
- ✅ 2x batteries (7.4V for motors, 5V for logic)
- ✅ Rover chassis with wheels
- ✅ Jumper wires & breadboard

### Software Requirements

- ✅ Arduino IDE 2.x
- ✅ Node.js 18.x or higher
- ✅ MongoDB 6.x or higher
- ✅ Git (for version control)
- ✅ VS Code (recommended IDE)
- ✅ Google Chrome/Firefox

### Accounts

- ✅ Firebase account (free tier)
- ✅ GitHub account (optional, for version control)

---

## Hardware Assembly

### Step 1: Assemble the Chassis

1. **Mount motors** to the chassis (one per wheel)
2. **Attach wheels** to motor shafts
3. **Install battery holder** at the center (low position for stability)
4. **Mount Arduino UNO** on top using standoffs
5. **Mount ESP32** next to Arduino
6. **Mount L298N** near the motors (rear of chassis)
7. **Attach breadboard** between Arduino and ESP32

**Tip:** Keep weight balanced and center of gravity low to prevent tipping.

---

### Step 2: Wire Power System

**Refer to:** `HARDWARE_WIRING_GUIDE.md` for detailed wiring diagrams.

1. **Connect Motor Battery (7.4V) to L298N:**
   - Red (+) → L298N `+12V`
   - Black (-) → L298N `GND`

2. **Connect L298N to Motors:**
   - Left motors: `OUT1/OUT2`
   - Right motors: `OUT3/OUT4`

3. **Power Arduino UNO:**
   - **Option A:** USB cable from computer (for programming)
   - **Option B:** 5V from power bank → Arduino `VIN` or USB

4. **Power ESP32:**
   - **Option A:** USB cable from computer (for programming)
   - **Option B:** 5V from power bank → ESP32 `VIN` or USB

**Important:** Use separate batteries for motors and logic to prevent voltage drops.

---

### Step 3: Connect Sensors

#### HC-SR04 Ultrasonic (Arduino)

| HC-SR04 Pin | Arduino Pin |
|-------------|-------------|
| VCC         | 5V          |
| TRIG        | D9          |
| ECHO        | D10         |
| GND         | GND         |

#### DHT22 Temperature/Humidity (ESP32)

| DHT22 Pin   | ESP32 Pin   |
|-------------|-------------|
| VCC         | 3.3V        |
| DATA        | GPIO 4      |
| GND         | GND         |

#### MQ-2 Gas Sensor (ESP32)

| MQ-2 Pin    | ESP32 Pin   |
|-------------|-------------|
| VCC         | VIN (5V)    |
| AOUT        | GPIO 34     |
| GND         | GND         |

**Note:** MQ-2 requires 5V! Use ESP32's `VIN` pin when powered via USB.

---

### Step 4: Connect RC Receiver (Arduino)

| RC Receiver Pin | Arduino Pin |
|-----------------|-------------|
| CH1 (Signal)    | D11         |
| CH2 (Signal)    | D12         |
| VCC (+)         | 5V          |
| GND (-)         | GND         |

**Bind RC Transmitter:**
1. Follow RC manual to bind transmitter to receiver
2. Verify: Receiver LED should be solid (not blinking)

---

### Step 5: Connect Arduino ↔ ESP32 Serial

| Arduino Pin | ESP32 Pin   |
|-------------|-------------|
| D1 (TX)     | GPIO 16 (RX2)|
| D0 (RX)     | GPIO 17 (TX2)|
| GND         | GND         |

**Important:** Shared GND is essential for serial communication!

---

### Step 6: Final Hardware Check

- [ ] All wires secured with zip ties
- [ ] No loose connections
- [ ] Polarity correct (red = +, black = -)
- [ ] No short circuits (use multimeter)
- [ ] Sensors mounted securely
- [ ] Wheels spin freely

---

## Software Setup

### Step 1: Install Arduino IDE

1. Download from [arduino.cc](https://www.arduino.cc/en/software)
2. Install for your OS (Windows/Mac/Linux)
3. Open Arduino IDE

---

### Step 2: Install ESP32 Board Support

1. In Arduino IDE, go to **File → Preferences**
2. Add to **Additional Board Manager URLs**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Go to **Tools → Board → Boards Manager**
4. Search for **ESP32**
5. Install **ESP32 by Espressif Systems** (latest version)

---

### Step 3: Install Required Libraries

**For Arduino UNO (no libraries needed):**
- Uses built-in functions only

**For ESP32:**

1. **DHT Sensor Library:**
   - Go to **Sketch → Include Library → Manage Libraries**
   - Search: `DHT sensor library`
   - Install: **DHT sensor library by Adafruit**
   - Also install dependency: **Adafruit Unified Sensor**

2. **Firebase ESP32 Library:**
   - Search: `Firebase ESP32`
   - Install: **Firebase Arduino Client Library for ESP8266 and ESP32**

---

### Step 4: Install Node.js

1. Download from [nodejs.org](https://nodejs.org/) (LTS version)
2. Run installer (Windows: `.msi`, Mac: `.pkg`)
3. Verify installation:
   ```powershell
   node --version   # Should show v18.x or higher
   npm --version    # Should show 9.x or higher
   ```

---

### Step 5: Install MongoDB

**Option A: MongoDB Community Server (Local)**

1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer (Windows: `.msi`, Mac: `.dmg`)
3. Default installation (port 27017)
4. Verify MongoDB is running:
   ```powershell
   mongosh
   show dbs
   exit
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0 Sandbox)
3. Get connection string
4. Update `backend/src/config/database.js` with connection string

---

### Step 6: Install Git (Optional)

1. Download from [git-scm.com](https://git-scm.com/)
2. Run installer
3. Verify:
   ```powershell
   git --version
   ```

---

## Firebase Configuration

**Full guide:** See `FIREBASE_SETUP_GUIDE.md`

### Quick Setup:

1. **Create Firebase Project:**
   - Go to [console.firebase.google.com](https://console.firebase.google.com/)
   - Click **Add Project**
   - Name: `tunnel-inspection-rover`
   - Disable Analytics → **Create**

2. **Enable Realtime Database:**
   - Click **Realtime Database** in left menu
   - **Create Database**
   - Location: **United States**
   - Start in **Test Mode** → **Enable**

3. **Get Database Credentials:**
   - Go to **Project Settings (⚙️)** → **Service accounts**
   - **Database secrets** tab → Copy the secret key
   - Note the database URL: `https://tunnel-inspection-rover-default-rtdb.firebaseio.com/`

4. **Download Service Account Key:**
   - **Service accounts** tab → **Generate new private key**
   - Download JSON file
   - **Save as:** `backend/firebase-service-account.json`

5. **Configure Security Rules:**
   - Go to **Realtime Database** → **Rules** tab
   - For testing, use:
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```
   - **Publish**

---

## Arduino & ESP32 Programming

### Step 1: Program Arduino UNO

1. **Open Arduino Code:**
   - In Arduino IDE: **File → Open**
   - Navigate to: `arduino/arduino_uno_rc_rover/arduino_uno_rc_rover.ino`

2. **Select Board:**
   - **Tools → Board → Arduino AVR Boards → Arduino UNO**
   - **Tools → Port → COM3** (or your Arduino port)

3. **Upload Code:**
   - Click **Upload** button (→)
   - Wait for "Done uploading"

4. **Test:**
   - Open **Serial Monitor** (Ctrl+Shift+M)
   - Set baud rate: **115200**
   - Move RC transmitter sticks
   - You should see:
     ```
     CH1: 1500, CH2: 1500
     DISTANCE: 150
     ```

---

### Step 2: Program ESP32

1. **Open ESP32 Code:**
   - **File → Open**
   - Navigate to: `arduino/esp32_firebase_rover/esp32_firebase_rover.ino`

2. **Configure WiFi & Firebase:**
   - Find lines:
     ```cpp
     #define WIFI_SSID "YourWiFiName"
     #define WIFI_PASSWORD "YourWiFiPassword"
     #define FIREBASE_HOST "tunnel-inspection-rover-default-rtdb.firebaseio.com"
     #define FIREBASE_AUTH "your_database_secret_here"
     ```
   - Replace with your actual credentials (from Firebase step)

3. **Select Board:**
   - **Tools → Board → ESP32 Arduino → ESP32 Dev Module**
   - **Tools → Port → COM4** (or your ESP32 port)
   - **Tools → Upload Speed → 115200**
   - **Tools → Flash Size → 4MB (32Mb)**

4. **Upload Code:**
   - Click **Upload** button (→)
   - Wait for "Done uploading"
   - ESP32 may reboot automatically

5. **Test:**
   - Open **Serial Monitor**
   - Set baud rate: **115200**
   - You should see:
     ```
     Connecting to WiFi...
     WiFi connected
     IP address: 192.168.1.100
     Firebase connected!
     Temperature: 25.3°C
     Humidity: 60.2%
     Gas Level: 45 ppm
     Sending data to Firebase...
     Data sent successfully!
     ```

6. **Verify in Firebase:**
   - Go to Firebase Console → **Realtime Database** → **Data** tab
   - You should see:
     ```
     sensorData/
       ├── latest/
       │   ├── temperature: 25.3
       │   ├── humidity: 60.2
       │   ├── gasLevel: 45
       │   └── distance: 150
       └── history/...
     ```

---

## Backend Setup

### Step 1: Install Dependencies

```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\backend"
npm install
```

This installs:
- `express` (server)
- `mongoose` (MongoDB ODM)
- `socket.io` (WebSocket)
- `firebase-admin` (Firebase SDK)
- `cors`, `dotenv`

---

### Step 2: Configure Firebase Service Account

1. **Place the downloaded JSON file** in `backend/` folder:
   ```
   backend/
     ├── firebase-service-account.json  ← Must be here
     ├── package.json
     └── src/...
   ```

2. **Verify file name** is exactly `firebase-service-account.json`

---

### Step 3: Configure Database Connection

If using **MongoDB Atlas** (cloud), update `backend/src/config/database.js`:

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roadscan';
```

Replace with Atlas connection string:
```javascript
const MONGODB_URI = 'mongodb+srv://user:pass@cluster.mongodb.net/roadscan?retryWrites=true&w=majority';
```

---

### Step 4: Start MongoDB (Local)

```powershell
# MongoDB should auto-start. If not:
mongod
```

Leave this terminal open.

---

### Step 5: Start Firebase Bridge

Open **new terminal**:

```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\backend"
npm run firebase-bridge
```

You should see:
```
Firebase bridge started...
Connected to MongoDB
Listening for Firebase data at: /sensorData/latest
```

**Keep this running!** It listens to Firebase and saves data to MongoDB.

---

### Step 6: Start Backend Server

Open **another new terminal**:

```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\backend"
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
Socket.IO initialized
```

**Keep this running!** It serves the dashboard and WebSocket.

---

## Frontend Setup

### Step 1: Install Dependencies

Open **new terminal**:

```powershell
cd "c:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\frontend"
npm install
```

---

### Step 2: Start Development Server

```powershell
npm start
```

This will:
- Start React dev server on `http://localhost:3000`
- Auto-open browser
- Enable hot-reload (changes auto-refresh)

---

### Step 3: Verify Dashboard

You should see:
- **Landing Page** with "Smart Tunnel and Parking Safety Inspection Rover"
- Click **Open Dashboard** → Dashboard with sensor cards

---

## System Testing

### End-to-End Test

**Objective:** Verify data flows from ESP32 → Firebase → MongoDB → Dashboard

1. **Check Firebase:**
   - Firebase Console → Realtime Database → Data
   - Should show live sensor readings updating every 2 seconds

2. **Check MongoDB:**
   ```powershell
   mongosh
   use roadscan
   db.sensordatas.find().pretty()
   ```
   Should show documents like:
   ```json
   {
     "_id": ObjectId("..."),
     "temperature": 25.3,
     "humidity": 60.2,
     "gasLevel": 45,
     "distance": 150,
     "timestamp": ISODate("2025-01-23T...")
   }
   ```

3. **Check Dashboard:**
   - Open `http://localhost:3000`
   - Temperature, Humidity, Gas Level, Distance cards should update in real-time
   - Check browser console for WebSocket messages:
     ```
     WebSocket connected
     New sensor data: {temperature: 25.3, ...}
     ```

---

### Test RC Control

1. **Power on** rover (with motors on blocks, wheels off ground)
2. **Turn on** RC transmitter
3. **Move throttle stick** forward
   - **Expected:** All wheels spin forward
4. **Move steering stick** left/right
   - **Expected:** Wheels turn at different speeds (differential steering)

---

### Test Gas Sensor

1. **Pre-heat MQ-2** for 5 minutes
2. **Light a match** near sensor (safe distance!)
3. **Expected:**
   - ESP32 Serial Monitor: `Gas Level: 300+ ppm`
   - Firebase: `gasLevel` increases
   - Dashboard: Gas Level card shows spike
   - Firebase bridge console: `⚠️ Gas level high: 350 ppm`

---

### Test Obstacle Detection

1. **Place object** 10cm in front of ultrasonic sensor
2. **Expected:**
   - Arduino Serial Monitor: `DISTANCE: 10`
   - ESP32 receives via serial: `Obstacle detected: 10 cm`
   - Firebase: `distance: 10`
   - Dashboard: Distance card shows 10 cm
   - Firebase bridge console: `⚠️ Obstacle detected: 10 cm`

---

## Deployment

### Build Frontend for Production

```powershell
cd frontend
npm run build
```

This creates optimized build in `frontend/build/`.

---

### Serve Frontend from Backend

The backend is already configured to serve `frontend/build/` at `http://localhost:5000`.

**Test:**
1. Stop React dev server (Ctrl+C in frontend terminal)
2. Open `http://localhost:5000`
3. Should see landing page (now served by backend)

---

### Run on System Startup (Windows)

**Option 1: Task Scheduler**

1. Open **Task Scheduler**
2. **Create Task** → Name: `Rover Backend`
3. **Trigger:** At startup
4. **Action:** Start a program
   - Program: `node`
   - Arguments: `C:\Users\arunc\Downloads\MERN_STACK_PROJECTs\SANDY'S\RoadScan\backend\src\server.js`
5. Repeat for Firebase bridge

**Option 2: PM2 (Process Manager)**

```powershell
npm install -g pm2
cd backend
pm2 start src/server.js --name backend
pm2 start src/firebase-bridge.js --name firebase-bridge
pm2 startup
pm2 save
```

---

### Deploy to Cloud (Optional)

**Backend (Heroku, Railway, Render):**

1. Create account on [render.com](https://render.com/) (free tier)
2. Create **Web Service**
3. Connect GitHub repo
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` (Atlas connection string)
   - Upload `firebase-service-account.json` as secret file

**Frontend (Netlify, Vercel):**

1. Create account on [netlify.com](https://www.netlify.com/)
2. Deploy `frontend/build/` folder
3. Set environment variable:
   - `REACT_APP_API_URL=https://your-backend-url.com`

---

## Troubleshooting

### Issue 1: "Cannot connect to WiFi"

**Symptoms:** ESP32 Serial Monitor shows `Connecting to WiFi...` indefinitely

**Solutions:**
- Verify WiFi SSID and password are correct (case-sensitive!)
- Check router supports 2.4GHz (ESP32 doesn't support 5GHz)
- Move ESP32 closer to router
- Check firewall isn't blocking ESP32

---

### Issue 2: "Firebase connection failed"

**Symptoms:** `[ERROR] Firebase connection failed`

**Solutions:**
- Verify `FIREBASE_HOST` has no `https://` or trailing `/`
- Check `FIREBASE_AUTH` secret key is correct
- Ensure Firebase database rules allow write access
- Test Firebase URL in browser: `https://tunnel-inspection-rover-default-rtdb.firebaseio.com/.json`

---

### Issue 3: "MongoDB connection failed"

**Symptoms:** Backend terminal shows `MongoDB connection error`

**Solutions:**
- Verify MongoDB is running: `mongosh`
- Check connection string in `backend/src/config/database.js`
- For Atlas, verify IP whitelist (0.0.0.0/0 for allow all)
- Check network allows port 27017

---

### Issue 4: "Dashboard not updating"

**Symptoms:** Dashboard loads but sensor values don't change

**Solutions:**
- Check backend terminal for errors
- Check Firebase bridge terminal: should show "New data received"
- Check browser console for WebSocket errors
- Verify backend is running on port 5000
- Check CORS settings in `backend/src/server.js`

---

### Issue 5: "Motors don't respond to RC"

**Symptoms:** RC transmitter works, but motors don't spin

**Solutions:**
- Check L298N power LED is on (battery connected)
- Verify ENA/ENB jumpers are on L298N
- Check Arduino code uploaded successfully
- Use multimeter to check PWM output at Arduino pins 2, 7
- Test motors directly with battery (bypass driver)

---

### Issue 6: "MQ-2 reads 0 constantly"

**Symptoms:** Gas sensor always shows 0 ppm

**Solutions:**
- **Pre-heat:** MQ-2 needs 5 minutes minimum (24-48 hours for first use)
- Check 5V power supply (MQ-2 won't work on 3.3V)
- Adjust potentiometer on MQ-2 module
- Replace MQ-2 if expired (2-3 year lifespan)

---

## System Architecture Summary

```
┌──────────────────────────────────────────────────────────────┐
│                    HARDWARE LAYER                            │
├──────────────────────────────────────────────────────────────┤
│  Arduino UNO                    ESP32 DevKit                 │
│  - RC Receiver (CH1, CH2)       - WiFi/Internet              │
│  - L298N Motor Driver           - DHT22 (Temp/Humidity)      │
│  - 4x DC Motors                 - MQ-2 (Gas Sensor)          │
│  - HC-SR04 (Ultrasonic)         - Serial RX2/TX2             │
│  - Serial TX/RX ────────────────────┘                        │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼ (WiFi)
┌──────────────────────────────────────────────────────────────┐
│                    CLOUD LAYER                               │
├──────────────────────────────────────────────────────────────┤
│  Firebase Realtime Database                                  │
│  - Path: /sensorData/latest                                  │
│  - Path: /sensorData/history                                 │
│  - Real-time sync                                            │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼ (Firebase Admin SDK)
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND LAYER (Node.js)                     │
├──────────────────────────────────────────────────────────────┤
│  Firebase Bridge (firebase-bridge.js)                        │
│  - Listens to Firebase /sensorData/latest                   │
│  - Saves to MongoDB (roadscan database)                     │
│                                                              │
│  Express Server (server.js)                                 │
│  - REST API for sensor data                                 │
│  - Socket.IO for real-time WebSocket                        │
│  - Serves frontend build at /                               │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼ (WebSocket + HTTP)
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND LAYER (React)                      │
├──────────────────────────────────────────────────────────────┤
│  Landing Page (LandingPage.js)                               │
│  - Project information                                       │
│  - Objectives & ITS relevance                                │
│                                                              │
│  Dashboard (App.js)                                          │
│  - Temperature Card (TemperatureChart.js)                    │
│  - Humidity Card (SensorCard.js)                             │
│  - Gas Level Card (SensorCard.js)                            │
│  - Distance Card (SensorCard.js)                             │
│  - Event Log (EventLog.js)                                   │
│  - Vehicle Status (VehicleStatus.js)                         │
└──────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
RoadScan/
├── arduino/
│   ├── arduino_uno_rc_rover/
│   │   └── arduino_uno_rc_rover.ino      (RC control, motors, ultrasonic)
│   └── esp32_firebase_rover/
│       └── esp32_firebase_rover.ino      (WiFi, Firebase, DHT22, MQ-2)
│
├── backend/
│   ├── package.json
│   ├── firebase-service-account.json     (Download from Firebase)
│   └── src/
│       ├── server.js                     (Express server + Socket.IO)
│       ├── firebase-bridge.js            (Firebase → MongoDB bridge)
│       ├── config/
│       │   └── database.js               (MongoDB connection)
│       ├── models/
│       │   └── index.js                  (SensorData, Analytics schemas)
│       └── routes/
│           └── api.js                    (REST API endpoints)
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── build/                            (Production build)
│   └── src/
│       ├── App.js                        (Main dashboard)
│       ├── index.js                      (Entry point)
│       ├── components/
│       │   ├── LandingPage.js            (Home page)
│       │   ├── Header.js                 (Navigation)
│       │   ├── SensorCard.js             (Sensor widgets)
│       │   ├── TemperatureChart.js       (Chart visualization)
│       │   ├── EventLog.js               (Event history)
│       │   └── VehicleStatus.js          (Rover status)
│       └── context/
│           └── AuthContext.js            (User authentication)
│
├── FIREBASE_SETUP_GUIDE.md               (Firebase configuration)
├── HARDWARE_WIRING_GUIDE.md              (Wiring diagrams)
├── IMPLEMENTATION_GUIDE.md               (This file)
└── README.md                             (Project overview)
```

---

## Quick Start Commands

### Development Mode

**Terminal 1: MongoDB**
```powershell
mongod
```

**Terminal 2: Firebase Bridge**
```powershell
cd backend
npm run firebase-bridge
```

**Terminal 3: Backend**
```powershell
cd backend
npm start
```

**Terminal 4: Frontend**
```powershell
cd frontend
npm start
```

---

### Production Mode

```powershell
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend)
cd backend
npm start
# or
pm2 start src/server.js --name backend
pm2 start src/firebase-bridge.js --name firebase-bridge
```

Open `http://localhost:5000`

---

## Success Criteria

### System is working if:

- ✅ ESP32 connects to WiFi (Serial Monitor shows IP address)
- ✅ Firebase shows sensor data updating every 2 seconds
- ✅ MongoDB has sensor documents (check with `mongosh`)
- ✅ Dashboard displays real-time sensor values
- ✅ RC control spins motors (wheels on blocks)
- ✅ Gas sensor detects match/lighter flame
- ✅ Ultrasonic sensor detects obstacles <20cm
- ✅ Temperature/humidity readings are reasonable (15-35°C, 30-90%)

---

## Next Steps

After successful implementation:

1. **Calibrate Sensors:**
   - MQ-2: Baseline calibration in fresh air
   - Ultrasonic: Test at various distances (10cm-4m)

2. **Field Testing:**
   - Test rover in actual tunnel/parking environment
   - Verify WiFi range (use WiFi extender if needed)
   - Monitor battery life (expect 2-4 hours runtime)

3. **Dashboard Enhancements:**
   - Add historical charts (last 24 hours)
   - Add email/SMS alerts for high gas levels
   - Add GPS tracking (if using GPS module)

4. **Documentation:**
   - Record test results
   - Create user manual
   - Prepare project report/presentation

---

**Implementation Complete!** 🎉

Your Smart Tunnel and Parking Safety Inspection Rover is now operational.

For questions or issues, refer to the troubleshooting sections in each guide.
