/**
 * Stats Panel Component
 */

import React from 'react';
import './StatsPanel.css';

function StatsPanel({ stats }) {
  return (
    <div className="stats-panel">
      <div className="stat-item">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="16" r="6" />
            <circle cx="12" cy="16" r="2" />
          </svg>
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalPotholes || 0}</div>
          <div className="stat-label">Potholes</div>
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 22h20L12 2z" />
            <path d="M12 9v4" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalObstacles || 0}</div>
          <div className="stat-label">Obstacles</div>
        </div>
      </div>
      
      <div className="stat-item">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="stat-content">
          <div className="stat-value">{stats.dataPoints || 0}</div>
          <div className="stat-label">Data Points</div>
        </div>
      </div>
      
      {stats.avgTemperature && (
        <div className="stat-item">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-8 4 4 4-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgTemperature}°C</div>
            <div className="stat-label">Avg Temperature</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
