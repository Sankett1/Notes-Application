import { createContext, useState, useContext, useEffect } from 'react';
import { api } from './api';
import { logger } from './logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // try to restore user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    if (token && savedUser) {
      // set token header for api
      // interceptor already picks it up from localStorage
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const res = await api.post('/auth/login', {
        username: usernameOrEmail,
        email: usernameOrEmail,
        password
      });

      const { token, user: userData } = res.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      logger.log('LOGIN', `${userData.role.toUpperCase()} logged in: ${userData.username}`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const signup = async (username, email, password, role = 'user', department = null) => {
    try {
      const res = await api.post('/auth/signup', { username, email, password, role, department });
      const { token, user: userData } = res.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      logger.log('LOGIN', `New ${userData.role} signed up: ${userData.username}`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup error:', error);
      const data = error.response?.data;
      let message = 'Signup failed';
      if (data) {
        if (typeof data.message === 'string') {
          message = data.message;
        }
        if (Array.isArray(data.details)) {
          message = data.details.join(', ');
        }
      }
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
      localStorage.removeItem('currentUser');
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin, isUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
