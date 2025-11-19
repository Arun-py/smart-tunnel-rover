/**
 * Hazard Map Component with Vehicle Path Tracking
 */

import React, { useState, useEffect } from 'react';
import './HazardMap.css';

function HazardMap({ hazards, sensorData }) {
  const [vehiclePath, setVehiclePath] = useState([]);
  const [currentPosition, setCurrentPosition] = useState({ x: 10, y: 10 });
  const gridSize = 20;
  
  // Simulate vehicle movement based on sensor data
  useEffect(() => {
    if (sensorData && sensorData.distance !== '--') {
      // Calculate new position based on distance readings
      // This is a simplified simulation - in real implementation, 
      // you'd use actual GPS or positioning data
      const distance = parseFloat(sensorData.distance);
      const timestamp = Date.now();
      
      setCurrentPosition(prev => {
        // Random walk simulation (replace with actual positioning in production)
        const angle = Math.random() * 2 * Math.PI;
        const step = 0.5; // Movement step size
        
        const newX = Math.max(0, Math.min(gridSize, prev.x + Math.cos(angle) * step));
        const newY = Math.max(0, Math.min(gridSize, prev.y + Math.sin(angle) * step));
        
        const newPosition = {
          x: newX,
          y: newY,
          timestamp,
          distance
        };
        
        // Add to path history
        setVehiclePath(pathHistory => {
          const updatedPath = [...pathHistory, newPosition];
          // Keep last 100 positions
          return updatedPath.slice(-100);
        });
        
        return newPosition;
      });
    }
  }, [sensorData]);
  
  // Generate SVG path from vehicle positions
  const generatePathString = () => {
    if (vehiclePath.length < 2) return '';
    
    const pathCommands = vehiclePath.map((pos, index) => {
      const x = (pos.x / gridSize) * 100;
      const y = (pos.y / gridSize) * 100;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });
    
    return pathCommands.join(' ');
  };
  
  return (
    <div className="hazard-map">
      <div className="map-header">
        <h3 className="map-title">
          <svg className="title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          </svg>
          Hazard Map & Vehicle Tracking
        </h3>
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-marker vehicle"></span>
            <span>Vehicle</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker path"></span>
            <span>Path</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker pothole"></span>
            <span>Pothole</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker obstacle"></span>
            <span>Obstacle</span>
          </div>
        </div>
      </div>
      
      <div className="map-container">
        <div className="map-grid">
          {/* Vehicle Path Trail */}
          {vehiclePath.length > 1 && (
            <svg className="path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(87, 125, 255, 0.2)" />
                  <stop offset="100%" stopColor="rgba(87, 125, 255, 0.8)" />
                </linearGradient>
              </defs>
              <path
                d={generatePathString()}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          
          {/* Path Trail Dots */}
          {vehiclePath.map((pos, index) => (
            <div
              key={`path-${index}`}
              className="path-dot"
              style={{
                left: `${(pos.x / gridSize) * 100}%`,
                top: `${(pos.y / gridSize) * 100}%`,
                opacity: 0.3 + (index / vehiclePath.length) * 0.7 // Fade older positions
              }}
            />
          ))}
          
          {/* Current Vehicle Position */}
          <div
            className="vehicle-marker"
            style={{
              left: `${(currentPosition.x / gridSize) * 100}%`,
              top: `${(currentPosition.y / gridSize) * 100}%`
            }}
            title={`Current Position: (${currentPosition.x.toFixed(1)}, ${currentPosition.y.toFixed(1)})`}
          >
            <svg className="vehicle-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>
              <circle cx="7.5" cy="17" r="1.5"/>
              <circle cx="16.5" cy="17" r="1.5"/>
            </svg>
            <div className="vehicle-pulse"></div>
          </div>
          
          {/* Hazard Markers */}
          {hazards.slice(-50).map((hazard) => (
            <div
              key={hazard.id}
              className={`hazard-marker ${hazard.type} ${hazard.resolved ? 'resolved' : ''}`}
              style={{
                left: `${(hazard.position.x / gridSize) * 100}%`,
                top: `${(hazard.position.y / gridSize) * 100}%`
              }}
              title={`${hazard.type} - ${hazard.timestamp.toLocaleString()}`}
            >
              {hazard.type === 'pothole' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              )}
            </div>
          ))}
        </div>
        
        <div className="map-info">
          <p>
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="17" r="2" fill="currentColor" />
              <circle cx="17" cy="17" r="2" fill="currentColor" />
              <path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" />
            </svg>
            Position: ({currentPosition.x.toFixed(1)}, {currentPosition.y.toFixed(1)})
          </p>
          <p>
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4" strokeLinecap="round" />
            </svg>
            Path Points: {vehiclePath.length}
          </p>
          <p>
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 22h20L12 2z" />
              <path d="M12 9v4" strokeLinecap="round" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
            Active Hazards: {hazards.filter(h => !h.resolved).length}
          </p>
          <p>
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M18 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Total Detected: {hazards.length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HazardMap;
