// src/services/api.ts
import { config } from '../config/config';

export const api = {
  exchangeCodeForToken: async (code: string) => {
    try {
      const response = await fetch(`${config.API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',  // Important for CORS with credentials
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Token exchange failed: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Token exchange request failed: ${error.message}`);
    }
  },

  analyze: async (transcriptKey: string, analysisType: 'seo' | 'blog', token: string) => {
    try {
      const response = await fetch(`${config.API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',  // Important for CORS with credentials
        body: JSON.stringify({
          transcriptKey,
          analysisType
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Analysis failed: ${response.status} - ${errorData.message || response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      throw new Error(`Analysis request failed: ${error.message}`);
    }
  }
};