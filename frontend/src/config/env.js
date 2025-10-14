export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // Registration Code (for development)
  REGISTRATION_CODE: import.meta.env.VITE_REGISTRATION_CODE || 'DEV123456',
  
  // App Configuration
  APP_NAME: 'Semed Livingcare',
  APP_VERSION: '1.0.0'
}
