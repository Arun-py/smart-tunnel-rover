/**
 * RoadScan Backend Server
 * Express + MongoDB + Socket.IO
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const connectDB = require('./config/database');
const apiRoutes = require('./routes/api');

// ==================== Initialize Express App ====================
const app = express();
const server = http.createServer(app);

// ==================== Socket.IO Setup ====================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Make io accessible in routes
app.set('io', io);

// ==================== Middleware ====================
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ==================== Database Connection ====================
connectDB();

// ==================== Socket.IO Events ====================
io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });

  socket.on('request-latest-data', async () => {
    try {
      const { SensorData } = require('./models');
      const latestData = await SensorData.findOne().sort({ timestamp: -1 });
      
      if (latestData) {
        socket.emit('sensor-update', latestData);
      }
    } catch (error) {
      console.error('Error fetching latest data:', error);
    }
  });
});

// ==================== API Routes ====================
app.use('/api', apiRoutes);

// ==================== Root Route ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RoadScan API Server',
    version: '1.0.0',
    endpoints: {
      sensorData: '/api/sensor-data (POST)',
      latestData: '/api/sensor-data/latest (GET)',
      history: '/api/sensor-data/history (GET)',
      hazards: '/api/hazards (GET)',
      vehicleStatus: '/api/vehicle/status (GET)',
      analytics: '/api/analytics (GET)'
    },
    socketIO: 'Connected',
    timestamp: new Date()
  });
});

// ==================== Health Check ====================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
    mongodb: 'Connected'
  });
});

// ==================== Serve Frontend in Production / Localhost Hosting ====================
// If a frontend build exists, serve it so the app can be accessed from the same host (http://localhost:5000)
const clientBuildPath = path.join(__dirname, '..', '..', 'frontend', 'build');
if (fs.existsSync(clientBuildPath)) {
  console.log(`Serving frontend from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  // All other GET requests should return the frontend's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// ==================== 404 Handler ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ==================== Start Server ====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('\n=================================');
  console.log('🚗 RoadScan Backend Server');
  console.log('=================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
  console.log(`✓ Socket.IO: Enabled`);
  console.log('=================================\n');
});

// ==================== Graceful Shutdown ====================
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;
