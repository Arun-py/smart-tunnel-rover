# 🔌 RoadScan Hardware Wiring Guide

## Component List

### Microcontroller
- **ESP32 DevKit** (30-pin version recommended)

### Motor Control
- **L298N Motor Driver Module**
- **4x DC Motors** (with 4WD chassis)
- **18650 Battery Pack** (2S, 7.4V-8.4V)

### Sensors
- **HC-SR04 Ultrasonic Sensor** (distance measurement)
- **FC-51 IR Proximity Sensor** (pothole detection)
- **DHT22 Temperature/Humidity Sensor**
- **SG90 Micro Servo Motor** (for scanner mounting)

### Miscellaneous
- Jumper wires (Male-to-Male, Male-to-Female)
- Breadboard (optional, for testing)
- USB cable (for ESP32 programming)
- Mounting brackets/chassis

---

## Complete Wiring Diagram

```
                    ╔═══════════════════════════════════════╗
                    ║         ROADSCAN WIRING DIAGRAM        ║
                    ╚═══════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│                         POWER DISTRIBUTION                          │
│                                                                     │
│  18650 Battery Pack (7.4V-8.4V)                                    │
│         │                                                           │
│         ├──(+)───┬─→ L298N [12V]                                   │
│         │        └─→ ESP32 [VIN]                                   │
│         │                                                           │
│         └──(-)───┬─→ L298N [GND]                                   │
│                  └─→ ESP32 [GND] ──→ Common Ground                 │
│                                                                     │
│  ⚠️  CRITICAL: All components must share common ground!            │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                       ESP32 PIN CONNECTIONS                         │
└─────────────────────────────────────────────────────────────────────┘

ESP32 DevKit (30-pin)
┌─────────────────────────────────────────────────┐
│                                                 │
│  3.3V  ●─────→ DHT22 VCC                       │
│         └────→ IR Sensor VCC                    │
│                                                 │
│  GND   ●─────→ All Sensors & Modules GND       │
│                                                 │
│  VIN   ●─────→ Battery (+) [7.4V]              │
│                                                 │
│  GPIO 4  ●───→ DHT22 Data                      │
│  GPIO 5  ●───→ L298N IN2                       │
│  GPIO 16 ●───→ L298N IN4                       │
│  GPIO 17 ●───→ L298N IN3                       │
│  GPIO 18 ●───→ L298N IN1                       │
│  GPIO 19 ●───→ L298N ENB (PWM)                 │
│  GPIO 21 ●───→ L298N ENA (PWM)                 │
│  GPIO 25 ●───→ HC-SR04 Echo                    │
│  GPIO 26 ●───→ HC-SR04 Trig                    │
│  GPIO 27 ●───→ SG90 Servo Signal               │
│  GPIO 32 ●───→ IR Sensor DO                    │
│                                                 │
│  5V    ●─────→ HC-SR04 VCC                     │
│         └────→ SG90 Servo VCC                   │
│                                                 │
└─────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    L298N MOTOR DRIVER WIRING                        │
└─────────────────────────────────────────────────────────────────────┘

L298N Motor Driver
┌──────────────────────────────────────┐
│                                      │
│  12V   ●───← Battery (+) 7.4V       │
│  GND   ●───← Battery (-) & ESP32 GND │
│  5V    ●───  (Remove jumper if >12V) │
│                                      │
│  ENA   ●───← ESP32 GPIO 21 (PWM)    │  Left Motors Speed
│  IN1   ●───← ESP32 GPIO 18          │
│  IN2   ●───← ESP32 GPIO 5           │
│                                      │
│  IN3   ●───← ESP32 GPIO 17          │
│  IN4   ●───← ESP32 GPIO 16          │
│  ENB   ●───← ESP32 GPIO 19 (PWM)    │  Right Motors Speed
│                                      │
│  OUT1  ●───→ Left Motor (+)         │
│  OUT2  ●───→ Left Motor (-)         │
│  OUT3  ●───→ Right Motor (+)        │
│  OUT4  ●───→ Right Motor (-)        │
│                                      │
└──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                        SENSOR CONNECTIONS                           │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────┐      ┌────────────────────┐
│   DHT22 Sensor     │      │  HC-SR04 Ultrasonic│
│                    │      │                    │
│  VCC  ●── 3.3V     │      │  VCC  ●── 5V       │
│  DATA ●── GPIO 4   │      │  TRIG ●── GPIO 26  │
│  GND  ●── GND      │      │  ECHO ●── GPIO 25  │
│                    │      │  GND  ●── GND      │
└────────────────────┘      └────────────────────┘

┌────────────────────┐      ┌────────────────────┐
│  IR Sensor (FC-51) │      │  SG90 Servo Motor  │
│                    │      │                    │
│  VCC  ●── 3.3V     │      │  VCC    ●── 5V     │
│  GND  ●── GND      │      │  Signal ●── GPIO 27│
│  DO   ●── GPIO 32  │      │  GND    ●── GND    │
│                    │      │                    │
│  ⚠️ Adjust pot for │      │  ⚠️ Mount ultrasonic│
│     sensitivity    │      │     on servo arm   │
└────────────────────┘      └────────────────────┘

```

---

## Pin Assignment Table

| Component | Pin | ESP32 GPIO | Voltage | Notes |
|-----------|-----|------------|---------|-------|
| **Power** |
| Battery + | VIN | - | 7.4-8.4V | From 2S Li-ion pack |
| Battery - | GND | - | 0V | Common ground |
| **Motors (via L298N)** |
| Motor ENA | ENA | GPIO 21 | PWM | Left motors speed |
| Motor IN1 | IN1 | GPIO 18 | 3.3V | Left forward |
| Motor IN2 | IN2 | GPIO 5 | 3.3V | Left backward |
| Motor IN3 | IN3 | GPIO 17 | 3.3V | Right forward |
| Motor IN4 | IN4 | GPIO 16 | 3.3V | Right backward |
| Motor ENB | ENB | GPIO 19 | PWM | Right motors speed |
| **Sensors** |
| DHT22 Data | DATA | GPIO 4 | 3.3V | Temperature/Humidity |
| Ultrasonic Trig | TRIG | GPIO 26 | 5V | Distance sensor |
| Ultrasonic Echo | ECHO | GPIO 25 | 5V | Distance sensor |
| Servo Signal | PWM | GPIO 27 | 5V | Scanner movement |
| IR Sensor | DO | GPIO 32 | 3.3V | Pothole detection |

---

## Physical Mounting Guide

### 1. Chassis Layout
```
        ┌─────────────────────────────────┐
        │                                 │
        │      [Ultrasonic on Servo]      │  Front
        │              ↓                  │
        │         ┌─────────┐             │
        │         │  ESP32  │             │
        │         └─────────┘             │
        │                                 │
        │  [L298N]          [Battery]     │
        │                                 │
        │  [DHT22]                        │
        │                                 │
        │  ●────────────────────●         │
        │  │                    │         │
        │  │  [IR Sensor ↓]     │         │
        │  │   1-2cm above      │         │
        │  │     ground         │         │
        │  ●────────────────────●         │
        └─────────────────────────────────┘
           Motor    Motor   Motor   Motor
```

### 2. Component Placement Tips

**ESP32:**
- Center of chassis for balanced weight
- Easy access to USB port for programming
- Protected from moving parts

**L298N:**
- Near motors to minimize wire length
- Good ventilation (heatsink can get warm)
- Secure mounting (vibration resistant)

**Battery Pack:**
- Low center of gravity
- Easy access for charging/replacement
- Secure with velcro or brackets

**Ultrasonic Sensor:**
- Mounted on servo at front
- 5-10cm above ground
- Facing forward (0°), can scan ±90°

**IR Sensor:**
- **CRITICAL:** 1-2cm above ground surface
- Facing straight down
- Centered between wheels
- Test on white surface (HIGH) and black (LOW)

**DHT22:**
- Away from motor driver heat
- Good air circulation
- Protected from direct sunlight

---

## Wiring Best Practices

### Color Coding (Recommended)
- **Red:** Power (+) connections
- **Black:** Ground (-) connections
- **Yellow/Orange:** Signal/PWM lines
- **Green/Blue:** Sensor data lines

### Wire Management
1. ✅ Use cable ties to bundle similar wires
2. ✅ Keep power wires separate from signal wires
3. ✅ Leave some slack for moving parts (servo)
4. ✅ Label connections (masking tape + marker)
5. ✅ Secure wires away from wheels and motors

### Safety Checks
- [ ] All grounds connected together (multimeter continuity test)
- [ ] No shorts between power and ground (multimeter resistance >1kΩ)
- [ ] Battery polarity correct (+ to VIN, - to GND)
- [ ] No loose connections
- [ ] Wires away from moving parts
- [ ] Heatsink on L298N has clearance

---

## Power Consumption Estimates

| Component | Voltage | Current | Notes |
|-----------|---------|---------|-------|
| ESP32 | 3.3V | ~240mA | WiFi active |
| 4x DC Motors | 7.4V | 200-800mA each | Load dependent |
| SG90 Servo | 5V | 100-500mA | Moving |
| HC-SR04 | 5V | 15mA | Pulsing |
| DHT22 | 3.3V | 2.5mA | Reading |
| IR Sensor | 3.3V | 20mA | Continuous |
| L298N Logic | 5V | 36mA | - |

**Total (worst case):** ~4A @ 7.4V  
**Recommended Battery:** 2S Li-ion (18650) with 2000-3000mAh capacity  
**Expected Runtime:** 30-60 minutes continuous operation

---

## Testing Procedure

### 1. Test Without Motors (Safe Mode)
```cpp
// In setup(), comment out motor initialization
// pinMode(MOTOR_LEFT_IN1, OUTPUT); // COMMENT OUT
// Test sensors only first
```

### 2. Individual Component Tests

**Power Test:**
```
1. Connect battery (motors disconnected)
2. Measure ESP32 VIN pin: should be 7.4-8.4V
3. Measure ESP32 3.3V pin: should be 3.3V
4. Measure ESP32 5V pin: should be 5V
```

**DHT22 Test:**
```cpp
Serial.print("Temp: "); Serial.println(temperature);
Serial.print("Humidity: "); Serial.println(humidity);
// Should show room temperature (~20-30°C) and humidity (~40-70%)
```

**Ultrasonic Test:**
```cpp
Serial.print("Distance: "); Serial.println(distanceCM);
// Move hand in front, distance should change
```

**Servo Test:**
```cpp
scannerServo.write(0);   // Should turn left
delay(1000);
scannerServo.write(180); // Should turn right
```

**IR Sensor Test:**
```cpp
Serial.print("IR: "); Serial.println(digitalRead(IR_SENSOR_PIN));
// Normal surface: HIGH (1)
// Black paper: LOW (0)
```

**Motor Test:**
```cpp
moveForward(150);  // Motors should spin forward
delay(2000);
stopMotors();      // Motors should stop
```

### 3. Full System Test
1. Upload complete code
2. Power on system
3. Check Serial Monitor for WiFi connection
4. Verify sensor readings
5. Test autonomous navigation
6. Confirm data transmission to server

---

## Troubleshooting

### Motors Not Moving
- Check L298N power (12V pin has voltage)
- Verify ENA/ENB connections (or jumpers)
- Test motor outputs with multimeter
- Check IN1-IN4 logic signals

### Sensor Readings Wrong
- **DHT22 NaN:** Check data pin, ensure 3.3V power
- **Ultrasonic 0cm:** Check 5V power, TRIG/ECHO pins
- **IR always HIGH/LOW:** Adjust sensitivity potentiometer
- **Servo not moving:** Check 5V power, signal pin

### ESP32 Rebooting
- Insufficient power supply (battery too weak)
- Short circuit (check all connections)
- WiFi causing brownout (add capacitor 100µF across VIN-GND)

### Erratic Behavior
- Poor ground connection (ensure common ground)
- EMI from motors (add 0.1µF capacitors across motor terminals)
- Loose connections (secure all jumper wires)

---

## Advanced Modifications

### Add GPS Module (NEO-6M)
```
GPS TX  → ESP32 GPIO 16 (RX2)
GPS RX  → ESP32 GPIO 17 (TX2)
GPS VCC → ESP32 3.3V
GPS GND → ESP32 GND
```

### Add Camera (ESP32-CAM)
- Use separate ESP32-CAM module
- Communicate via Serial or WiFi
- Stream video to dashboard

### Add Battery Monitor
```
Battery + → Voltage Divider → ESP32 GPIO 34 (ADC)
(Use 10kΩ + 10kΩ resistor divider)
```

---

## Maintenance Checklist

**Before Each Use:**
- [ ] Check battery charge level
- [ ] Verify all connections tight
- [ ] Clean sensors (especially IR and ultrasonic)
- [ ] Check wheels and motors for debris

**Weekly:**
- [ ] Recharge batteries fully
- [ ] Check for loose screws
- [ ] Clean chassis
- [ ] Test all sensors

**Monthly:**
- [ ] Check wire insulation
- [ ] Clean motor brushes (if applicable)
- [ ] Test emergency stop
- [ ] Backup data from MongoDB

---

## Safety Warnings

⚠️ **IMPORTANT SAFETY NOTES:**

1. **Never** connect 12V directly to ESP32 pins (only to VIN)
2. **Always** use common ground for all components
3. **Never** short battery terminals
4. **Always** disconnect battery when modifying wiring
5. **Never** run motors without load (can overspeed)
6. **Always** test in controlled environment first
7. **Never** leave charging batteries unattended
8. **Always** have emergency stop mechanism

---

## Bill of Materials (BOM)

| Item | Quantity | Est. Cost (USD) |
|------|----------|-----------------|
| ESP32 DevKit | 1 | $8-12 |
| L298N Motor Driver | 1 | $3-5 |
| 4WD Chassis Kit | 1 | $15-25 |
| HC-SR04 Ultrasonic | 1 | $2-3 |
| FC-51 IR Sensor | 1 | $1-2 |
| DHT22 Sensor | 1 | $3-5 |
| SG90 Servo | 1 | $2-3 |
| 18650 Batteries (2x) | 2 | $10-15 |
| Battery Holder 2S | 1 | $2-3 |
| Jumper Wires Set | 1 | $3-5 |
| USB Cable | 1 | $2-3 |
| **Total** | | **~$50-80** |

---

**Document Version:** 1.0  
**Last Updated:** 2025  
**Author:** RoadScan Project Team
