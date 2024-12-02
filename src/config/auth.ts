export const authConfig = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  tokenExpiration: '7d'
};