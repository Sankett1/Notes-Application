import { createContext, useState, useContext, useEffect } from 'react';
import { logger } from './logger';
import { api } from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password, isAdmin = false) => {
    try {
      const response = await api.post('/auth/login', {
        [isAdmin ? 'username' : 'username']: username,
        password
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userData._id);
        setUser(userData);
        logger.log('LOGIN', `${userData.role.toUpperCase()} logged in: ${userData.username}`);
        return { success: true, user: userData };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      logger.log('LOGIN_FAILED', `Failed login attempt for: ${username}`);
      return { success: false, message };
    }
  };

  const signup = async (username, email, password, role = 'user', department = null) => {
    try {
      const response = await api.post('/auth/signup', {
        username,
        email,
        password,
        role,
        department: role === 'admin' ? department : null
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userData._id);
        setUser(userData);
        logger.log('LOGIN', `New ${userData.role} signed up: ${userData.username}`);
        return { success: true, user: userData };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await api.post('/auth/logout');
        logger.log('LOGOUT', `${user.role.toUpperCase()} logged out: ${user.username}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      logout, 
      isAdmin, 
      isUser, 
      isLoggedIn,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
