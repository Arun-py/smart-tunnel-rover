/**
 * Sensor Card Component
 */

import React from 'react';
import './SensorCard.css';

function SensorCard({ title, value, unit, icon, color, status }) {
  const getStatusClass = () => {
    switch (status) {
      case 'warning':
        return 'status-warning';
      case 'danger':
        return 'status-danger';
      default:
        return 'status-normal';
    }
  };

  const getIconSVG = () => {
    switch (icon) {
      case 'temperature':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            <circle cx="11.5" cy="18" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'humidity':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        );
      case 'distance':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18" strokeLinecap="round" />
            <path d="M3 12l4-4m-4 4l4 4M21 12l-4-4m4 4l-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return icon;
    }
  };

  return (
    <div className={`sensor-card ${getStatusClass()}`}>
      <div className="card-header">
        <span className="card-icon">{getIconSVG()}</span>
        <h3 className="card-title">{title}</h3>
      </div>
      
      <div className="card-body">
        <div className="sensor-value" style={{ color: `var(--accent-${color})` }}>
          {value}
          <span className="unit">{unit}</span>
        </div>
      </div>
      
      <div className={`status-indicator ${getStatusClass()}`}></div>
    </div>
  );
}

export default SensorCard;
