import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) loadUser();
    else setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        // Normalize: always store flat user object
        setUser(data.user ? data.user : data);
      } else {
        throw new Error('Invalid profile response');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        setUser(user);
        return response.data;
      } else {
        throw new Error(response.data.error?.message || 'Login failed');
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message ||
                  error.response?.data?.message ||
                  error.message || 'Login failed';
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        setUser(user);
        return response.data;
      } else {
        throw new Error(response.data.error?.message || 'Registration failed');
      }
    } catch (error) {
      const msg = error.response?.data?.error?.message ||
                  error.response?.data?.message ||
                  error.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
