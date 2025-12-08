import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginFormData, RegisterFormData } from '@/types';
import { authService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      const { token, user: savedUser } = authService.getAuthData();
      
      if (token && savedUser) {
        setUser(savedUser);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    const response = await authService.login(data);
    const { token, user: userData } = response.data;

    // Save to localStorage
    authService.saveAuthData(token, userData);

    // Update state
    setUser(userData);
  };

  const register = async (data: RegisterFormData) => {
    const response = await authService.register(data);
    const { token, user: userData } = response.data;

    // Save to localStorage
    authService.saveAuthData(token, userData);

    // Update state
    setUser(userData);
  };

  const logout = () => {
    authService.logout().catch(() => {
      // Even if API call fails, clear local data
    });
    
    authService.clearAuthData();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};