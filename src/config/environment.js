// Environment configuration
const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://nextgame.onrender.com',
    timeout: 30000,
  },
  
  // App Configuration
  app: {
    name: 'Mella Ludo Admin Panel',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
  
  // Feature Flags
  features: {
    enableNotifications: true,
    enableRealTimeUpdates: true,
    enableErrorReporting: import.meta.env.PROD,
  },
  
  // UI Configuration
  ui: {
    toastDuration: 5000,
    paginationLimit: 20,
    refreshInterval: 60000, // 1 minute
  }
};

// Validate required environment variables
const requiredEnvVars = [
  // Add any required environment variables here
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Missing environment variables:', missingEnvVars);
}

export default config; 