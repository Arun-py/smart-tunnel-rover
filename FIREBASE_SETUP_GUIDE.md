# Firebase Setup Guide
## Smart Tunnel and Parking Safety Inspection Rover

This guide will help you configure Firebase Realtime Database for the IoT rover project.

---

## Overview

The system architecture uses Firebase as the cloud intermediary:
```
ESP32 (on rover) → Firebase Realtime Database → Node.js Bridge → MongoDB → Dashboard
```

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project**
3. Enter project name: `tunnel-inspection-rover` (or your preferred name)
4. Disable Google Analytics (not needed for this project)
5. Click **Create Project**

---

## Step 2: Enable Realtime Database

1. In Firebase Console, click **Realtime Database** in the left menu
2. Click **Create Database**
3. Choose location: **United States** (or closest to your location)
4. Start in **Test Mode** (we'll configure rules later)
5. Click **Enable**

You should now see the database URL:
```
https://tunnel-inspection-rover-default-rtdb.firebaseio.com/
```

---

## Step 3: Get Database Credentials

### For ESP32 (Legacy API Token)

1. In Firebase Console, click the **Settings (⚙️)** icon → **Project Settings**
2. Click on the **Service accounts** tab
3. Click **Database secrets**
4. Copy the **secret key** (this is your `FIREBASE_AUTH` token)

**Important:** This is a legacy token. For production, use Firebase Authentication tokens.

### Database Host

Your database host is the URL without `https://` and without trailing `/`:
```
tunnel-inspection-rover-default-rtdb.firebaseio.com
```

---

## Step 4: Generate Service Account Key (For Node.js Bridge)

1. In Firebase Console → **Settings (⚙️)** → **Project Settings**
2. Go to **Service accounts** tab
3. Click **Generate new private key**
4. Confirm by clicking **Generate key**
5. A JSON file will download: `tunnel-inspection-rover-firebase-adminsdk-xxxxx.json`

**Save this file securely** - it contains admin credentials!

---

## Step 5: Configure ESP32 Code

1. Open `arduino/esp32_firebase_rover/esp32_firebase_rover.ino`

2. Update WiFi credentials:
```cpp
#define WIFI_SSID "YourWiFiName"        // Your WiFi network name
#define WIFI_PASSWORD "YourWiFiPassword" // Your WiFi password
```

3. Update Firebase credentials:
```cpp
#define FIREBASE_HOST "tunnel-inspection-rover-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "your_database_secret_key_here"
```

Replace:
- `FIREBASE_HOST` with your database URL (without `https://`)
- `FIREBASE_AUTH` with the secret key from Step 3

---

## Step 6: Configure Node.js Bridge

1. **Place the service account JSON file** in the backend folder:
```
backend/
  └── firebase-service-account.json  ← Place downloaded JSON here
```

2. **Rename the file** to exactly `firebase-service-account.json`

3. The bridge script (`backend/src/firebase-bridge.js`) will automatically load this file.

---

## Step 7: Configure Firebase Security Rules

For **development/testing**, use these permissive rules:

1. In Firebase Console → **Realtime Database** → **Rules** tab
2. Replace with:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For **production**, use these restricted rules:

```json
{
  "rules": {
    "sensorData": {
      ".read": true,
      "latest": {
        ".write": true
      },
      "history": {
        ".write": true
      }
    }
  }
}
```

Click **Publish** to save the rules.

---

## Step 8: Test Firebase Connection

### Test 1: Manual Data Write (Web Console)

1. Go to Firebase Console → **Realtime Database** → **Data** tab
2. Click the **+** icon next to the database root
3. Enter:
   - **Name:** `sensorData/latest/temperature`
   - **Value:** `25.5`
4. Click **Add**

You should see the data appear in the database tree.

### Test 2: ESP32 → Firebase

1. Upload the ESP32 code to your board
2. Open Serial Monitor (115200 baud)
3. You should see:
```
Connecting to WiFi...
WiFi connected
IP address: 192.168.x.x
Firebase connected!
Sending data to Firebase...
Data sent successfully!
```

4. Check Firebase Console → **Data** tab → You should see:
```
sensorData/
  ├── latest/
  │   ├── temperature: 26.3
  │   ├── humidity: 65.2
  │   ├── gasLevel: 45
  │   └── distance: 120
  └── history/
      └── -Nxxxxxxxx/
          ├── temperature: 26.3
          ├── humidity: 65.2
          ├── gasLevel: 45
          ├── distance: 120
          └── timestamp: 1737654321000
```

### Test 3: Firebase → Node.js → MongoDB

1. **Start MongoDB** (must be running on `localhost:27017`)

2. **Run the Firebase Bridge**:
```powershell
cd backend
npm run firebase-bridge
```

You should see:
```
Firebase bridge started...
Connected to MongoDB
Listening for Firebase data at: /sensorData/latest
```

3. **Check MongoDB** (use MongoDB Compass or mongosh):
```javascript
use roadscan
db.sensordatas.find().pretty()
```

You should see sensor data documents:
```json
{
  "_id": ObjectId("..."),
  "deviceId": "rover_001",
  "temperature": 26.3,
  "humidity": 65.2,
  "gasLevel": 45,
  "distance": 120,
  "timestamp": ISODate("2025-01-23T10:45:21.000Z")
}
```

---

## Step 9: Data Structure

Firebase stores data at these paths:

### `/sensorData/latest` (Current Reading)
```json
{
  "temperature": 26.3,
  "humidity": 65.2,
  "gasLevel": 45,
  "distance": 120,
  "timestamp": 1737654321000
}
```

### `/sensorData/history/{pushId}` (Historical Log)
```json
{
  "-NaBC123xyz": {
    "temperature": 26.3,
    "humidity": 65.2,
    "gasLevel": 45,
    "distance": 120,
    "timestamp": 1737654321000
  },
  "-NaBC456def": {
    "temperature": 27.1,
    "humidity": 66.0,
    "gasLevel": 52,
    "distance": 115,
    "timestamp": 1737654323000
  }
}
```

---

## Troubleshooting

### ESP32 Cannot Connect to Firebase

**Error:** `[ERROR] Firebase connection failed`

**Solutions:**
1. Check WiFi credentials in code
2. Verify `FIREBASE_HOST` has no `https://` or trailing `/`
3. Verify `FIREBASE_AUTH` token is correct
4. Check Firebase database rules allow write access
5. Ensure ESP32 has internet connection (ping test)

---

### Node.js Bridge Cannot Read Firebase

**Error:** `Error initializing Firebase Admin`

**Solutions:**
1. Verify `firebase-service-account.json` is in `backend/` folder
2. Check JSON file is valid (not corrupted)
3. Ensure file permissions allow reading
4. Verify Firebase project ID in JSON matches your project

---

### No Data in MongoDB

**Symptoms:** Firebase has data, but MongoDB is empty

**Solutions:**
1. Check MongoDB is running: `mongosh` and `show dbs`
2. Verify bridge script is running: `npm run firebase-bridge`
3. Check console for errors in bridge script
4. Verify database name is `roadscan` (or update in bridge script)
5. Check Firebase listener path matches ESP32 write path

---

### Firebase Rules Deny Access

**Error:** `Permission denied`

**Solutions:**
1. Go to Firebase Console → **Realtime Database** → **Rules**
2. For testing, set to:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
3. Click **Publish**
4. Wait 30 seconds for rules to propagate

---

## Security Best Practices

### For Production Deployment:

1. **Enable Firebase Authentication:**
   - Use custom tokens or email/password auth
   - ESP32 should authenticate before writing data

2. **Restrict Database Rules:**
```json
{
  "rules": {
    "sensorData": {
      ".read": "auth != null",
      "latest": {
        ".write": "auth != null && auth.uid === 'rover_device'"
      },
      "history": {
        ".write": "auth != null && auth.uid === 'rover_device'"
      }
    }
  }
}
```

3. **Rotate Secret Keys:**
   - Change `FIREBASE_AUTH` token periodically
   - Regenerate service account keys every 6 months

4. **Use Environment Variables:**
   - Never commit `firebase-service-account.json` to Git
   - Add to `.gitignore`:
```
firebase-service-account.json
*.env
```

5. **Enable HTTPS Only:**
   - Firebase enforces HTTPS by default
   - Never downgrade to HTTP

---

## Cost Considerations

Firebase Realtime Database has a **free tier (Spark Plan)**:

- **1 GB stored data** (monthly)
- **10 GB downloaded** (monthly)
- **100 simultaneous connections**

For this IoT project with 1 rover sending data every 2 seconds:

- **Data written:** ~2.5 MB/day = 75 MB/month
- **Data read:** ~5 MB/day (bridge + dashboard) = 150 MB/month
- **Total storage:** <100 MB

✅ **This project fits well within the free tier!**

If you need more, upgrade to **Blaze Plan** (pay-as-you-go).

---

## Next Steps

1. ✅ Firebase configured
2. ✅ ESP32 sending data
3. ✅ Node.js bridge saving to MongoDB
4. ⏳ Start backend server: `npm start`
5. ⏳ Start frontend: `npm start`
6. ⏳ View dashboard at `http://localhost:3000`

---

## Support

For Firebase documentation, visit:
- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [Firebase Admin SDK for Node.js](https://firebase.google.com/docs/admin/setup)

---

**Setup Complete!** 🎉

Your rover is now connected to the cloud via Firebase.
