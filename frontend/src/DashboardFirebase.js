/**
 * Dashboard with Firebase Direct Connection
 * Reads sensor data from Firebase Realtime Database
 */

import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import './Dashboard.css';
import { Activity, Thermometer, Droplets, Wind, Ruler, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import SensorCharts from './components/SensorCharts';

function DashboardFirebase({ onNavigateToLanding }) {
  const [sensorData, setSensorData] = useState({
    temperature: '--',
    humidity: '--',
    gasLevel: '--',
    distance: '--',
    timestamp: null,
    deviceId: 'rover_001',
    condition: 'Good'
  });
  const [sensorHistory, setSensorHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Listen to Firebase /sensors path
    const sensorsRef = ref(database, 'sensors');
    
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('📡 Firebase data:', data);
        
        const newData = {
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
          gasLevel: data.gasLevel || 0,
          distance: data.distance || 0,
          timestamp: data.timestamp || Date.now(),
          deviceId: data.deviceId || 'rover_001',
          condition: data.condition || 'Good'
        };
        
        setSensorData(newData);
        setLastUpdate(new Date());
        setIsConnected(true);
        
        // Add to history (keep last 50 readings)
        setSensorHistory(prev => {
          const updated = [...prev, newData];
          if (updated.length > 50) {
            return updated.slice(-50);
          }
          return updated;
        });
      } else {
        console.log('⚠️ No data available');
        setIsConnected(false);
      }
    }, (error) => {
      console.error('❌ Firebase error:', error);
      setIsConnected(false);
    });

    return () => unsubscribe();
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
            <p>Civil Engineering Department - 2025 • Firebase Mode</p>
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
                {getTempStatus(sensorData.temperature) === 'normal' ? 'Normal Range' : 
                 getTempStatus(sensorData.temperature) === 'cold' ? 'Below Normal' : 'Above Normal'}
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
                {getHumidityStatus(sensorData.humidity) === 'normal' ? 'Comfortable' : 
                 getHumidityStatus(sensorData.humidity) === 'dry' ? 'Too Dry' : 'Too Humid'}
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

        {/* Live Sensor Charts */}
        <SensorCharts history={sensorHistory} />

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
            {getGasStatus(sensorData.gasLevel) === 'warning' && (
              <div className="alert warning">
                <AlertTriangle size={16} />
                <span>WARNING: Elevated gas level ({sensorData.gasLevel} ppm)</span>
              </div>
            )}
            {getDistanceStatus(sensorData.distance) === 'danger' && (
              <div className="alert danger">
                <AlertTriangle size={16} />
                <span>DANGER: Obstacle too close ({sensorData.distance} cm)</span>
              </div>
            )}
            {getGasStatus(sensorData.gasLevel) === 'safe' && 
             getDistanceStatus(sensorData.distance) === 'clear' && 
             getTempStatus(sensorData.temperature) === 'normal' && (
              <div className="alert safe">
                <CheckCircle size={16} />
                <span>All systems normal • Environment safe</span>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="system-info">
          <div className="info-item">
            <span className="info-label">Device ID</span>
            <span className="info-value">{sensorData.deviceId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Condition</span>
            <span className="info-value">{sensorData.condition}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Connection</span>
            <span className="info-value">{isConnected ? '🟢 Active' : '🔴 Offline'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Data Source</span>
            <span className="info-value">Firebase Realtime DB</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardFirebase;
