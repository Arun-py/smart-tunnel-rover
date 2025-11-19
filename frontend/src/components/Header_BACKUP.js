/**/**

 * Header Component - Simplified (No Theme Toggle) * Header Component

 */ */



import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';import { useAuth } from '../context/AuthContext';

import './Header.css';import './Header.css';



function Header({ isConnected, onNavigateToHome }) {function Header({ isConnected, onNavigateToHome }) {

  const { user, logout } = useAuth();  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());



  // Update time every second  // Update time every second

  useEffect(() => {  useEffect(() => {

    const timer = setInterval(() => {    const timer = setInterval(() => {

      setCurrentTime(new Date().toLocaleTimeString());      setCurrentTime(new Date().toLocaleTimeString());

    }, 1000);    }, 1000);



    return () => clearInterval(timer);    return () => clearInterval(timer);

  }, []);  }, []);



  const handleLogout = () => {  const handleLogout = () => {

    logout();    logout();

    if (onNavigateToHome) {    if (onNavigateToHome) {

      onNavigateToHome();      onNavigateToHome();

    }    }

  };  };



  return (  return (

    <header className="header">    <header className="header">

      <div className="header-content">      <div className="header-content">

        <div className="header-left">        <div className="header-left">

          <div className="logo">          <div className="logo">

            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

              <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>              <path d="M5 17h14v-5l-1.5-1.5L16 9h-3V6c0-.55-.45-1-1-1s-1 .45-1 1v3H8L6.5 10.5 5 12v5z"/>

              <circle cx="7.5" cy="17" r="1.5"/>              <circle cx="7.5" cy="17" r="1.5"/>

              <circle cx="16.5" cy="17" r="1.5"/>              <circle cx="16.5" cy="17" r="1.5"/>

            </svg>            </svg>

            <h1>RoadScan Command Center</h1>            <h1>RoadScan Command Center</h1>

          </div>          </div>

          <p className="subtitle">Autonomous Obstacle Detection Vehicle</p>          <p className="subtitle">Autonomous Pavement Quality & Safety Inspector</p>

        </div>        </div>

                

        <div className="header-right">        <div className="header-right">

          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>

            <div className="status-dot"></div>            <div className="status-dot"></div>

            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>

          </div>          </div>

                    </div>

          <div className="time-display">          

            {currentTime}          <div className="time-display">

          </div>            {currentTime}

          </div>

          {user && (

            <div className="user-section">          {user && (

              <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor">            <div className="user-section">

                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>              <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor">

              </svg>                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>

              <span className="user-name">{user.name}</span>              </svg>

              <button className="logout-button" onClick={handleLogout}>              <span className="user-name">{user.name}</span>

                Logout              <button className="logout-button" onClick={handleLogout}>

              </button>                Logout

            </div>              </button>

          )}            </div>

        </div>          )}

      </div>        </div>

    </header>      </div>

  );    </header>

}  );

}

export default Header;

export default Header;
