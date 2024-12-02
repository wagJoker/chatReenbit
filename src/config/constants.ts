export const AUTH_CONFIG = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  authEndpoint: '/api/auth',
  tokenStorageKey: 'chat_auth_token'
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000
} as const;