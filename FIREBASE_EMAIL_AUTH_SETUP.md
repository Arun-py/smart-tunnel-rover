# Firebase Email Authentication Setup Guide

## 🔐 ESP32 Firebase Email Authentication Mode

This guide shows how to use Firebase Email/Password authentication instead of anonymous auth to avoid SSL certificate issues.

---

## ⚙️ Firebase Console Setup

### Step 1: Enable Email Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **rover-6126b**
3. Click **Authentication** in left sidebar
4. Click **Get Started** (if first time)
5. Click **Sign-in method** tab
6. Click **Email/Password**
7. **Enable** the toggle switch
8. Click **Save**

### Step 2: Create User Account

1. Still in **Authentication** section
2. Click **Users** tab
3. Click **Add user** button
4. Enter:
   - **Email**: `727723euee010@skcet.ac.in`
   - **Password**: `Arun2786****` (your password)
5. Click **Add user**
6. ✅ User created successfully!

---

## 📤 Upload ESP32 Code

### File to Upload
```
arduino/esp32_firebase_rover/esp32_firebase_email_auth.ino
```

### Before Upload - Verify Settings

**WiFi Credentials** (lines 23-25):
```cpp
const char* ssid[] = {"ZORO", "Santhosh SK", "Aadeesh"};
const char* password[] = {"zoro1111", "12345678", "12312312"};
```

**Firebase Credentials** (lines 28-33):
```cpp
#define API_KEY "AIzaSyAbsngu27x5C2Nv_wzoD2WeZmNF4eW84V0"
#define DATABASE_URL "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app"
#define USER_EMAIL "727723euee010@skcet.ac.in"
#define USER_PASSWORD "Arun2786****"
```

### Upload Steps

1. **Open Arduino IDE**
2. **File → Open** → Select `esp32_firebase_email_auth.ino`
3. **Tools → Board** → Select `ESP32 Dev Module`
4. **Tools → Port** → Select your ESP32 COM port
5. **Upload** button (➡️)
6. Wait for "Done uploading" message

---

## 🖥️ Serial Monitor Output

### Expected Output

Open Serial Monitor (115200 baud):

```
╔════════════════════════════════════════╗
║  Smart Tunnel Inspection Rover v3.0   ║
║  Civil Engineering Department - 2025   ║
║  Firebase Email Authentication Mode    ║
╚════════════════════════════════════════╝

🔧 Initializing hardware...
✅ Sensors initialized
✅ Motor driver initialized

📡 Connecting to WiFi...
Trying: ZORO
..........
✅ WiFi connected!
📶 Network: ZORO
📍 IP Address: 10.33.64.224
💪 Signal Strength: -45 dBm

🔥 Initializing Firebase...
⏳ Waiting for authentication...
✅ Firebase authenticated successfully!
👤 User: 727723euee010@skcet.ac.in
🔑 UID: xxxxxxxxxxxxxxxxxxxxx

╔════════════════════════════════════════╗
║     🚀 ROVER READY - AUTONOMOUS MODE   ║
╚════════════════════════════════════════╝

Movement Pattern:
  ➡️  2 seconds FORWARD
  🔍 10 seconds SCANNING (5 readings)
  ↩️  0.5 seconds TURN RIGHT
  🔁 REPEAT

🚗 STATE: MOVING FORWARD (2 seconds)
⏸️  Motors stopped

🔍 STATE: SCANNING (10 seconds - 5 readings)

📡 Reading 1/5:

📊 Sensor Readings:
🌡️  Temperature: 30.5°C
💧 Humidity: 75.2%
💨 Gas Level: 42 ppm
📏 Distance: 125.3 cm

🔄 Uploading to Firebase...
✅ Temperature uploaded
✅ Humidity uploaded
✅ Gas level uploaded
✅ Distance uploaded
✅ Condition uploaded
✅ Timestamp uploaded
✅ Device ID uploaded

🎉 All data uploaded successfully!
```

### Troubleshooting

**If you see SSL errors:**
```
❌ Firebase authentication failed!
ERROR.mConnectSSL: Failed to initlalize the SSL layer
```
**Solution**: Email auth uses same SSL as anonymous, may still have issues. Try HTTP mode instead.

**If WiFi fails:**
```
❌ All WiFi networks failed!
```
**Solution**: Check SSID/password, move closer to router, verify 2.4GHz WiFi (ESP32 doesn't support 5GHz).

**If sensors show 0.0:**
```
🌡️  Temperature: 0.0°C
💧 Humidity: 0.0%
```
**Solution**: Check DHT22 wiring (VCC→3.3V, DATA→GPIO33, GND→GND), wait 2 seconds after power-on.

---

## 🔥 Firebase Database Structure

### Data Path: `/sensors`

```json
{
  "sensors": {
    "temperature": 30.5,
    "humidity": 75.2,
    "gasLevel": 42,
    "distance": 125.3,
    "condition": "Normal",
    "timestamp": 1234567890,
    "deviceId": "rover_001"
  }
}
```

### View in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select **rover-6126b** project
3. Click **Realtime Database** in left sidebar
4. You should see `/sensors` node updating every 2 seconds
5. Click on values to see real-time changes

---

## 🌐 Dashboard Setup

### Use DashboardFirebase Component

The React dashboard is already configured to read from Firebase.

**Enable Firebase Mode** in `frontend/src/App.js`:

```javascript
const USE_FIREBASE_MODE = true;  // Change to true
```

### Deploy Changes

```bash
cd frontend
git add .
git commit -m "Enable Firebase dashboard mode"
git push
```

Vercel will auto-deploy in 1-2 minutes.

---

## 🔐 Security Recommendations

### ⚠️ IMPORTANT: Password Security

**NEVER commit passwords to Git!**

1. **Change password after testing** in Firebase Console:
   - Authentication → Users → Click user email
   - Three dots menu → Reset password

2. **Use environment variables** for production:
   - Create `secrets.h` file (add to `.gitignore`)
   - Store credentials there
   - Include in `.ino` file

Example `secrets.h`:
```cpp
#define USER_EMAIL "727723euee010@skcet.ac.in"
#define USER_PASSWORD "your_actual_password_here"
```

### Firebase Security Rules

Update rules in Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    "sensors": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

This ensures only authenticated users can read/write data.

---

## 📊 Testing Checklist

- [ ] Firebase user created in Authentication console
- [ ] Email/Password sign-in method enabled
- [ ] ESP32 code uploaded successfully
- [ ] Serial Monitor shows "✅ Firebase authenticated successfully!"
- [ ] Serial Monitor shows "🎉 All data uploaded successfully!"
- [ ] Firebase Console shows `/sensors` data updating
- [ ] Dashboard shows real-time sensor values
- [ ] Motors moving in autonomous pattern
- [ ] All 4 sensors reading correctly

---

## 🔄 Switching Between Modes

### HTTP Mode (Working - Recommended)
```
arduino/esp32_http_rover/esp32_http_rover.ino
```
- No SSL certificate issues
- Proven working in production
- Use when Firebase has connection problems

### Firebase Email Auth Mode (This Guide)
```
arduino/esp32_firebase_rover/esp32_firebase_email_auth.ino
```
- Email/password authentication
- May still have SSL issues on some networks
- Better than anonymous auth

### Firebase Anonymous Mode (Old - Not Recommended)
```
arduino/esp32_firebase_rover/esp32_firebase_rover_v2.ino
```
- Anonymous authentication
- Known SSL certificate errors
- Use only if other methods fail

---

## 📞 Support

**Issues?**
- Check Serial Monitor for detailed error messages
- Verify Firebase Console shows user is authenticated
- Test Firebase rules allow read/write
- Try HTTP mode if SSL errors persist

**GitHub**: https://github.com/Arun-py/smart-tunnel-rover

---

**Smart Tunnel Inspection Rover - Firebase Email Auth Mode**  
Civil Engineering Department • 2025
