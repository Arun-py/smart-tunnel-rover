/**
 * Landing Page Component
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

function LandingPage({ onNavigateToDashboard }) {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>
              <circle cx="7.5" cy="17" r="1.5"/>
              <circle cx="16.5" cy="17" r="1.5"/>
            </svg>
            ITS Project 2025
          </div>
          <h1 className="hero-title">
            Project <span className="gradient-text">RoadScan</span>
          </h1>
          <p className="hero-subtitle">
            Autonomous Pavement Quality & Safety Inspector
          </p>
          <p className="hero-description">
            An Intelligent Transport System (ITS) for real-time road hazard detection
            and infrastructure monitoring using autonomous vehicles and IoT technology.
          </p>
          <button className="cta-button" onClick={onNavigateToDashboard}>
            Open Command Center →
          </button>
        </div>
        <div className="hero-animation">
          <svg className="vehicle-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>
            <circle cx="7.5" cy="17" r="1.5"/>
            <circle cx="16.5" cy="17" r="1.5"/>
          </svg>
          <div className="scan-line"></div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="section objectives">
        <h2 className="section-title">
          <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Project Objectives
        </h2>
        <div className="objectives-grid">
          <div className="objective-card">
            <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"/>
            </svg>
            <h3>Autonomous Navigation</h3>
            <p>Self-driving vehicle with intelligent obstacle detection and avoidance using ultrasonic sensors and servo scanning.</p>
          </div>
          <div className="objective-card">
            <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <h3>Defect Detection</h3>
            <p>Real-time pavement defect identification using IR sensors to detect potholes and surface irregularities.</p>
          </div>
          <div className="objective-card">
            <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z"/>
            </svg>
            <h3>Environmental Monitoring</h3>
            <p>Track temperature and humidity data to analyze environmental factors affecting road degradation.</p>
          </div>
          <div className="objective-card">
            <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity=".3"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
            </svg>
            <h3>V2I Communication</h3>
            <p>Vehicle-to-Infrastructure communication via WiFi for real-time data transmission to cloud dashboard.</p>
          </div>
          <div className="objective-card">
            <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 9H5V5h10m-3 14c.83 0 1.5-.67 1.5-1.5S12.83 16 12 16s-1.5.67-1.5 1.5.67 1.5 1.5 1.5m3-16H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h2v2H6v2h12v-2h-2v-2h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <h3>Data Management</h3>
            <p>MongoDB database integration for persistent storage, analytics, and historical data tracking.</p>
          </div>
          <div className="objective-card">
            <svg className="objective-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <h3>Live Visualization</h3>
            <p>Real-time web dashboard with interactive hazard maps, sensor graphs, and event logging.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section tech-stack">
        <h2 className="section-title">
          <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
          Technology Stack
        </h2>
        <div className="tech-grid">
          <div className="tech-category">
            <h3>Hardware Layer</h3>
            <div className="tech-items">
              <span className="tech-badge">ESP32</span>
              <span className="tech-badge">L298N Motor Driver</span>
              <span className="tech-badge">HC-SR04 Ultrasonic</span>
              <span className="tech-badge">FC-51 IR Sensor</span>
              <span className="tech-badge">DHT22</span>
              <span className="tech-badge">SG90 Servo</span>
            </div>
          </div>
          <div className="tech-category">
            <h3>Backend</h3>
            <div className="tech-items">
              <span className="tech-badge node">Node.js</span>
              <span className="tech-badge express">Express.js</span>
              <span className="tech-badge mongo">MongoDB</span>
              <span className="tech-badge socketio">Socket.IO</span>
              <span className="tech-badge">Mongoose</span>
            </div>
          </div>
          <div className="tech-category">
            <h3>Frontend</h3>
            <div className="tech-items">
              <span className="tech-badge react">React.js</span>
              <span className="tech-badge">Chart.js</span>
              <span className="tech-badge css">CSS3</span>
              <span className="tech-badge">WebSocket</span>
            </div>
          </div>
          <div className="tech-category">
            <h3>Firmware</h3>
            <div className="tech-items">
              <span className="tech-badge">Arduino C++</span>
              <span className="tech-badge">WiFi Library</span>
              <span className="tech-badge">ArduinoJson</span>
              <span className="tech-badge">HTTPClient</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works">
        <h2 className="section-title">
          <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          How It Works
        </h2>
        <div className="workflow">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Data Collection</h3>
              <p>ESP32 autonomous vehicle patrols designated areas, continuously reading sensor data (temperature, humidity, distance, surface defects).</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          
          <div className="workflow-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Obstacle Avoidance</h3>
              <p>Ultrasonic sensor scans 180° using servo. When obstacles detected (&lt;20cm), vehicle stops, scans, and navigates around them.</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          
          <div className="workflow-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Data Transmission</h3>
              <p>Every 2 seconds, sensor data is packaged as JSON and sent via WiFi HTTP POST to Node.js backend server.</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          
          <div className="workflow-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Cloud Processing</h3>
              <p>Backend validates, stores data in MongoDB, detects hazards (potholes/obstacles), and broadcasts via Socket.IO.</p>
            </div>
          </div>
          <div className="workflow-arrow">→</div>
          
          <div className="workflow-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>Real-time Display</h3>
              <p>React dashboard updates instantly via WebSocket, showing sensor readings, hazard map markers, and event logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team">
        <h2 className="section-title">
          <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Project Team
        </h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">AG</div>
            <h3>Aadeesh G</h3>
            <p className="member-id">727723EUCV001</p>
            <p className="member-role">Hardware & Firmware Lead</p>
            <div className="member-contributions">
              <span>ESP32 Programming</span>
              <span>Sensor Integration</span>
              <span>Motor Control</span>
            </div>
          </div>
          
          <div className="team-member">
            <div className="member-avatar">PS</div>
            <h3>Pradeesh S</h3>
            <p className="member-id">727723EUCV040</p>
            <p className="member-role">Backend & Database Lead</p>
            <div className="member-contributions">
              <span>Node.js API</span>
              <span>MongoDB Schema</span>
              <span>Socket.IO Integration</span>
            </div>
          </div>
          
          <div className="team-member">
            <div className="member-avatar">SK</div>
            <h3>Santhosh Kumar K</h3>
            <p className="member-id">727723EUCV050</p>
            <p className="member-role">Frontend & UI/UX Lead</p>
            <div className="member-contributions">
              <span>React Dashboard</span>
              <span>Real-time Visualization</span>
              <span>Responsive Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features">
        <h2 className="section-title">
          <svg className="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          Key Features
        </h2>
        <div className="features-grid">
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Real-time sensor data visualization</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Interactive hazard map with markers</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Temperature & humidity graphs</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Vehicle path tracking</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Event logging & history</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>MongoDB data persistence</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Dark/Light mode toggle</span>
          </div>
          <div className="feature-item">
            <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Responsive mobile design</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>
                <circle cx="7.5" cy="17" r="1.5"/>
                <circle cx="16.5" cy="17" r="1.5"/>
              </svg>
              RoadScan
            </h3>
            <p>Making roads safer, one scan at a time.</p>
          </div>
          <div className="footer-info">
            <p>Intelligent Transport System (ITS) Project</p>
            <p>ECE Department • 2025</p>
            <p className="footer-user">
              {user && `Logged in as: ${user.name}`}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 RoadScan Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
