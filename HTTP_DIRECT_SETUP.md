# HTTP Direct Mode Setup Guide
## No Firebase Required! ✅

## Quick Start

### 1. Backend Server Setup
Your server is already running at `http://10.33.64.133:5000`

The ESP32 will send data to: `http://10.33.64.133:5000/api/sensor-data`

### 2. ESP32 Code Update
**Location:** `arduino/esp32_http_rover/esp32_http_rover.ino`

**IMPORTANT:** Update line 18 with your computer's IP address:
```cpp
const char* SERVER_URL = "http://10.33.64.133:5000/api/sensor-data";
```

To find your IP address:
- Open Command Prompt
- Type: `ipconfig`
- Look for "IPv4 Address" (usually 192.168.x.x or 10.x.x.x)

### 3. Upload ESP32 Code
1. Open Arduino IDE
2. File → Open → `esp32_http_rover.ino`
3. Select Board: ESP32 Dev Module
4. Select Port: Your ESP32 COM port
5. Click Upload ⬆️

### 4. Monitor ESP32
- Open Serial Monitor (Ctrl+Shift+M)
- Set baud rate: 115200
- You should see:
  ```
  === Smart Tunnel Inspection Rover ===
  ✓ WiFi connected!
  IP Address: xxx.xxx.xxx.xxx
  Server: http://10.33.64.133:5000/api/sensor-data
  
  📡 Scanning... (1/5)
  📊 Sensor Data:
    Temp: 30.1°C
    Humidity: 62.8%
    Gas: 0 ppm
    Distance: 55.9 cm
  ✓ Data sent to server
  ```

### 5. View Dashboard
Open browser: `http://localhost:3000`

You should see real-time sensor data updating every 2 seconds!

## How It Works

```
ESP32 Rover
    ↓ (WiFi - HTTP POST every 2 seconds)
Your Computer (Backend Server at :5000)
    ↓ (WebSocket - Real-time broadcast)
Dashboard (React at :3000)
```

## Autonomous Movement Pattern

1. **Move Forward** - 2 seconds
2. **Scan & Send Data** - 10 seconds (5 readings at 2-second intervals)
3. **Turn Right** - 0.5 seconds
4. **Repeat** ♻️

This creates a circular inspection pattern!

## Troubleshooting

### ESP32 can't connect to WiFi
- Check WiFi credentials in code (lines 12-13)
- Try each network: ZORO, Santhosh SK, or Aadeesh

### ESP32 can't send data to server
- Verify SERVER_URL has correct IP address
- Make sure ESP32 and computer are on same WiFi network
- Check if backend server is running (should show "Waiting for ESP32 data...")

### Dashboard not updating
- Check browser console (F12)
- Should see "✓ Connected to server"
- If not, restart backend server

### Motors not moving
- Check L298N connections: IN1=27, IN2=26, IN3=12, IN4=14
- Ensure ENA/ENB jumpers are ON (for full speed)
- Check motor power supply (separate from ESP32)

## API Endpoints

- `POST /api/sensor-data` - ESP32 sends data here
- `GET /api/sensors` - Get latest reading
- `GET /api/sensors/history?limit=50` - Get history
- `GET /api/analytics` - Get statistics
- `GET /api/health` - Check server status

## Next Steps

1. ✅ Upload ESP32 code with correct SERVER_URL
2. ✅ Power on rover and ESP32
3. ✅ Watch Serial Monitor for "✓ Data sent to server"
4. ✅ Refresh dashboard to see live data!

---
**No Firebase, No MongoDB, No Complexity - Just HTTP! 🚀**
