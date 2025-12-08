import api from './api';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '@/types';

export const authService = {
  // Register new user
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login user
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Logout user
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/current');
    return response.data.data.user;
  },

  // Save auth data to localStorage
  saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get auth data from localStorage
  getAuthData(): { token: string | null; user: User | null } {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  // Clear auth data from localStorage
  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};