# 🚗 Smart Tunnel and Parking Safety Inspection Rover

**Using IoT and Environmental Sensors for Intelligent Transportation Systems (ITS)**

An RC-controlled mobile inspection rover equipped with environmental sensors (DHT22, MQ-2, ultrasonic) that transmits real-time data via Firebase to a Node.js backend and React dashboard for tunnel and underground parking safety monitoring.

## 📋 Project Overview

The **Smart Tunnel Inspection Rover** enhances transportation safety through:
- 🎮 **RC Control** - Manual navigation in hazardous environments
- ☁️ **Gas Detection** - MQ-2 sensor for LPG, smoke, and methane (0-1000 ppm)
- 🌡️ **Environmental Monitoring** - DHT22 temperature (-40 to 80°C) and humidity (0-100%)
- 📏 **Obstacle Detection** - HC-SR04 ultrasonic sensor (2cm to 400cm)
- 📡 **IoT Connectivity** - ESP32 + Firebase Realtime Database
- 📊 **Real-time Dashboard** - React web interface with Socket.IO

## 🏗️ System Architecture

```
Arduino UNO (RC + Motors + Ultrasonic)
         ↕ Serial (UART)
ESP32 (WiFi + DHT22 + MQ-2)
         ↓ WiFi/HTTPS
Firebase Realtime Database
         ↓ Admin SDK
Node.js Firebase Bridge → MongoDB
         ↓ Socket.IO
React Dashboard (Browser)
```

## 🛠️ Hardware Components

### Microcontrollers
- **Arduino UNO R3** - RC receiver, motor control, ultrasonic sensor
- **ESP32 DevKit** - WiFi/IoT, DHT22, MQ-2, serial communication

### Sensors
- **DHT22** - Temperature & humidity sensor
- **MQ-2** - Gas sensor (LPG, smoke, methane)
- **HC-SR04** - Ultrasonic distance sensor

### Actuators & Control
- **L298N** - Dual H-bridge motor driver
- **4x DC Motors** - 6V-12V geared motors
- **RC Transmitter & Receiver** - 2.4GHz, 2+ channel

### Power Supply
- **7.4V LiPo Battery** - For motors (2000mAh)
- **5V USB Power Bank** - For Arduino/ESP32 logic

## 📂 Project Structure

```
RoadScan/
├── arduino/                      # Embedded firmware
│   ├── arduino_uno_rc_rover/     # Arduino UNO code (RC, motors, ultrasonic)
│   │   └── arduino_uno_rc_rover.ino
│   └── esp32_firebase_rover/     # ESP32 code (WiFi, Firebase, sensors)
│       └── esp32_firebase_rover.ino
├── backend/                      # Node.js server
│   ├── src/
│   │   ├── server.js             # Express + Socket.IO server
│   │   ├── firebase-bridge.js    # Firebase → MongoDB bridge
│   │   ├── models/index.js       # MongoDB schemas
│   │   └── config/database.js
│   ├── package.json
│   └── firebase-service-account.json  # (Download from Firebase)
├── frontend/                     # React dashboard
│   ├── src/
│   │   ├── App.js
│   │   └── components/
│   │       ├── LandingPage.js    # Project information page
│   │       ├── SensorCard.js     # Sensor data widgets
│   │       └── TemperatureChart.js
│   ├── build/                    # Production bundle
│   └── package.json
├── FIREBASE_SETUP_GUIDE.md       # Firebase configuration guide
├── HARDWARE_WIRING_GUIDE.md      # Complete wiring diagrams
├── IMPLEMENTATION_GUIDE.md       # Step-by-step setup
└── PROJECT_SUMMARY.md            # Project overview
```

## 🚀 Quick Start

### 1. ESP32 Setup
```bash
# Install Arduino IDE
# Install ESP32 board support
# Install libraries: WiFi, DHT, Servo, HTTPClient, ArduinoJson
# Upload arduino/roadscan_esp32/roadscan_esp32.ino
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env file with MongoDB URI
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔌 Pin Connections

| Component | ESP32 Pin |
|-----------|-----------|
| DHT22 Data | GPIO 4 |
| Ultrasonic Trig | GPIO 26 |
| Ultrasonic Echo | GPIO 25 |
| Servo Signal | GPIO 27 |
| IR Sensor DO | GPIO 32 |
| Motor IN1 | GPIO 18 |
| Motor IN2 | GPIO 5 |
| Motor IN3 | GPIO 17 |
| Motor IN4 | GPIO 16 |
| Motor ENA | GPIO 21 |
| Motor ENB | GPIO 19 |

## 📊 Features

### Vehicle Features
- ✅ Autonomous navigation with obstacle avoidance
- ✅ 180° scanning with servo-mounted ultrasonic
- ✅ Real-time pothole detection
- ✅ Environmental data logging
- ✅ WiFi connectivity with auto-reconnect

### Dashboard Features
- ✅ Real-time sensor data visualization
- ✅ Interactive hazard map with markers
- ✅ Event logging and history
- ✅ Temperature & humidity gauges
- ✅ Vehicle status indicators
- ✅ Historical data charts
- ✅ Alert notifications

## 🔧 Technologies Used

### Hardware
- ESP32, L298N, HC-SR04, FC-51, DHT22, SG90

### Firmware
- Arduino C++, ArduinoJson, DHT Library

### Backend
- Node.js, Express.js, MongoDB, Socket.IO, Mongoose

### Frontend
- React.js, Socket.IO Client, Chart.js, Leaflet.js

## 📱 API Endpoints

- `POST /api/sensor-data` - Receive sensor data from ESP32
- `GET /api/sensor-data/latest` - Get latest readings
- `GET /api/hazards` - Get all detected hazards
- `GET /api/analytics` - Get statistics and trends

## 🎯 Future Enhancements

- [ ] GPS integration for accurate location tracking
- [ ] Machine Learning for advanced defect classification
- [ ] Multi-vehicle fleet management
- [ ] Mobile app (React Native)
- [ ] Alert system (Email/SMS)
- [ ] Predictive maintenance algorithms

## 👥 Contributors

Your Name - ITS Project

## 📄 License

MIT License
