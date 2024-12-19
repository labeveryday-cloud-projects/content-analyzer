// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import YouTubeOptimizer from './components/YouTubeOptimizer';
import AuthCallback from './components/AuthCallback';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth callback route */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected route */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <YouTubeOptimizer />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;