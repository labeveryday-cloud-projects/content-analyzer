// src/components/Auth.tsx
import React from 'react';
import { config } from '../config/config';

const Auth = () => {
  const signIn = () => {
    const cognitoDomain = `https://${config.COGNITO_DOMAIN}.auth.${config.REGION}.amazoncognito.com`;
    const redirectUri = 'http://localhost:3000/auth/callback';
    
    const queryParams = new URLSearchParams({
      client_id: config.USER_POOL_CLIENT_ID,
      response_type: 'code',
      scope: 'email openid profile',
      redirect_uri: redirectUri,
    });

    window.location.href = `${cognitoDomain}/login?${queryParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="max-w-md w-full p-6">
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to optimize your YouTube content</p>
          </div>
          
          <button
            onClick={signIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Sign in with Cognito
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={signIn}
              className="text-blue-500 hover:text-blue-400"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;