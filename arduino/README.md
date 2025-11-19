# ESP32 Arduino Setup Guide

## Prerequisites

### Software
- Arduino IDE (v1.8.19 or higher) or Arduino IDE 2.0
- USB cable for ESP32

### Hardware Components
- ESP32 DevKit board
- L298N motor driver
- 4WD chassis with DC motors
- HC-SR04 ultrasonic sensor
- FC-51 IR sensor
- DHT22 temperature/humidity sensor
- SG90 servo motor
- 18650 battery pack (7.4V-9V)
- Jumper wires

## Arduino IDE Setup

### 1. Install ESP32 Board Support

1. Open Arduino IDE
2. Go to **File → Preferences**
3. In "Additional Board Manager URLs", add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools → Board → Boards Manager**
5. Search for "ESP32"
6. Install "ESP32 by Espressif Systems"

### 2. Install Required Libraries

Go to **Sketch → Include Library → Manage Libraries** and install:

1. **DHT sensor library** by Adafruit
2. **Adafruit Unified Sensor** (dependency for DHT)
3. **ArduinoJson** by Benoit Blanchon
4. **ESP32Servo** by Kevin Harrington

Built-in libraries (no installation needed):
- WiFi
- HTTPClient

### 3. Configure Board Settings

1. Connect ESP32 to computer via USB
2. Go to **Tools** menu:
   - **Board**: Select "ESP32 Dev Module" or your specific ESP32 board
   - **Upload Speed**: 115200
   - **CPU Frequency**: 240MHz
   - **Flash Frequency**: 80MHz
   - **Flash Mode**: QIO
   - **Flash Size**: 4MB
   - **Port**: Select the COM port where ESP32 is connected

## Configuration

### 1. Edit WiFi Credentials

Open `roadscan_esp32.ino` and modify:

```cpp
const char* ssid = "YOUR_WIFI_SSID";           // Your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Your WiFi password
```

### 2. Set Backend Server URL

Find your computer's IP address:

**Windows (PowerShell):**
```powershell
ipconfig
# Look for IPv4 Address under your WiFi adapter
```

Then update in code:
```cpp
const char* serverUrl = "http://192.168.1.100:5000/api/sensor-data";
// Replace 192.168.1.100 with your computer's IP
```

**Note:** Don't use `localhost` - use your actual IP address!

## Hardware Connections

### Power Connections
```
Battery (+) → L298N [12V] pin
Battery (+) → ESP32 [VIN] pin
Battery (-) → L298N [GND] pin
Battery (-) → ESP32 [GND] pin

⚠️ CRITICAL: Common ground between all components!
```

### Motor Driver (L298N)
```
L298N [ENA] → ESP32 GPIO 21
L298N [ENB] → ESP32 GPIO 19
L298N [IN1] → ESP32 GPIO 18 (Left motors)
L298N [IN2] → ESP32 GPIO 5  (Left motors)
L298N [IN3] → ESP32 GPIO 17 (Right motors)
L298N [IN4] → ESP32 GPIO 16 (Right motors)
```

### Sensors
```
DHT22 [VCC]  → ESP32 3.3V
DHT22 [DATA] → ESP32 GPIO 4
DHT22 [GND]  → ESP32 GND

HC-SR04 [VCC]  → ESP32 5V
HC-SR04 [TRIG] → ESP32 GPIO 26
HC-SR04 [ECHO] → ESP32 GPIO 25
HC-SR04 [GND]  → ESP32 GND

SG90 Servo [VCC]    → ESP32 5V
SG90 Servo [SIGNAL] → ESP32 GPIO 27
SG90 Servo [GND]    → ESP32 GND

IR Sensor [VCC] → ESP32 3.3V
IR Sensor [DO]  → ESP32 GPIO 32
IR Sensor [GND] → ESP32 GND
```

## Upload Process

### 1. Verify Code
Click the **Verify** button (✓) to check for errors

### 2. Upload to ESP32
1. Click the **Upload** button (→)
2. Wait for compilation
3. ESP32 may enter bootloader mode automatically
4. If not, hold **BOOT** button on ESP32 during upload

### 3. Monitor Serial Output
1. Open **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   - WiFi connection status
   - ESP32 IP address
   - Sensor readings
   - Data transmission status

## IR Sensor Calibration

The IR sensor needs calibration for pothole detection:

1. Mount IR sensor **1-2 cm** above the ground, facing downward
2. Adjust the potentiometer on the sensor:
   - Turn clockwise to increase sensitivity
   - Turn counter-clockwise to decrease sensitivity
3. Test with black paper (simulates pothole):
   - Place black paper under sensor
   - Sensor LED should turn ON
   - Serial monitor should show "POTHOLE DETECTED"
4. Normal surface should keep LED OFF

## Troubleshooting

### WiFi Won't Connect
- Check SSID and password
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Move closer to router
- Check firewall settings

### Upload Failed
- Check correct COM port selected
- Press and hold BOOT button during upload
- Try different USB cable
- Reduce upload speed to 921600 or 460800

### Sensor Not Working
- Check wiring connections
- Verify pin numbers in code match physical connections
- Test with simple sensor example code
- Check if sensor has power (3.3V or 5V as required)

### Motors Not Moving
- Check L298N power supply (7-12V)
- Verify motor connections to L298N outputs
- Check if ENA/ENB are HIGH or receiving PWM
- Test motors directly with L298N

### Data Not Sending to Server
- Verify backend server is running
- Check serverUrl has correct IP address
- Use IP address, not localhost
- Ensure ESP32 and computer on same network
- Check firewall isn't blocking port 5000

## Testing Without Backend

Comment out or modify the `sendDataToServer()` function to just print to Serial:

```cpp
void sendDataToServer() {
  Serial.println("--- Sensor Data ---");
  Serial.print("Temp: "); Serial.println(temperature);
  Serial.print("Humidity: "); Serial.println(humidity);
  Serial.print("Distance: "); Serial.println(distanceCM);
  Serial.println("-------------------\n");
}
```

## Pin Reference Table

| Component | Pin Type | ESP32 GPIO | Notes |
|-----------|----------|------------|-------|
| DHT22 Data | Digital | 4 | 3.3V power |
| Ultrasonic Trig | Digital | 26 | 5V power |
| Ultrasonic Echo | Digital | 25 | 5V power |
| Servo Signal | PWM | 27 | 5V power |
| IR Sensor DO | Digital | 32 | 3.3V power |
| Motor IN1 | Digital | 18 | - |
| Motor IN2 | Digital | 5 | - |
| Motor IN3 | Digital | 17 | - |
| Motor IN4 | Digital | 16 | - |
| Motor ENA | PWM | 21 | Speed control |
| Motor ENB | PWM | 19 | Speed control |

## Safety Notes

⚠️ **Important Safety Guidelines:**
- Never connect ESP32 directly to 12V (use VIN pin with 7-9V max)
- Always use common ground for all components
- Double-check polarity before powering on
- Use appropriate wire gauge for motor currents
- Ensure battery pack has protection circuit
- Test sensors individually before full assembly
- Keep moving parts away from loose wires
