/**
 * Authentication Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Single demo user
const DEMO_USER = {
  username: 'admin',
  password: 'roadscan123',
  name: 'Admin User',
  email: 'admin@roadscan.com'
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('roadscan-auth') === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('roadscan-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      const userData = {
        username: DEMO_USER.username,
        name: DEMO_USER.name,
        email: DEMO_USER.email
      };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('roadscan-auth', 'true');
      localStorage.setItem('roadscan-user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('roadscan-auth');
    localStorage.removeItem('roadscan-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
