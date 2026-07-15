import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthQueries } from '../../shared/hooks/useAuthQueries';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { useGetUser, useRefreshToken } = useAuthQueries();

  const { data: userData, isLoading: userLoading } = useGetUser();
  const refreshTokenMutation = useRefreshToken();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('tm_access_token');
      if (token) {
        try {
          // Try to get user data
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          // Token might be expired, try to refresh
          try {
            await refreshTokenMutation.mutateAsync();
          } catch (refreshError) {
            // Refresh failed, clear auth
            localStorage.removeItem('tm_access_token');
            localStorage.removeItem('tm_refresh_token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [userData]);

  const login = async (credentials) => {
    // This will be handled by the login mutation
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('tm_access_token');
    localStorage.removeItem('tm_refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading: loading || userLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};