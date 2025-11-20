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
const allowedOrigins = [
  'http://localhost:3000',
  'https://smart-tunnel-rover.vercel.app',
  'https://*.vercel.app'
];

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ==================== Middleware ====================
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ==================== Global Variables ====================
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  gasLevel: 0,
  timestamp: Date.now(),
  deviceId: 'rover_001'
};

// Random data generator ranges
const TEMP_RANGE = { min: 30.2, max: 30.8 };
const HUMIDITY_RANGE = { min: 62, max: 67 };
const GAS_RANGES = [104, 120, 155, 250]; // Randomly pick from these values

function getRandomInRange(min, max, decimals = 1) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

function getRandomGasLevel() {
  return GAS_RANGES[Math.floor(Math.random() * GAS_RANGES.length)];
}

function generateRandomData() {
  return {
    temperature: getRandomInRange(TEMP_RANGE.min, TEMP_RANGE.max, 1),
    humidity: getRandomInRange(HUMIDITY_RANGE.min, HUMIDITY_RANGE.max, 1),
    gasLevel: getRandomGasLevel(),
    timestamp: Date.now(),
    deviceId: 'rover_001'
  };
}

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

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Tunnel Inspection Rover API',
    version: '1.0.0',
    status: 'running',
    mode: 'HTTP Direct (No Firebase)',
    endpoints: {
      health: 'GET /api/health',
      sensors: 'GET /api/sensors',
      sensorData: 'POST /api/sensor-data (ESP32 endpoint)',
      history: 'GET /api/sensors/history?limit=100',
      analytics: 'GET /api/analytics'
    },
    github: 'https://github.com/Arun-py/smart-tunnel-rover',
    documentation: 'See DEPLOYMENT_GUIDE.md'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'HTTP Direct',
    uptime: process.uptime(),
    timestamp: Date.now(),
    latestData: latestSensorData
  });
});

// POST endpoint for ESP32 to send sensor data
app.post('/api/sensor-data', (req, res) => {
  try {
    const { temperature, humidity, gasLevel, deviceId } = req.body;
    
    latestSensorData = {
      temperature: parseFloat(temperature) || 0,
      humidity: parseFloat(humidity) || 0,
      gasLevel: parseInt(gasLevel) || 0,
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

// Populate random data endpoint (for testing)
app.get('/api/populate-random', (req, res) => {
  const count = parseInt(req.query.count) || 20;
  const newData = [];
  
  for (let i = 0; i < count; i++) {
    const data = generateRandomData();
    sensorHistory.push(data);
    newData.push(data);
  }
  
  // Keep only MAX_HISTORY records
  if (sensorHistory.length > MAX_HISTORY) {
    sensorHistory = sensorHistory.slice(-MAX_HISTORY);
  }
  
  // Update latest data
  if (sensorHistory.length > 0) {
    latestSensorData = {...sensorHistory[sensorHistory.length - 1]};
    io.emit('sensorData', latestSensorData);
  }
  
  res.json({
    success: true,
    message: `Generated ${count} random readings`,
    data: newData,
    totalHistory: sensorHistory.length
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
