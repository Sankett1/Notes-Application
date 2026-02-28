import { createContext, useState, useContext } from 'react';
import { logger } from './logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, role) => {
    const userData = {
      username,
      role, // 'admin' or 'user'
      loginTime: new Date().toLocaleString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    setUser(userData);
    logger.log('LOGIN', `${role.toUpperCase()} logged in: ${username}`);
  };

  const logout = () => {
    if (user) {
      logger.log('LOGOUT', `${user.role.toUpperCase()} logged out: ${user.username}`);
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser, isLoggedIn }}>
      {children}
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
