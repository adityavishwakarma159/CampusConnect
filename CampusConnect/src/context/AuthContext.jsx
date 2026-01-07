import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS, ROUTES } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = authService.getStoredUser();
      const isAuthenticated = authService.isAuthenticated();

      if (isAuthenticated && storedUser) {
        // Verify token is still valid by fetching current user
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Store tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      setUser(response.user);

      // Redirect based on first login status
      if (response.isFirstLogin) {
        navigate(ROUTES.FIRST_TIME_SETUP);
      } else {
        // Redirect to appropriate dashboard based on role
        redirectToDashboard(response.user.role);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      navigate(ROUTES.LOGIN);
    }
  };

  const redirectToDashboard = (role) => {
    switch (role) {
      case 'ADMIN':
        navigate(ROUTES.ADMIN_DASHBOARD);
        break;
      case 'FACULTY':
        navigate(ROUTES.FACULTY_DASHBOARD);
        break;
      case 'STUDENT':
        navigate(ROUTES.STUDENT_DASHBOARD);
        break;
      default:
        navigate(ROUTES.LOGIN);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    redirectToDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
