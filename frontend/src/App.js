/**
 * Main App Component
 * Smart Tunnel Inspection Rover - Direct Firebase Dashboard
 */

import React, { useState } from 'react';
import Dashboard from './Dashboard';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'dashboard'

  return (
    <div className="App">
      {currentView === 'landing' ? (
        <LandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard onNavigateToLanding={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

export default App;
