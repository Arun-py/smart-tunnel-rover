/**
 * Header Component - Smart Tunnel Inspection Rover
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ isConnected, onNavigateToHome }) {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="home-btn" onClick={onNavigateToHome} title="Back to Home">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Home</span>
        </button>
        <div className="header-logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>
            <circle cx="7.5" cy="17" r="1.5"/>
            <circle cx="16.5" cy="17" r="1.5"/>
          </svg>
          <div className="logo-text">
            <h1>Tunnel Inspection Rover</h1>
            <p className="subtitle">ITS Safety System</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="time-display">
          <svg className="time-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>

        {user && (
          <div className="user-section">
            <div className="user-info">
              <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="user-name">{user.name}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
