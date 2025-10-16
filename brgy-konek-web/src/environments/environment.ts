export const environment = {
  production: false,
  // Local development - backend runs on localhost:2000
  apiUrl: 'http://localhost:2000/api',
  baseUrl: 'http://localhost:2000/',
  
  // Alternative: If you want to use the production API for development
  // apiUrl: 'https://brgykonekapi.up.railway.app/api',
  // baseUrl: 'https://brgykonekapi.up.railway.app/',
  
  // Development-specific settings
  debug: true,
  logLevel: 'debug'
};
