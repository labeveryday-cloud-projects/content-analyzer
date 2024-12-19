// src/config/config.ts
export const config = {
    REGION: process.env.REACT_APP_REGION || 'us-east-1',
    COGNITO_DOMAIN: process.env.REACT_APP_COGNITO_DOMAIN,
    API_URL: process.env.REACT_APP_API_ENDPOINT,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    USER_POOL_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID
  };