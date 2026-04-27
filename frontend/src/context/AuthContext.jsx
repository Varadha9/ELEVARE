// React hooks and context API for global auth state management
import { createContext, useContext, useState, useEffect } from 'react';
// Import auth API calls
import { authAPI } from '../services/api';

// AuthContext — shared state container for user authentication across the entire app
const AuthContext = createContext();

// useAuth — custom hook that provides easy access to auth state in any component
// Throws an error if used outside of AuthProvider to catch developer mistakes early
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// AuthProvider — wraps the entire app to provide auth state to all child components
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);    // Stores the logged-in user object
  const [loading, setLoading] = useState(true);    // True while checking for existing session

  // On mount — check if a token exists in localStorage and load the user profile
  // This restores the session after a page refresh without requiring re-login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(); // Token exists — fetch user data from backend
    } else {
      setLoading(false); // No token — skip loading, show login page
    }
  }, []);

  // loadUser — fetches the authenticated user's profile using the stored JWT
  // Called on app startup and after login/register to populate the user state
  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        throw new Error('Invalid profile response');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      // Token is invalid or expired — clear it and reset user state
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false); // Always stop loading regardless of success/failure
    }
  };

  // login — authenticates the user and stores the JWT in localStorage
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token); // Persist token for future page loads
        setUser({ user });
        return response.data;
      } else {
        throw new Error(response.data.error?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Extract the most specific error message available
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Login failed';
      throw new Error(errorMessage);
    }
  };

  // register — creates a new account and immediately logs the user in
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        setUser({ user });
        return response.data;
      } else {
        throw new Error(response.data.error?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'Registration failed';
      throw new Error(errorMessage);
    }
  };

  // logout — clears the session both locally and on the server
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state even if the server call fails
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Expose auth state and actions to all child components via context
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadUser // Exposed so components can manually refresh user data
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
