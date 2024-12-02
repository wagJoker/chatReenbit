import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { getAuthToken } from './auth';

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchQuote = async (): Promise<{ content: string }> => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return { content: 'Could not fetch quote at this time.' };
  }
};

export default api;