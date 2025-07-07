// Development-only admin configuration
// This file should not be included in production builds

export const DEV_ADMIN_CONFIG = {
  // Only available in development mode
  isDevelopment: process.env.NODE_ENV === "development",

  // Default admin credentials (development only)
  defaultCredentials: {
    username: "superadmin",
    password: "SuperAdmin123!",
  },

  // Rate limiting settings
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    developmentMaxAttempts: 50,
    developmentWindowMs: 5 * 60 * 1000, // 5 minutes
  },
};

// Helper function to check if we're in development
export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

// Helper function to get default credentials (development only)
export const getDefaultCredentials = () => {
  if (!isDevelopment()) {
    return null;
  }
  return DEV_ADMIN_CONFIG.defaultCredentials;
};
