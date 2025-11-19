/**
 * Smart Tunnel Inspection Rover Dashboard
 * Direct Firebase Connection - Real-time Updates Every 1 Second
 */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Dashboard.css';
import { Activity, Thermometer, Droplets, Wind, Ruler, AlertTriangle, CheckCircle, Radio } from 'lucide-react';

// Backend URL - automatically uses production URL when deployed
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Dashboard({ onNavigateToLanding }) {
  const [sensorData, setSensorData] = useState({
    temperature: '--',
    humidity: '--',
    gasLevel: '--',
    distance: '--',
    timestamp: null,
    deviceId: 'rover_001'
  });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to backend via Socket.IO
    const newSocket = io(BACKEND_URL);
    
    newSocket.on('connect', () => {
      console.log('✓ Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('✗ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('sensorData', (data) => {
      console.log('📡 Received:', data);
      setSensorData({
        temperature: data.temperature || 0,
        humidity: data.humidity || 0,
        gasLevel: data.gasLevel || 0,
        distance: data.distance || 0,
        timestamp: data.timestamp || Date.now(),
        deviceId: data.deviceId || 'rover_001'
      });
      setLastUpdate(new Date());
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Calculate status for each sensor
  const getTempStatus = (temp) => {
    if (temp < 15) return 'cold';
    if (temp > 35) return 'hot';
    return 'normal';
  };

  const getHumidityStatus = (hum) => {
    if (hum < 30) return 'dry';
    if (hum > 70) return 'humid';
    return 'normal';
  };

  const getGasStatus = (gas) => {
    if (gas > 300) return 'danger';
    if (gas > 150) return 'warning';
    return 'safe';
  };

  const getDistanceStatus = (dist) => {
    if (dist < 30) return 'danger';
    if (dist < 50) return 'warning';
    return 'clear';
  };

  const formatTime = (date) => {
    if (!date) return '--';
    return date.toLocaleTimeString();
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <Activity className="logo-icon" />
          <div>
            <h1>Smart Tunnel Inspection Rover</h1>
            <p>Civil Engineering Department - 2025</p>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-back" onClick={onNavigateToLanding} title="Back to Home">
            ← Home
          </button>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <Radio size={16} />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {lastUpdate && (
            <div className="last-update">
              Last update: {formatTime(lastUpdate)}
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard-main">
        {/* Sensor Cards Grid */}
        <div className="sensor-grid">
          {/* Temperature Card */}
          <div className={`sensor-card temp-card status-${getTempStatus(sensorData.temperature)}`}>
            <div className="card-header">
              <Thermometer className="card-icon" />
              <h3>Temperature</h3>
            </div>
            <div className="card-value">
              <span className="value">{typeof sensorData.temperature === 'number' ? sensorData.temperature.toFixed(1) : '--'}</span>
              <span className="unit">°C</span>
            </div>
            <div className="card-footer">
              <div className="status-indicator"></div>
              <span className="status-text">
                {getTempStatus(sensorData.temperature) === 'normal' ? 'Normal' : 
                 getTempStatus(sensorData.temperature) === 'hot' ? 'High Temperature' : 'Low Temperature'}
              </span>
            </div>
          </div>

          {/* Humidity Card */}
          <div className={`sensor-card humidity-card status-${getHumidityStatus(sensorData.humidity)}`}>
            <div className="card-header">
              <Droplets className="card-icon" />
              <h3>Humidity</h3>
            </div>
            <div className="card-value">
              <span className="value">{typeof sensorData.humidity === 'number' ? sensorData.humidity.toFixed(1) : '--'}</span>
              <span className="unit">%</span>
            </div>
            <div className="card-footer">
              <div className="status-indicator"></div>
              <span className="status-text">
                {getHumidityStatus(sensorData.humidity) === 'normal' ? 'Normal' : 
                 getHumidityStatus(sensorData.humidity) === 'humid' ? 'High Humidity' : 'Low Humidity'}
              </span>
            </div>
          </div>

          {/* Gas Level Card */}
          <div className={`sensor-card gas-card status-${getGasStatus(sensorData.gasLevel)}`}>
            <div className="card-header">
              <Wind className="card-icon" />
              <h3>Gas Level</h3>
            </div>
            <div className="card-value">
              <span className="value">{typeof sensorData.gasLevel === 'number' ? sensorData.gasLevel : '--'}</span>
              <span className="unit">ppm</span>
            </div>
            <div className="card-footer">
              <div className="status-indicator"></div>
              <span className="status-text">
                {getGasStatus(sensorData.gasLevel) === 'safe' ? 'Safe Level' : 
                 getGasStatus(sensorData.gasLevel) === 'warning' ? 'Elevated Level' : '⚠️ High Gas Level!'}
              </span>
            </div>
          </div>

          {/* Distance Card */}
          <div className={`sensor-card distance-card status-${getDistanceStatus(sensorData.distance)}`}>
            <div className="card-header">
              <Ruler className="card-icon" />
              <h3>Obstacle Distance</h3>
            </div>
            <div className="card-value">
              <span className="value">{typeof sensorData.distance === 'number' ? sensorData.distance.toFixed(1) : '--'}</span>
              <span className="unit">cm</span>
            </div>
            <div className="card-footer">
              <div className="status-indicator"></div>
              <span className="status-text">
                {getDistanceStatus(sensorData.distance) === 'clear' ? 'Clear Path' : 
                 getDistanceStatus(sensorData.distance) === 'warning' ? 'Obstacle Nearby' : '⚠️ Obstacle Detected!'}
              </span>
            </div>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="alert-panel">
          <h3><AlertTriangle size={20} /> System Alerts</h3>
          <div className="alerts-list">
            {getGasStatus(sensorData.gasLevel) === 'danger' && (
              <div className="alert danger">
                <AlertTriangle size={16} />
                <span>DANGER: High gas level detected ({sensorData.gasLevel} ppm)</span>
              </div>
            )}
            {getDistanceStatus(sensorData.distance) === 'danger' && (
              <div className="alert danger">
                <AlertTriangle size={16} />
                <span>DANGER: Obstacle too close ({sensorData.distance.toFixed(1)} cm)</span>
              </div>
            )}
            {getTempStatus(sensorData.temperature) === 'hot' && (
              <div className="alert warning">
                <AlertTriangle size={16} />
                <span>WARNING: High temperature ({sensorData.temperature.toFixed(1)}°C)</span>
              </div>
            )}
            {getGasStatus(sensorData.gasLevel) === 'safe' && 
             getDistanceStatus(sensorData.distance) === 'clear' && 
             getTempStatus(sensorData.temperature) === 'normal' && (
              <div className="alert safe">
                <CheckCircle size={16} />
                <span>All systems normal</span>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="system-info">
          <div className="info-item">
            <strong>Device ID:</strong> {sensorData.deviceId}
          </div>
          <div className="info-item">
            <strong>Firebase:</strong> Connected
          </div>
          <div className="info-item">
            <strong>Update Rate:</strong> Real-time
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
