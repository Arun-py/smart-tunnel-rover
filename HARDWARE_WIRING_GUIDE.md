# Hardware Wiring Guide
## Smart Tunnel and Parking Safety Inspection Rover

Complete wiring diagram and assembly instructions for the RC-controlled IoT rover.

---

## Components List

### Microcontrollers
- **1x Arduino UNO** (motor control & RC receiver)
- **1x ESP32 DevKit** (WiFi/IoT & sensors)

### Sensors
- **1x DHT22** - Temperature & Humidity Sensor
- **1x MQ-2** - Gas Sensor (LPG, Smoke, Methane)
- **1x HC-SR04** - Ultrasonic Distance Sensor

### Motor Driver & Motors
- **1x L298N Motor Driver Module**
- **4x DC Motors** (6V-12V geared motors recommended)
- **1x Chassis with 4 wheels**

### RC Control
- **1x RC Receiver** (2+ channel, 2.4GHz recommended)
- **1x RC Transmitter** (2+ channel)

### Power Supply
- **2x 7.4V LiPo batteries** (or 2x 18650 battery packs)
  - Battery 1: 7.4V 2000mAh for motors (L298N input)
  - Battery 2: 5V USB power bank for Arduino/ESP32
- **1x 5V voltage regulator** (if using single battery)

### Miscellaneous
- **Breadboard or perfboard**
- **Jumper wires** (Male-Male, Male-Female)
- **USB cable** (for programming Arduino/ESP32)
- **Screws & standoffs** (for mounting components)

---

## Pin Connections

### Arduino UNO Pin Mapping

| Component        | Pin Number | Arduino Pin | Description              |
|------------------|------------|-------------|--------------------------|
| **RC Receiver**  |            |             |                          |
| CH1 (Steering)   | 1          | D11         | RC channel 1 (Turn)      |
| CH2 (Throttle)   | 2          | D12         | RC channel 2 (Speed)     |
| VCC              | 3          | 5V          | Power supply             |
| GND              | 4          | GND         | Ground                   |
| **L298N Driver** |            |             |                          |
| ENA (Motor A)    | 5          | D2          | PWM speed control (A)    |
| IN1 (Motor A)    | 6          | D3          | Direction control (A+)   |
| IN2 (Motor A)    | 7          | D4          | Direction control (A-)   |
| IN3 (Motor B)    | 8          | D5          | Direction control (B+)   |
| IN4 (Motor B)    | 9          | D6          | Direction control (B-)   |
| ENB (Motor B)    | 10         | D7          | PWM speed control (B)    |
| **HC-SR04**      |            |             |                          |
| TRIG             | 11         | D9          | Trigger ultrasonic pulse |
| ECHO             | 12         | D10         | Receive echo signal      |
| VCC              | 13         | 5V          | Power supply             |
| GND              | 14         | GND         | Ground                   |
| **ESP32 Serial** |            |             |                          |
| TX (to ESP RX2)  | 15         | D1 (TX)     | Serial communication     |
| RX (from ESP TX2)| 16         | D0 (RX)     | Serial communication     |

---

### ESP32 DevKit Pin Mapping

| Component        | Pin Number | ESP32 Pin   | Description              |
|------------------|------------|-------------|--------------------------|
| **DHT22 Sensor** |            |             |                          |
| DATA             | 1          | GPIO 4      | Digital data signal      |
| VCC              | 2          | 3.3V        | Power supply             |
| GND              | 3          | GND         | Ground                   |
| **MQ-2 Sensor**  |            |             |                          |
| AOUT (Analog)    | 4          | GPIO 34     | Analog gas reading       |
| DOUT (Digital)   | 5          | (Not used)  | Optional digital trigger |
| VCC              | 6          | 5V          | Power supply (5V!)       |
| GND              | 7          | GND         | Ground                   |
| **Arduino Serial**|           |             |                          |
| RX2 (from Uno TX)| 8          | GPIO 16     | Receive from Arduino     |
| TX2 (to Uno RX)  | 9          | GPIO 17     | Send to Arduino          |

**Important Notes:**
- DHT22 runs on **3.3V** (ESP32's output voltage)
- MQ-2 requires **5V** for accurate readings (use ESP32's VIN pin if powered via USB)
- ESP32 GPIO 34 is **input-only** (perfect for analog sensors)

---

## Detailed Wiring Diagram

### Section 1: Arduino UNO ↔ RC Receiver

```
RC Receiver                  Arduino UNO
┌──────────────┐            ┌──────────────┐
│ CH1 (Signal) ├────────────┤ D11          │
│ CH2 (Signal) ├────────────┤ D12          │
│ VCC (+5V)    ├────────────┤ 5V           │
│ GND          ├────────────┤ GND          │
└──────────────┘            └──────────────┘
```

**Color Coding (typical):**
- Signal: White/Yellow
- VCC: Red
- GND: Black/Brown

---

### Section 2: Arduino UNO ↔ L298N Motor Driver

```
L298N Motor Driver          Arduino UNO
┌──────────────┐            ┌──────────────┐
│ ENA          ├────────────┤ D2 (PWM)     │
│ IN1          ├────────────┤ D3           │
│ IN2          ├────────────┤ D4           │
│ IN3          ├────────────┤ D5           │
│ IN4          ├────────────┤ D6           │
│ ENB          ├────────────┤ D7 (PWM)     │
│ GND          ├────────────┤ GND          │
└──────────────┘            └──────────────┘

L298N Motor Outputs         DC Motors
┌──────────────┐            
│ OUT1         ├────────────┤ Motor A+ (Left Front)
│ OUT2         ├────────────┤ Motor A- (Left Front)
│ OUT3         ├────────────┤ Motor B+ (Right Front)
│ OUT4         ├────────────┤ Motor B- (Right Front)
└──────────────┘

L298N Power Input           Battery 1 (7.4V)
┌──────────────┐            ┌──────────────┐
│ +12V         ├────────────┤ + (Positive) │
│ GND          ├────────────┤ - (Negative) │
└──────────────┘            └──────────────┘
```

**L298N Jumper Configuration:**
- **Keep the 5V jumper ON** if using 7.4V-12V input (L298N regulates to 5V for Arduino)
- **Remove 5V jumper** if using separate 5V supply for Arduino

---

### Section 3: Arduino UNO ↔ HC-SR04 Ultrasonic

```
HC-SR04 Sensor              Arduino UNO
┌──────────────┐            ┌──────────────┐
│ TRIG         ├────────────┤ D9           │
│ ECHO         ├────────────┤ D10          │
│ VCC          ├────────────┤ 5V           │
│ GND          ├────────────┤ GND          │
└──────────────┘            └──────────────┘
```

**Mounting:** Place sensor at front of rover, facing forward, ~5cm above ground.

---

### Section 4: ESP32 ↔ DHT22 Sensor

```
DHT22 Sensor                ESP32 DevKit
┌──────────────┐            ┌──────────────┐
│ DATA (Pin 2) ├────────────┤ GPIO 4       │
│ VCC (Pin 1)  ├────────────┤ 3.3V         │
│ GND (Pin 4)  ├────────────┤ GND          │
└──────────────┘            └──────────────┘
```

**Note:** DHT22 has 4 pins, but Pin 3 (NC) is not connected. Some modules have only 3 pins (VCC, DATA, GND).

**Pull-up Resistor:** Most DHT22 modules have built-in 10kΩ pull-up resistor. If not, add 10kΩ resistor between DATA and VCC.

---

### Section 5: ESP32 ↔ MQ-2 Gas Sensor

```
MQ-2 Sensor Module          ESP32 DevKit
┌──────────────┐            ┌──────────────┐
│ AOUT         ├────────────┤ GPIO 34 (ADC)│
│ VCC          ├────────────┤ VIN (5V)     │
│ GND          ├────────────┤ GND          │
└──────────────┘            └──────────────┘
```

**Important:**
- MQ-2 requires **5V** for heater element
- Use ESP32's **VIN pin** (not 3.3V!) when powered via USB (5V)
- If using battery, use 5V regulator output
- **Pre-heat time:** MQ-2 needs 24-48 hours of continuous power for accurate calibration

---

### Section 6: Arduino UNO ↔ ESP32 Serial Communication

```
Arduino UNO                 ESP32 DevKit
┌──────────────┐            ┌──────────────┐
│ D1 (TX)      ├────────────┤ GPIO 16 (RX2)│
│ D0 (RX)      ├────────────┤ GPIO 17 (TX2)│
│ GND          ├────────────┤ GND          │
└──────────────┘            └──────────────┘
```

**Important:**
- Arduino TX → ESP32 RX2 (transmit to receive)
- Arduino RX → ESP32 TX2 (receive from transmit)
- **Shared GND** is essential for serial communication
- Use **3.3V logic level shifter** if experiencing communication errors (Arduino is 5V, ESP32 is 3.3V)

**Note:** If Arduino pins D0/D1 interfere with USB programming, use SoftwareSerial library on different pins (e.g., D8, D13).

---

## Power Supply Configuration

### Option 1: Dual Battery Setup (Recommended)

```
Battery 1 (7.4V 2000mAh LiPo)
    ├──> L298N (12V input)
    │       └──> 5V regulator output ──> Arduino UNO VIN
    └──> (Motors only)

Battery 2 (5V USB Power Bank)
    ├──> Arduino UNO (USB or VIN with 5V regulator)
    └──> ESP32 (VIN pin or USB)
```

**Advantages:**
- Isolated power for logic (Arduino/ESP32) and motors
- Prevents voltage drops from motors affecting microcontrollers
- Safer for sensitive electronics

---

### Option 2: Single Battery with Regulators

```
Battery (11.1V 3000mAh LiPo)
    ├──> L298N (12V input) ──> Motors
    ├──> 7805 Regulator (5V) ──> Arduino UNO VIN
    └──> LM2596 Buck Converter (5V) ──> ESP32 VIN
```

**Advantages:**
- Single battery to manage
- Lighter weight

**Disadvantages:**
- Requires additional voltage regulators
- More complex wiring

---

## Motor Configuration

### 4-Wheel Drive Layout

```
       FRONT
┌────────────────┐
│  M1        M2  │  M1 = OUT1/OUT2 (Left Front)
│                │  M2 = OUT3/OUT4 (Right Front)
│                │  M3 = OUT1/OUT2 (Left Rear, parallel to M1)
│  M3        M4  │  M4 = OUT3/OUT4 (Right Rear, parallel to M2)
└────────────────┘
       REAR
```

**Wiring:**
- **Left side:** M1 and M3 in parallel → L298N OUT1/OUT2
- **Right side:** M2 and M4 in parallel → L298N OUT3/OUT4

**Differential Steering:**
- **Forward:** Both sides forward at same speed
- **Turn Left:** Left side slower, right side faster (or left reverse, right forward for sharp turn)
- **Turn Right:** Right side slower, left side faster
- **Reverse:** Both sides backward

---

## Assembly Steps

### Step 1: Mount Components on Chassis

1. **Arduino UNO:** Center of chassis, accessible for programming
2. **ESP32:** Next to Arduino, near front for WiFi antenna
3. **L298N:** Near motors, rear of chassis
4. **Breadboard:** Between Arduino and ESP32 for sensor connections
5. **Batteries:** Low and centered for stability
6. **RC Receiver:** Top of chassis, antenna vertical

---

### Step 2: Mount Sensors

1. **HC-SR04:** Front of chassis, ~5cm high, facing forward
   - Use mounting bracket or hot glue
   - Keep TRIG and ECHO sensors clear of obstructions

2. **DHT22:** Side of chassis, exposed to airflow
   - Avoid placing near motors (heat source)
   - Not directly above battery (heat)

3. **MQ-2:** Front-center, exposed to air
   - **Critical:** Must have airflow for accurate readings
   - Place away from exhaust or motor heat
   - Consider small fan for active airflow (optional)

---

### Step 3: Wire Power Rails

1. Create **common GND rail** on breadboard
   - Connect all GND pins: Arduino, ESP32, L298N, sensors, RC receiver

2. Create **5V rail** on breadboard
   - Connect Arduino 5V output to breadboard
   - Connect RC receiver VCC
   - Connect HC-SR04 VCC

3. Create **3.3V rail** (optional)
   - ESP32 3.3V output
   - DHT22 VCC

---

### Step 4: Connect Control Signals

1. RC receiver → Arduino (CH1, CH2)
2. Arduino → L298N (ENA, IN1-4, ENB)
3. HC-SR04 → Arduino (TRIG, ECHO)
4. DHT22 → ESP32 (GPIO 4)
5. MQ-2 → ESP32 (GPIO 34)
6. Arduino ↔ ESP32 serial (D0, D1, GPIO 16, 17)

---

### Step 5: Secure Wiring

1. Use **zip ties** to bundle wires
2. **Label** all connections (use masking tape + marker)
3. **Route** wires away from moving parts (wheels)
4. **Test continuity** with multimeter before powering on
5. **Insulate** exposed connections with heat shrink tubing

---

## Testing Procedure

### Pre-Power Checks

1. **Visual Inspection:**
   - No short circuits (VCC touching GND)
   - All connections secure
   - Polarity correct (red=+, black=-)

2. **Multimeter Continuity Test:**
   - Check GND continuity across all components
   - Check no shorts between VCC and GND rails

3. **Battery Voltage:**
   - Measure battery voltage: 7.4V nominal (6.0V-8.4V range)
   - Ensure battery is charged

---

### Power-On Sequence

1. **Power Arduino First** (via USB or battery)
   - Check: Power LED on Arduino lights up
   - Check: RC receiver LED lights up

2. **Power ESP32** (via USB or battery)
   - Check: Power LED on ESP32 lights up
   - Check: WiFi LED may blink during boot

3. **Power L298N** (motor battery)
   - Check: L298N power LED lights up
   - Check: Motors do NOT spin yet (RC at neutral)

---

### Component Testing

#### Test 1: RC Receiver

1. Turn on RC transmitter
2. Open Arduino Serial Monitor (115200 baud)
3. Move transmitter sticks
4. **Expected:** Serial output shows:
   ```
   CH1: 1500, CH2: 1500  (neutral)
   CH1: 2000, CH2: 1000  (stick full right, full back)
   ```

#### Test 2: Motors

1. Keep rover on blocks (wheels off ground)
2. Move RC throttle stick forward
3. **Expected:** All 4 wheels spin forward
4. Move RC steering stick
5. **Expected:** Left/right wheels spin at different speeds

#### Test 3: Ultrasonic Sensor

1. Open Arduino Serial Monitor
2. Place hand 10cm, 20cm, 50cm from sensor
3. **Expected:** Serial output shows:
   ```
   DISTANCE:10
   DISTANCE:20
   DISTANCE:50
   ```

#### Test 4: DHT22

1. Upload ESP32 code
2. Open ESP32 Serial Monitor (115200 baud)
3. **Expected:** Output shows:
   ```
   Temperature: 25.3°C
   Humidity: 60.2%
   ```

#### Test 5: MQ-2

1. **Pre-heat MQ-2** for 5 minutes minimum
2. Open ESP32 Serial Monitor
3. **Expected:** Output shows:
   ```
   Gas Level: 50 ppm  (normal air)
   ```
4. Light a match near sensor (safe distance!)
5. **Expected:** Gas level rises to 200-500 ppm

#### Test 6: Serial Communication

1. Open Arduino Serial Monitor
2. Arduino sends: `DISTANCE:100`
3. Open ESP32 Serial Monitor simultaneously (use 2 USB cables)
4. **Expected:** ESP32 receives and displays:
   ```
   Received from Arduino: DISTANCE:100
   ```

---

## Troubleshooting

### Motors Not Spinning

**Possible Causes:**
1. L298N not powered (check battery)
2. ENA/ENB jumpers removed (put them back)
3. Wiring reversed (swap IN1↔IN2 or IN3↔IN4)
4. PWM pins not set (check Arduino code: `analogWrite(ENA, speed)`)

**Solutions:**
- Measure voltage at L298N input: should be 7.4V
- Check Arduino PWM output with multimeter/oscilloscope
- Test motors directly with battery (bypass L298N)

---

### HC-SR04 Returns 0 or 999

**Possible Causes:**
1. Wiring loose or incorrect
2. Sensor facing reflective surface (mirror effect)
3. Sensor too close to ground (ground echo interference)
4. Timing issue in code

**Solutions:**
- Check TRIG/ECHO pins not swapped
- Point sensor at non-reflective target (cardboard)
- Raise sensor to 5-10cm above ground
- Increase timeout in `pulseIn()` function

---

### DHT22 Returns NaN

**Possible Causes:**
1. Wrong pin number in code (`#define DHT_PIN 4`)
2. Loose wiring (DATA pin)
3. Missing pull-up resistor
4. Sensor damaged

**Solutions:**
- Verify GPIO 4 wiring with multimeter (continuity)
- Add 10kΩ resistor between DATA and VCC
- Try different GPIO pin (e.g., GPIO 5)
- Replace DHT22 sensor

---

### MQ-2 Reads 0 or Constant 1023

**Possible Causes:**
1. Not pre-heated (needs 24-48 hours first use)
2. No 5V power (requires 5V, not 3.3V)
3. Potentiometer on module not adjusted
4. Sensor expired (MQ-2 has ~2-3 year lifespan)

**Solutions:**
- Power MQ-2 for 5 minutes minimum before reading
- Check voltage at MQ-2 VCC: should be 5V (use multimeter)
- Adjust blue potentiometer on module (turn slowly)
- Calibrate in fresh air: `gasBaseline = analogRead(MQ2_PIN);`

---

### Serial Communication Not Working

**Possible Causes:**
1. TX/RX wires swapped (TX should go to RX)
2. No shared GND between Arduino and ESP32
3. Baud rate mismatch (must both use 115200)
4. Voltage level issue (5V Arduino vs. 3.3V ESP32)

**Solutions:**
- Verify: Arduino TX (D1) → ESP32 RX2 (GPIO 16)
- Add GND wire between Arduino and ESP32
- Check both codes use `Serial.begin(115200)`
- Use **logic level shifter** (e.g., 74LVC245) between Arduino and ESP32

---

### RC Control Not Responding

**Possible Causes:**
1. RC transmitter not bound to receiver
2. RC receiver not powered
3. RC signal pins not connected to Arduino
4. `pulseIn()` timeout too short

**Solutions:**
- Bind transmitter to receiver (follow RC manual)
- Check RC receiver LED: should be solid (bound) or blinking (waiting)
- Verify CH1/CH2 wires to Arduino D11/D12
- Increase timeout: `pulseIn(RC_CH1, HIGH, 25000);`

---

## Safety Warnings

### Electrical Safety

- **Never** connect 12V directly to Arduino/ESP32 (they use 5V/3.3V)
- **Always** check polarity before connecting batteries
- **Use** fuses on battery connections (5A for motors, 1A for logic)
- **Disconnect** battery when not in use (prevent over-discharge)

### Fire Hazard

- **MQ-2 gets HOT** (heater element reaches 200°C)
- **Keep away** from flammable materials
- **Do not** enclose MQ-2 in plastic case
- **Monitor** first few uses for overheating

### Motor Safety

- **Keep hands away** from spinning wheels
- **Test on blocks** before driving on ground
- **Emergency stop:** Remove battery immediately
- **Rover may flip** at high speeds on uneven terrain

### LiPo Battery Safety

- **Never** over-discharge below 3.0V per cell
- **Never** overcharge above 4.2V per cell
- **Store** at 3.8V per cell (storage voltage)
- **Use** LiPo-safe charging bag
- **Dispose** properly if battery is swollen/damaged

---

## Final Assembly Checklist

- [ ] All components mounted securely
- [ ] All wires connected per diagram
- [ ] Common GND rail established
- [ ] Power supply voltages verified (multimeter)
- [ ] No short circuits (continuity test)
- [ ] Arduino code uploaded and tested
- [ ] ESP32 code uploaded and tested
- [ ] RC transmitter bound to receiver
- [ ] Motors spin in correct direction
- [ ] Sensors reading valid data
- [ ] Serial communication working
- [ ] Batteries charged
- [ ] Emergency stop procedure known

---

## Next Steps

After hardware assembly:

1. ✅ Hardware wired and tested
2. ⏳ Configure WiFi credentials in ESP32 code
3. ⏳ Set up Firebase (see `FIREBASE_SETUP_GUIDE.md`)
4. ⏳ Upload Arduino and ESP32 code
5. ⏳ Start backend server and dashboard
6. ⏳ Test complete system end-to-end

---

**Happy Building!** 🚗⚡

Your smart tunnel inspection rover is ready for action.
