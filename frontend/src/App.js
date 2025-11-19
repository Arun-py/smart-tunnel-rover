/**
 * Main App Component with Mode Selector
 * Smart Tunnel Inspection Rover
 * Supports both HTTP and Firebase modes
 */

import React, { useState } from 'react';
import Dashboard from './Dashboard';
import DashboardFirebase from './DashboardFirebase';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'dashboard'
  
  // Change this to switch between HTTP and Firebase mode
  const USE_FIREBASE_MODE = false; // Set to false for HTTP (working), true for Firebase

  return (
    <div className="App">
      {currentView === 'landing' ? (
        <LandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <>
          {USE_FIREBASE_MODE ? (
            <DashboardFirebase onNavigateToLanding={() => setCurrentView('landing')} />
          ) : (
            <Dashboard onNavigateToLanding={() => setCurrentView('landing')} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
