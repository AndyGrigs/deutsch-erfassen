import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // This will be proxied to localhost:3000 by Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically adds JWT token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Return structured error
    const apiError: ApiError = {
      status: 'error',
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
    };
    
    return Promise.reject(apiError);
  }
);

export default api;