/**
 * Environment Configuration
 * 
 * This file centralizes all configuration values.
 * Configuration is set directly in this file, not through .env files.
 * 
 * For different environments, you can override these values by setting
 * environment variables during build time (for Docker/Cloud Build).
 */

// ============================================
// CONFIGURATION VALUES
// ============================================
// Set your configuration values directly here

// API Configuration
const DEFAULT_API_URL = 'https://gift-voucher-generator-1082379018873.europe-west1.run.app';

const DEFAULT_API_URL_LOCAL = 'http://localhost:8080';

// Encryption Key Configuration
const DEFAULT_ENCRYPTION_KEY = '8f2c1b7a9e6d4f0a3c5b2e1d8a7f9c6e';

const IS_PRODUCTION = true;

// ============================================
// CONFIGURATION FUNCTIONS
// ============================================

/**
 * Get the API URL
 * Uses environment variable if available, otherwise uses default value from this file
 * @returns {string} The API base URL
 */
export function getApiUrl() {
  // Check if we're in development mode
  // Vite sets import.meta.env.DEV to true in development, false in production builds
  // Also check MODE and the IS_PRODUCTION flag as fallbacks
  const isDev = import.meta.env?.DEV === true || 
                import.meta.env?.MODE === 'development' || 
                (!IS_PRODUCTION && import.meta.env?.PROD !== true);
  
  // In development, use local URL; in production, use production URL
  if (isDev) {
    console.log('🔧 Development mode: Using local API URL:', DEFAULT_API_URL_LOCAL);
    return DEFAULT_API_URL_LOCAL;
  }
  
  // Production mode
  console.log('🚀 Production mode: Using production API URL:', DEFAULT_API_URL);
  return DEFAULT_API_URL;
}

/**
 * Get the encryption key
 * Uses environment variable if available, otherwise uses default value from this file
 * @returns {string} The encryption key
 */
export function getEncryptionKey() {
  // Allow override via environment variable, but use default from this file
  // In Vite, environment variables are accessed via import.meta.env
  const envKey = import.meta.env?.VITE_ENCRYPTION_KEY;
  if (envKey) {
    return envKey;
  }
  return DEFAULT_ENCRYPTION_KEY;
}

/**
 * Check if we're in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return !IS_PRODUCTION;
}

/**
 * Check if we're in production mode
 * @returns {boolean}
 */
export function isProduction() {
  return IS_PRODUCTION;
}

// Export all config values for convenience
export const config = {
  apiUrl: getApiUrl(),
  encryptionKey: getEncryptionKey(),
  isDev: isDevelopment(),
  isProd: isProduction(),
};

