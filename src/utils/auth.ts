import { jwtDecode } from 'jwt-decode';
import { AUTH_CONFIG } from '../config/constants';

export interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export const decodeGoogleCredential = (credential: string): GoogleUser => {
  try {
    return jwtDecode(credential);
  } catch (error) {
    throw new Error('Failed to decode Google credential');
  }
};

export const getGoogleClientId = (): string => {
  const clientId = AUTH_CONFIG.googleClientId;
  if (!clientId) {
    throw new Error('Google Client ID is not configured in environment variables');
  }
  return clientId;
};

export const storeAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_CONFIG.tokenStorageKey, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_CONFIG.tokenStorageKey);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_CONFIG.tokenStorageKey);
};