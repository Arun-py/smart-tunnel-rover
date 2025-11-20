# Smart Tunnel & Parking Safety Inspection Rover

## 🎯 Project Overview

An autonomous IoT-based environmental monitoring system designed for underground tunnel and parking infrastructure safety inspection. The rover autonomously navigates in circular patterns while continuously monitoring temperature, humidity, gas levels, and obstacle distances in real-time.

**Department:** Civil Engineering  
**Year:** 2025  
**Category:** Intelligent Transportation Systems (ITS)

---

## 👥 Team Members

1. **SANTHOSH KUMAR K** (727723EUCV050)
2. **AADEESH G** (727723EUCV001)
3. **PRADEESH S** (727723EUCV040)
4. **HEMENTH R** (727723EUCV022)
5. **JEREM SAMUEL J** (727723EUCV025)
6. **VISHNU PRAKASH G S** (727723EUCV066)

---

## 🚀 Key Features

### Autonomous Operation
- **Timer-based navigation**: 2 seconds forward → 10 seconds scanning → 0.5 seconds turn right
- **No manual control required**: Fully autonomous circular inspection pattern
- **Obstacle detection**: HC-SR04 ultrasonic sensor measures distances up to 400cm
- **Continuous operation**: Repeats inspection cycle indefinitely

### Multi-Sensor Environmental Monitoring
- **DHT22 Temperature & Humidity Sensor**
  - Temperature range: -40°C to 80°C (±0.5°C accuracy)
  - Humidity range: 0-100% RH (±2% accuracy)
  - Real-time climate monitoring for structural health

- **MQ-2 Gas Sensor**
  - Detects: LPG, Propane, Methane, Carbon Monoxide, Smoke
  - Range: 0-1000 ppm
  - Critical for tunnel safety and fire prevention

- **HC-SR04 Ultrasonic Sensor**
  - Range: 2cm - 400cm
  - Accuracy: ±3mm
  - Obstacle avoidance and path clearance verification

### Real-Time Data Transmission
- **HTTP Direct Mode** (Production)
  - ESP32 → HTTPS POST → Render Backend → WebSocket → Vercel Dashboard
  - Socket.IO for instant real-time updates
  - Sub-second latency for critical alerts

- **Live Dashboard Features**
  - Color-coded sensor cards with status indicators
  - Real-time graphs (Temperature, Humidity, Gas Level)
  - Alert system for dangerous conditions
  - Mobile-responsive design
  - History tracking (last 50 readings)

### Hardware Components
- **ESP32 DevKit v1** - Main controller with WiFi
- **DHT22** - Temperature & Humidity (GPIO 33)
- **MQ-2** - Gas sensor (GPIO 34 - ADC)
- **HC-SR04** - Ultrasonic distance (TRIG=13, ECHO=32)
- **L298N Motor Driver** - Dual DC motor control
- **DC Motors** - 2x for differential drive (GPIO 27,26,12,14)
- **Power Supply** - 12V for motors, 5V for ESP32

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   ESP32 Rover   │
│  (Autonomous)   │
│                 │
│ - DHT22 Sensor  │
│ - MQ-2 Sensor   │
│ - HC-SR04       │
│ - L298N Motors  │
└────────┬────────┘
         │ WiFi (ZORO)
         │ HTTPS POST
         ▼
┌─────────────────┐
│  Render Backend │
│  (Node.js/Express)
│                 │
│ - Receives data │
│ - Socket.IO     │
│ - REST APIs     │
└────────┬────────┘
         │ WebSocket
         │ Real-time
         ▼
┌─────────────────┐
│ Vercel Frontend │
│   (React.js)    │
│                 │
│ - Live Dashboard│
│ - Sensor Charts │
│ - Alert System  │
│ - Mobile UI     │
└─────────────────┘
```

---

## 💻 Technology Stack

### Embedded System
- **Microcontroller**: ESP32 (Dual-core, WiFi/BLE)
- **Programming**: Arduino C++ (ESP32 framework)
- **Libraries**: 
  - WiFi.h (Network connectivity)
  - HTTPClient.h (HTTP communication)
  - DHT.h (Temperature/Humidity)
  - Standard ESP32 GPIO libraries

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Hosting**: Render (Free tier)
- **Features**:
  - HTTP POST endpoint for ESP32
  - WebSocket broadcasting
  - In-memory data storage
  - Alert detection logic
  - CORS enabled

### Frontend
- **Framework**: React.js 18
- **Charting**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Styling**: Custom CSS (Mobile-first)
- **Hosting**: Vercel (Auto-deployment)
- **Features**:
  - Real-time Socket.IO client
  - Responsive grid layouts
  - Video background landing page
  - Live sensor graphs
  - Color-coded alerts

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: 
  - Vercel (Frontend auto-deploy)
  - Render (Backend auto-deploy)
- **Deployment**: Push to main → Auto-build → Live in 2 minutes

---

## 🎨 User Interface

### Landing Page
- **Hero Section**: Video background with project title
- **Objectives Grid**: 6 key goals (Safety, Climate, Detection, Quality, Autonomous, Real-time)
- **Features List**: 8 technical capabilities
- **System Architecture**: Visual flow diagram
- **Technical Specifications**: Hardware/Software/Operations
- **Team Members**: All 6 team members with IDs
- **Color Scheme**: #0D0D0D (Background), #00FFFF (Accent), #FF0000 (Alert), #FFFFFF (Text)

### Dashboard
- **Header**: Project title, connection status, last update time
- **Sensor Cards**: 4 large cards with live values
  - Temperature (°C) - Color-coded: Cold/Normal/Hot
  - Humidity (%) - Color-coded: Dry/Comfortable/Humid
  - Gas Level (ppm) - Color-coded: Safe/Warning/Danger
  - Distance (cm) - Color-coded: Clear/Warning/Danger
- **Live Graphs**: Real-time charts for Temp, Humidity, Gas
- **Alert Panel**: System alerts with severity levels
- **System Info**: Device ID, condition, connection status

---

## 📊 Data Flow

### ESP32 Autonomous Cycle

1. **Forward Movement** (2 seconds)
   - Both motors rotate forward
   - Rover moves straight ahead
   - Transitions to scan state

2. **Scanning Phase** (10 seconds)
   - Motors stop
   - Read sensors 5 times (every 2 seconds):
     - DHT22 → Temperature & Humidity
     - MQ-2 → Gas concentration (ppm)
     - HC-SR04 → Distance to obstacle (cm)
   - Send each reading via HTTPS POST to backend
   - Display readings on Serial Monitor

3. **Turn Right** (0.5 seconds)
   - Left motor forward, right motor backward
   - Rover pivots 45-90 degrees
   - Returns to forward movement

4. **Repeat** indefinitely

### Data Transmission

```json
// ESP32 sends this JSON every 2 seconds during scan:
{
  "temperature": 30.5,
  "humidity": 75.2,
  "gasLevel": 42,
  "distance": 125.3,
  "deviceId": "rover_001",
  "timestamp": 1234567890
}
```

**Backend processes:**
- Receives POST request
- Validates data
- Detects alerts (gas > 300ppm, distance < 30cm)
- Stores in history (max 100 records)
- Broadcasts via Socket.IO to all connected dashboards

**Dashboard receives:**
- Real-time WebSocket event: `sensorData`
- Updates all sensor cards instantly
- Adds data point to graphs
- Triggers alerts if thresholds exceeded
- Updates "Last update" timestamp

---

## ⚙️ Configuration

### WiFi Credentials (ESP32)
- Primary: `ZORO` / `zoro1111`
- Backup 1: `Santhosh SK` / `12345678`
- Backup 2: `Aadeesh` / `12312312`

### Pin Configuration (ESP32)
| Component | GPIO Pin | Type |
|-----------|----------|------|
| DHT22 Data | 33 | Digital Input |
| MQ-2 Analog | 34 | ADC (0-4095) |
| HC-SR04 TRIG | 13 | Digital Output |
| HC-SR04 ECHO | 32 | Digital Input |
| Motor IN1 (L-Fwd) | 27 | Digital Output |
| Motor IN2 (L-Back) | 26 | Digital Output |
| Motor IN3 (R-Fwd) | 12 | Digital Output |
| Motor IN4 (R-Back) | 14 | Digital Output |

### Thresholds & Alerts
| Parameter | Safe | Warning | Danger |
|-----------|------|---------|--------|
| Temperature | 15-35°C | <15°C or >35°C | <10°C or >40°C |
| Humidity | 30-70% | <30% or >70% | <20% or >80% |
| Gas Level | 0-150 ppm | 151-300 ppm | >300 ppm |
| Distance | >50 cm | 30-50 cm | <30 cm |

---

## 🌐 Deployment

### Production URLs
- **Frontend**: https://smart-tunnel-rover.vercel.app (or your custom URL)
- **Backend**: https://smart-tunnel-rover.onrender.com
- **GitHub**: https://github.com/Arun-py/smart-tunnel-rover

### Deployment Process
1. **Code Update**: Make changes locally
2. **Commit**: `git add . && git commit -m "message"`
3. **Push**: `git push origin main`
4. **Auto-Deploy**:
   - Vercel rebuilds frontend (1-2 minutes)
   - Render rebuilds backend (2-3 minutes)
5. **Live**: Changes automatically deployed

### Environment Variables
**Frontend** (`.env.production`):
```
REACT_APP_BACKEND_URL=https://smart-tunnel-rover.onrender.com
```

**Backend** (Set in Render dashboard):
```
PORT=5000
NODE_ENV=production
```

---

## 📱 Mobile Compatibility

### Responsive Breakpoints
- **Desktop**: > 768px (Full 4-column grid)
- **Tablet**: 768px (2-column grid)
- **Mobile**: < 768px (Single column stack)
- **Small Phone**: < 480px (Optimized text sizes)

### Mobile Features
- Touch-friendly buttons (larger tap targets)
- Stacked sensor cards (easy scrolling)
- Responsive graphs (auto-resize)
- Optimized video background
- Full-width navigation
- Reduced font sizes for readability

---

## 🔧 Hardware Assembly

### L298N Connections
```
L298N → DC Motors:
  OUT1 ────→ Left Motor +
  OUT2 ────→ Left Motor -
  OUT3 ────→ Right Motor +
  OUT4 ────→ Right Motor -

L298N → ESP32:
  IN1 ────→ GPIO 27
  IN2 ────→ GPIO 26
  IN3 ────→ GPIO 12
  IN4 ────→ GPIO 14
  
L298N → Power:
  12V ────→ 12V Battery +
  GND ────→ Battery -
  5V OUT ─→ ESP32 VIN (optional)
```

### Sensor Connections
```
DHT22:
  VCC ────→ ESP32 3.3V
  DATA ───→ GPIO 33
  GND ────→ ESP32 GND

MQ-2:
  VCC ────→ ESP32 5V
  AOUT ───→ GPIO 34 (ADC1_CH6)
  GND ────→ ESP32 GND

HC-SR04:
  VCC ────→ ESP32 5V
  TRIG ───→ GPIO 13
  ECHO ───→ GPIO 32
  GND ────→ ESP32 GND
```

---

## 📈 Performance Metrics

### Update Rates
- **Sensor Reading**: Every 2 seconds (during scan)
- **Data Transmission**: Every 2 seconds (5x per scan cycle)
- **Dashboard Update**: Instant (WebSocket push)
- **Graph Refresh**: Real-time (no page reload)

### Network Performance
- **WiFi Connection**: <5 seconds on startup
- **HTTP POST Latency**: ~200-500ms (ESP32 → Render)
- **WebSocket Latency**: <100ms (Render → Vercel)
- **Total Delay**: <1 second (sensor → dashboard)

### Power Consumption
- **ESP32**: ~240mA (WiFi active)
- **DHT22**: ~2.5mA
- **MQ-2**: ~150mA (heating element)
- **HC-SR04**: ~15mA (active)
- **Motors**: ~500mA each (1A total at full speed)
- **Total System**: ~1.5A @ 12V + 400mA @ 5V

### Operating Duration (with 12V 2000mAh battery)
- **Continuous Operation**: ~1.5-2 hours
- **With 5000mAh battery**: ~4-5 hours

---

## 🎓 Learning Outcomes

### Technical Skills Developed
1. **Embedded Systems**: ESP32 programming, GPIO control, sensor integration
2. **IoT Architecture**: Device-to-cloud communication, real-time data streaming
3. **Web Development**: React.js, Node.js, RESTful APIs, WebSockets
4. **DevOps**: Git, CI/CD, cloud deployment (Vercel, Render)
5. **Hardware Integration**: Motor control, sensor calibration, power management
6. **Data Visualization**: Real-time charting, responsive UI design

### Civil Engineering Applications
1. **Infrastructure Safety**: Continuous monitoring of underground structures
2. **Environmental Analysis**: Climate data for structural health assessment
3. **Hazard Detection**: Early warning system for gas leaks and fires
4. **Autonomous Inspection**: Reduces human exposure to dangerous environments
5. **Data-Driven Decisions**: Historical trends for maintenance planning

---

## 🚧 Future Enhancements

### Hardware Upgrades
- [ ] GPS module for location tracking
- [ ] Camera module for visual inspection
- [ ] CO2 sensor for air quality analysis
- [ ] Water leak detection sensor
- [ ] Battery level monitoring
- [ ] Solar panel integration

### Software Features
- [ ] Historical data export (CSV/PDF)
- [ ] Email/SMS alerts for critical events
- [ ] Machine learning for anomaly detection
- [ ] Multi-rover fleet management
- [ ] Voice alerts integration
- [ ] Scheduled inspection reports

### System Improvements
- [ ] Obstacle avoidance algorithm (currently ignored)
- [ ] Path planning with SLAM
- [ ] Return-to-base functionality
- [ ] Auto-calibration for sensors
- [ ] OTA (Over-The-Air) firmware updates
- [ ] Encrypted data transmission

---

## 🛠️ Troubleshooting

### ESP32 Issues
**Problem**: WiFi connection failed  
**Solution**: Verify SSID/password, check signal strength, try backup networks

**Problem**: Sensor reading NaN  
**Solution**: Check wiring, verify 3.3V/5V power, replace faulty sensor

**Problem**: HTTP POST timeout  
**Solution**: Check server URL, verify Render backend is running, test with curl

### Dashboard Issues
**Problem**: Shows "Disconnected"  
**Solution**: Refresh page, check backend at /api/health, verify WebSocket connection

**Problem**: No data updating  
**Solution**: Ensure ESP32 is powered on, check Serial Monitor for "✅ Data sent", verify backend logs

**Problem**: Graphs not showing  
**Solution**: Wait for first data points (needs 2+ readings), check browser console for errors

### Motor Issues
**Problem**: Motors not moving  
**Solution**: Check 12V power supply, verify L298N connections, test motor directly

**Problem**: One motor not working  
**Solution**: Check IN1-IN4 connections, verify GPIO pins, test L298N output with multimeter

---

## 📄 License & Usage

**Academic Project** - Civil Engineering Department, 2025

This project is developed for educational purposes as part of the Intelligent Transportation Systems curriculum. The code and documentation are open for reference and learning.

**Team Members** retain all rights to the implementation and documentation.

---

## 📞 Contact & Support

For questions or collaboration:
- **GitHub**: https://github.com/Arun-py/smart-tunnel-rover
- **Documentation**: See `DEPLOYMENT_GUIDE.md`, `HTTP_DIRECT_SETUP.md`
- **Issue Reporting**: GitHub Issues tab

---

## 🎉 Project Completion Status

✅ **Hardware**: ESP32 rover with sensors fully assembled  
✅ **Firmware**: Autonomous navigation with HTTP communication  
✅ **Backend**: Node.js server deployed on Render  
✅ **Frontend**: React dashboard deployed on Vercel  
✅ **Integration**: Real-time data flow from rover to dashboard  
✅ **Mobile UI**: Fully responsive design  
✅ **Documentation**: Complete setup and deployment guides  
✅ **Version Control**: GitHub repository with auto-deployment  

**Status**: PRODUCTION READY ✅

---

## 📊 Project Statistics

- **Total Lines of Code**: ~3,500+
- **Development Time**: Multiple iterations over project period
- **Files**: 68 files across Arduino, Backend, Frontend
- **Commits**: 15+ commits with auto-deployment
- **Team Size**: 6 members (Civil Engineering)
- **Technologies Used**: 12+ (ESP32, Node.js, React, Socket.IO, Chart.js, etc.)

---

**Smart Tunnel & Parking Safety Inspection Rover**  
*Autonomous. Real-time. Intelligent.*

Civil Engineering Department • 2025
