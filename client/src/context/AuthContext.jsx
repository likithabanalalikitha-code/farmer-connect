import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fmc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('fmc_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state to localStorage
  const saveSession = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('fmc_user', JSON.stringify(userData));
    localStorage.setItem('fmc_token', userToken);
  };

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fmc_user');
    localStorage.removeItem('fmc_token');
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    saveSession(res.data.user, res.data.token);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    saveSession(res.data.user, res.data.token);
    return res.data.user;
  };

  const logout = () => {
    clearSession();
  };

  const refreshProfile = async () => {
    try {
      const res = await userService.getProfile();
      setUser(res.data.user);
      localStorage.setItem('fmc_user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      if (err.message && err.message.includes('expired')) {
        clearSession();
      }
      throw err;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          await refreshProfile();
        } catch {
          // Handled in refreshProfile
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      clearSession();
    };

    window.addEventListener('fmc_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('fmc_unauthorized', handleUnauthorized);
  }, [token, clearSession]);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
