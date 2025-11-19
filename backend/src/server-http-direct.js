/**
 * RoadScan Backend Server - Direct HTTP Mode (No Firebase)
 * Express + Socket.IO for real-time dashboard updates
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

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

// ==================== Global Variables ====================
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  gasLevel: 0,
  distance: 0,
  timestamp: Date.now(),
  deviceId: 'rover_001'
};

let sensorHistory = [];
const MAX_HISTORY = 100;

// ==================== Socket.IO Events ====================
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Send latest data immediately
  socket.emit('sensorData', latestSensorData);
  socket.emit('connectionStatus', { connected: true });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ==================== API Routes ====================

// POST endpoint for ESP32 to send sensor data
app.post('/api/sensor-data', (req, res) => {
  try {
    const { temperature, humidity, gasLevel, distance, deviceId } = req.body;
    
    latestSensorData = {
      temperature: parseFloat(temperature) || 0,
      humidity: parseFloat(humidity) || 0,
      gasLevel: parseInt(gasLevel) || 0,
      distance: parseFloat(distance) || 0,
      timestamp: Date.now(),
      deviceId: deviceId || 'rover_001'
    };
    
    console.log('📡 Received sensor data:', latestSensorData);
    
    // Store in history
    sensorHistory.push({...latestSensorData});
    if (sensorHistory.length > MAX_HISTORY) {
      sensorHistory.shift(); // Remove oldest
    }
    
    // Broadcast to all connected clients
    io.emit('sensorData', latestSensorData);
    
    // Check for alerts
    if (latestSensorData.gasLevel > 300) {
      console.log('⚠️ HIGH GAS LEVEL:', latestSensorData.gasLevel, 'ppm');
      io.emit('alert', {
        type: 'gas',
        level: 'warning',
        message: `High gas level: ${latestSensorData.gasLevel} ppm`
      });
    }
    
    if (latestSensorData.distance < 30 && latestSensorData.distance > 0) {
      console.log('⚠️ OBSTACLE DETECTED:', latestSensorData.distance, 'cm');
      io.emit('alert', {
        type: 'obstacle',
        level: 'warning',
        message: `Obstacle at ${latestSensorData.distance} cm`
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Data received',
      data: latestSensorData
    });
    
  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get latest sensor data
app.get('/api/sensors', (req, res) => {
  res.json({
    success: true,
    data: latestSensorData
  });
});

// Get sensor history
app.get('/api/sensors/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const history = sensorHistory.slice(-limit);
  
  res.json({
    success: true,
    count: history.length,
    data: history
  });
});

// Get analytics
app.get('/api/analytics', (req, res) => {
  try {
    if (sensorHistory.length === 0) {
      return res.json({
        success: true,
        data: {
          avgTemperature: 0,
          maxTemperature: 0,
          minTemperature: 0,
          avgHumidity: 0,
          avgGasLevel: 0,
          maxGasLevel: 0,
          gasAlertsCount: 0,
          totalRecords: 0
        }
      });
    }
    
    let totalTemp = 0, totalHumidity = 0, totalGas = 0;
    let maxTemp = -Infinity, minTemp = Infinity;
    let maxGas = 0, gasAlerts = 0;
    
    sensorHistory.forEach(data => {
      totalTemp += data.temperature || 0;
      totalHumidity += data.humidity || 0;
      totalGas += data.gasLevel || 0;
      
      maxTemp = Math.max(maxTemp, data.temperature || 0);
      minTemp = Math.min(minTemp, data.temperature || 0);
      maxGas = Math.max(maxGas, data.gasLevel || 0);
      
      if (data.gasLevel > 300) gasAlerts++;
    });
    
    const count = sensorHistory.length;
    
    res.json({
      success: true,
      data: {
        avgTemperature: (totalTemp / count).toFixed(1),
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        avgHumidity: (totalHumidity / count).toFixed(1),
        avgGasLevel: (totalGas / count).toFixed(0),
        maxGasLevel: maxGas,
        gasAlertsCount: gasAlerts,
        totalRecords: count
      }
    });
  } catch (error) {
    console.error('Error calculating analytics:', error);
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
    mode: 'HTTP Direct',
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
}

// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n=== Smart Tunnel Inspection Rover ===');
  console.log('Civil Engineering Department - 2025\n');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Mode: HTTP Direct (No Firebase)`);
  console.log(`✓ WebSocket: Enabled`);
  console.log(`✓ Dashboard: http://localhost:${PORT}`);
  
  // Display local IP addresses
  const os = require('os');
  const interfaces = os.networkInterfaces();
  console.log('\n📡 ESP32 Server URLs:');
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   http://${iface.address}:${PORT}/api/sensor-data`);
      }
    });
  });
  console.log('\nWaiting for ESP32 data...\n');
});

// ==================== Error Handling ====================
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
