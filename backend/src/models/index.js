/**
 * MongoDB Mongoose Models for RoadScan Project
 */

const mongoose = require('mongoose');

// ==================== Sensor Data Schema ====================
const sensorDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    default: 'ESP32_RoadScan_001'
  },
  temperature: {
    type: Number,
    required: true,
    min: -50,
    max: 100
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  gasLevel: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 1000
  },
  distance: {
    type: Number,
    required: true,
    min: 0,
    max: 400
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
sensorDataSchema.index({ timestamp: -1 });
sensorDataSchema.index({ deviceId: 1, timestamp: -1 });

// ==================== Vehicle Position Schema ====================
const vehiclePositionSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  angle: {
    type: Number,
    default: 0
  },
  distance: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

vehiclePositionSchema.index({ timestamp: -1 });

// ==================== Analytics Schema ====================
const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  avgTemperature: Number,
  avgHumidity: Number,
  maxTemperature: Number,
  minTemperature: Number,
  avgDistance: Number,
  minDistance: Number,
  avgGasLevel: Number,
  maxGasLevel: Number,
  gasAlertsCount: {
    type: Number,
    default: 0
  },
  obstaclesDetected: {
    type: Number,
    default: 0
  },
  dataPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ==================== Export Models ====================
const SensorData = mongoose.model('SensorData', sensorDataSchema);
const VehiclePosition = mongoose.model('VehiclePosition', vehiclePositionSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = {
  SensorData,
  VehiclePosition,
  Analytics
};
