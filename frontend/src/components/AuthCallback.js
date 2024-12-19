// src/components/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          console.log('Exchanging auth code for token');
          
          // Exchange the code for tokens
          const tokenData = await api.exchangeCodeForToken(code);
          
          // Store the ID token
          setToken(tokenData.id_token);
          
          // Navigate after token is set
          navigate('/app', { replace: true });
        } catch (error) {
          console.error('Failed to exchange code:', error);
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, setToken]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white">Completing sign in...</div>
    </div>
  );
};

export default AuthCallback;