const express = require('express');
const router = express.Router();
const { SensorData, VehiclePosition, Analytics } = require('../models');

router.post('/sensor-data', async (req, res) => {
  try {
    const { deviceId, temperature, humidity, distance } = req.body;

    if (temperature === undefined || humidity === undefined || distance === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required sensor data'
      });
    }

    const sensorData = new SensorData({
      deviceId: deviceId || 'ESP32_RoadScan_001',
      temperature,
      humidity,
      distance
    });

    await sensorData.save();

    const obstacleDetected = distance < 30;

    const io = req.app.get('io');
    if (io) {
      io.emit('sensor-update', {
        deviceId: deviceId || 'ESP32_RoadScan_001',
        temperature,
        humidity,
        distance,
        obstacleDetected,
        timestamp: new Date()
      });

      if (obstacleDetected) {
        io.emit('obstacle-detected', { distance, timestamp: new Date() });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Sensor data received',
      data: sensorData
    });

  } catch (error) {
    console.error('Error saving sensor data:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving sensor data',
      error: error.message
    });
  }
});

router.get('/sensor-data/latest', async (req, res) => {
  try {
    const { deviceId } = req.query;
    const query = deviceId ? { deviceId } : {};
    
    const latestData = await SensorData.findOne(query).sort({ timestamp: -1 }).limit(1);

    if (!latestData) {
      return res.status(404).json({ success: false, message: 'No sensor data found' });
    }

    res.json({ success: true, data: latestData });
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ success: false, message: 'Error fetching data', error: error.message });
  }
});

router.get('/sensor-data', async (req, res) => {
  try {
    const { deviceId, limit = 50 } = req.query;
    const query = deviceId ? { deviceId } : {};

    const history = await SensorData.find(query).sort({ timestamp: -1 }).limit(parseInt(limit));

    res.json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayData = await SensorData.find({ timestamp: { $gte: today } });

    const obstaclesDetected = todayData.filter(d => d.distance < 30).length;

    const stats = {
      dataPoints: todayData.length,
      obstaclesDetected,
      avgTemperature: 0,
      avgHumidity: 0,
      maxTemperature: 0,
      minTemperature: 0
    };

    if (todayData.length > 0) {
      const temps = todayData.map(d => d.temperature);
      const hums = todayData.map(d => d.humidity);

      stats.avgTemperature = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
      stats.avgHumidity = (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(1);
      stats.maxTemperature = Math.max(...temps);
      stats.minTemperature = Math.min(...temps);
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
  }
});

module.exports = router;