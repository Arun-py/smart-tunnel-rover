/**
 * Landing Page - Smart Tunnel Inspection Rover
 * Civil Engineering Department - 2025
 */

import React from 'react';
import './LandingPage.css';
import { 
  Activity, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Zap, 
  Cpu,
  Wind,
  Thermometer,
  Eye
} from 'lucide-react';
import bgVideo from '../assets/BG_VIDEO.mp4';

function LandingPage({ onNavigateToDashboard }) {
  const objectives = [
    {
      icon: <Shield size={32} />,
      title: "Safety Enhancement",
      description: "Detect hazardous gas levels and environmental risks in tunnels and parking structures"
    },
    {
      icon: <Thermometer size={32} />,
      title: "Climate Monitoring",
      description: "Real-time temperature and humidity tracking for optimal structural health"
    },
    {
      icon: <Eye size={32} />,
      title: "Obstacle Detection",
      description: "Ultrasonic sensors identify obstacles and maintain safe navigation paths"
    },
    {
      icon: <Wind size={32} />,
      title: "Air Quality Analysis",
      description: "MQ-2 gas sensor monitors toxic fumes and combustible gases continuously"
    },
    {
      icon: <Zap size={32} />,
      title: "Autonomous Operation",
      description: "Timer-based movement patterns ensure complete area coverage without human intervention"
    },
    {
      icon: <Cpu size={32} />,
      title: "Real-time Data",
      description: "Firebase cloud integration provides instant sensor data visualization"
    }
  ];

  const features = [
    "Fully autonomous navigation with obstacle avoidance",
    "Multi-sensor environmental monitoring system",
    "Real-time Firebase cloud data transmission",
    "DHT22 temperature & humidity sensing",
    "MQ-2 combustible gas detection (0-1000 ppm)",
    "HC-SR04 ultrasonic distance measurement",
    "L298N dual motor control for circular inspection",
    "Live dashboard with color-coded alerts"
  ];

  return (
    <div className="landing-page">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Activity className="badge-icon" />
            <span>Civil Engineering Department • 2025</span>
          </div>
          
          <h1 className="hero-title">
            Smart Tunnel & Parking
            <span className="title-highlight"> Safety Inspection</span> Rover
          </h1>
          
          <p className="hero-subtitle">
            Autonomous IoT-based environmental monitoring system for underground infrastructures.
            Powered by ESP32, multi-sensor arrays, and real-time Firebase analytics.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary" onClick={onNavigateToDashboard}>
              <span>Access Dashboard</span>
              <ArrowRight size={20} />
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('objectives').scrollIntoView({ behavior: 'smooth' })}>
              <span>Learn More</span>
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Sensors</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Autonomous</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">1s</div>
              <div className="stat-label">Update Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Aim Section */}
      <section className="aim-section">
        <div className="section-container">
          <div className="section-header">
            <Target className="section-icon" />
            <h2>Project Aim</h2>
          </div>
          <div className="aim-content">
            <p className="aim-text">
              To design and develop an <strong>autonomous inspection rover</strong> equipped with 
              advanced environmental sensors for continuous monitoring of <strong>tunnel and parking infrastructure safety</strong>. 
              The system provides real-time detection of hazardous gas levels, temperature anomalies, 
              humidity variations, and obstacle presence—enabling proactive maintenance and 
              <strong> enhanced public safety</strong> in enclosed civil structures.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="objectives-section" id="objectives">
        <div className="section-container">
          <div className="section-header">
            <CheckCircle className="section-icon" />
            <h2>Key Objectives</h2>
          </div>
          <div className="objectives-grid">
            {objectives.map((obj, index) => (
              <div className="objective-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="objective-icon">{obj.icon}</div>
                <h3>{obj.title}</h3>
                <p>{obj.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <Cpu className="section-icon" />
            <h2>Technical Features</h2>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-item" key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                <CheckCircle className="feature-check" size={20} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="architecture-section">
        <div className="section-container">
          <div className="section-header">
            <Activity className="section-icon" />
            <h2>System Architecture</h2>
          </div>
          <div className="architecture-flow">
            <div className="flow-step">
              <div className="flow-icon">🤖</div>
              <h4>ESP32 Rover</h4>
              <p>Sensors + Motors</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">📡</div>
              <h4>WiFi Connection</h4>
              <p>Multi-network</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">🔥</div>
              <h4>Firebase RTDB</h4>
              <p>Real-time Storage</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-icon">📊</div>
              <h4>Web Dashboard</h4>
              <p>Live Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="specs-section">
        <div className="section-container">
          <div className="specs-grid">
            <div className="spec-card">
              <h3>Hardware Components</h3>
              <ul>
                <li>ESP32 DevKit (WiFi + BLE)</li>
                <li>DHT22 (Temperature/Humidity)</li>
                <li>MQ-2 (Gas Sensor)</li>
                <li>HC-SR04 (Ultrasonic)</li>
                <li>L298N Motor Driver</li>
                <li>DC Motors (4x)</li>
              </ul>
            </div>
            <div className="spec-card">
              <h3>Software Stack</h3>
              <ul>
                <li>Arduino IDE (ESP32 Core)</li>
                <li>Firebase ESP32 Library</li>
                <li>React.js (Dashboard)</li>
                <li>Firebase Realtime DB</li>
                <li>Lucide Icons</li>
                <li>CSS3 Animations</li>
              </ul>
            </div>
            <div className="spec-card">
              <h3>Operational Parameters</h3>
              <ul>
                <li>Movement: 2s forward, 10s scan</li>
                <li>Turn: 0.5s right rotation</li>
                <li>Update Rate: 2 seconds</li>
                <li>Safe Distance: 30 cm</li>
                <li>Gas Threshold: 300 ppm</li>
                <li>Coverage: Circular pattern</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Monitor Your Infrastructure?</h2>
          <p>Access real-time sensor data and environmental analytics</p>
          <button className="btn-cta" onClick={onNavigateToDashboard}>
            <span>Launch Dashboard</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2025 Smart Tunnel Inspection Rover • Civil Engineering Department</p>
          <p>Intelligent Transportation Systems (ITS) Project</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
