// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config/config';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const signOut = () => {
    // Clear local token first
    setToken(null);
    
    // Construct Cognito sign-out URL
    const cognitoDomain = `https://${config.COGNITO_DOMAIN}.auth.${config.REGION}.amazoncognito.com`;
    const logoutUri = encodeURIComponent(`${window.location.origin}`);
    
    // Construct the sign-out URL with all required parameters
    const signOutUrl = new URL(`${cognitoDomain}/logout`);
    signOutUrl.searchParams.append('client_id', config.USER_POOL_CLIENT_ID);
    signOutUrl.searchParams.append('logout_uri', logoutUri);
    signOutUrl.searchParams.append('response_type', 'code');
    
    // Redirect to Cognito sign-out
    window.location.href = signOutUrl.toString();
  };

  const value = {
    token,
    setToken,
    signOut,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};