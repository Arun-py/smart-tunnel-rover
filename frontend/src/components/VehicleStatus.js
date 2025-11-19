/**
 * Vehicle Status Component
 */

import React from 'react';
import './VehicleStatus.css';

function VehicleStatus({ status, potholeDetected }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'Patrolling':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
            <circle cx="7" cy="17" r="2" fill="currentColor" />
            <circle cx="17" cy="17" r="2" fill="currentColor" />
            <path d="M5 11V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" />
          </svg>
        );
      case 'Obstacle Detected':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 22h20L12 2z" />
            <path d="M12 9v4" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        );
      case 'Stopped':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <rect x="8" y="8" width="8" height="8" fill="white" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Patrolling':
        return 'var(--accent-green)';
      case 'Obstacle Detected':
        return 'var(--accent-orange)';
      case 'Stopped':
        return 'var(--accent-red)';
      default:
        return 'var(--accent-blue)';
    }
  };

  return (
    <div className="vehicle-status-card">
      <div className="card-header">
        <span className="card-icon">{getStatusIcon()}</span>
        <h3 className="card-title">Vehicle Status</h3>
      </div>
      
      <div className="card-body">
        <div 
          className="status-text" 
          style={{ color: getStatusColor() }}
        >
          {status}
        </div>
        
        {potholeDetected && (
          <div className="pothole-alert">
            <span className="alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="16" r="6" />
                <circle cx="12" cy="16" r="2" />
              </svg>
            </span>
            <span className="alert-text">Pothole Detected!</span>
          </div>
        )}
      </div>
      
      <div className="status-bar">
        <div 
          className="status-fill" 
          style={{ 
            width: status === 'Patrolling' ? '100%' : '50%',
            background: getStatusColor()
          }}
        ></div>
      </div>
    </div>
  );
}

export default VehicleStatus;
