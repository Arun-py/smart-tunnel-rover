/**
 * RoadScan Backend Server - Firebase Direct Mode
 * Express + Firebase Realtime Database + Socket.IO
 * Data flows: ESP32 → Firebase → Website (No MongoDB needed!)
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');

// ==================== Firebase Admin Setup ====================
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// ==================== Initialize Express App ====================
const app = express();
const server = http.createServer(app);

// ==================== Socket.IO Setup ====================
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ==================== Middleware ====================
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ==================== Firebase Real-time Listener ====================
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  gasLevel: 0,
  distance: 0,
  timestamp: Date.now(),
  deviceId: 'rover_001'
};

// Listen to Firebase /sensorData/latest
const sensorRef = db.ref('/sensorData/latest');
sensorRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    latestSensorData = {
      temperature: data.temperature || 0,
      humidity: data.humidity || 0,
      gasLevel: data.gasLevel || 0,
      distance: data.distance || 0,
      timestamp: data.timestamp || Date.now(),
      deviceId: data.deviceId || 'rover_001'
    };
    
    console.log('📡 Firebase Update:', latestSensorData);
    
    // Broadcast to all connected clients
    io.emit('sensorData', latestSensorData);
    
    // Check for alerts
    if (latestSensorData.gasLevel > 300) {
      console.log('⚠️ HIGH GAS LEVEL:', latestSensorData.gasLevel, 'ppm');
      io.emit('alert', {
        type: 'gas',
        level: 'warning',
        message: `High gas level detected: ${latestSensorData.gasLevel} ppm`
      });
    }
    
    if (latestSensorData.distance < 30 && latestSensorData.distance > 0) {
      console.log('⚠️ OBSTACLE DETECTED:', latestSensorData.distance, 'cm');
      io.emit('alert', {
        type: 'obstacle',
        level: 'warning',
        message: `Obstacle detected at ${latestSensorData.distance} cm`
      });
    }
  }
});

console.log('✓ Firebase listener started on /sensorData/latest');

// ==================== Socket.IO Events ====================
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Send latest data immediately on connection
  socket.emit('sensorData', latestSensorData);
  socket.emit('connectionStatus', { connected: true });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ==================== API Routes ====================

// Get latest sensor data
app.get('/api/sensors', (req, res) => {
  res.json({
    success: true,
    data: latestSensorData
  });
});

// Get sensor history from Firebase
app.get('/api/sensors/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const historyRef = db.ref('/sensorData/history');
    
    const snapshot = await historyRef.orderByKey().limitToLast(limit).once('value');
    const history = [];
    
    snapshot.forEach((childSnapshot) => {
      history.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get analytics (last 24 hours from Firebase)
app.get('/api/analytics', async (req, res) => {
  try {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const historyRef = db.ref('/sensorData/history');
    
    const snapshot = await historyRef
      .orderByChild('timestamp')
      .startAt(oneDayAgo)
      .once('value');
    
    let totalTemp = 0, totalHumidity = 0, totalGas = 0;
    let maxTemp = -Infinity, minTemp = Infinity;
    let maxGas = 0, gasAlerts = 0;
    let count = 0;
    
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      totalTemp += data.temperature || 0;
      totalHumidity += data.humidity || 0;
      totalGas += data.gasLevel || 0;
      
      maxTemp = Math.max(maxTemp, data.temperature || 0);
      minTemp = Math.min(minTemp, data.temperature || 0);
      maxGas = Math.max(maxGas, data.gasLevel || 0);
      
      if (data.gasLevel > 300) gasAlerts++;
      count++;
    });
    
    res.json({
      success: true,
      data: {
        avgTemperature: count > 0 ? (totalTemp / count).toFixed(1) : 0,
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        avgHumidity: count > 0 ? (totalHumidity / count).toFixed(1) : 0,
        avgGasLevel: count > 0 ? (totalGas / count).toFixed(0) : 0,
        maxGasLevel: maxGas,
        gasAlertsCount: gasAlerts,
        totalRecords: count
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    firebase: 'connected',
    timestamp: Date.now()
  });
});

// ==================== Serve Frontend ====================
const buildPath = path.join(__dirname, '../../frontend/build');
if (require('fs').existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
  console.log('✓ Serving frontend from:', buildPath);
} else {
  console.log('⚠️ Frontend build not found. Run: cd frontend && npm run build');
}

// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('\n=== Smart Tunnel Inspection Rover ===');
  console.log('Civil Engineering Department - 2025\n');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Firebase: https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app`);
  console.log(`✓ WebSocket: Enabled`);
  console.log(`✓ Dashboard: http://localhost:${PORT}\n`);
  console.log('Waiting for ESP32 data...\n');
});

// ==================== Error Handling ====================
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  db.goOffline();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
