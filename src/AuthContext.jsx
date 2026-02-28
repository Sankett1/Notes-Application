import { createContext, useState, useContext, useEffect } from 'react';
import { logger } from './logger';

const AuthContext = createContext();

// Demo user database stored in localStorage
const initializeDemoUsers = () => {
  const existing = localStorage.getItem('demoUsers');
  if (!existing) {
    const demoUsers = {
      users: [
        {
          _id: 'user1',
          username: 'john',
          email: 'john@example.com',
          password: 'password123',
          role: 'user',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'user2',
          username: 'jane',
          email: 'jane@example.com',
          password: 'password123',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ],
      admins: [
        {
          _id: 'admin1',
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          department: 'Management',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'admin2',
          username: 'admin001',
          email: 'admin001@example.com',
          password: 'admin@123',
          role: 'admin',
          department: 'Administration',
          createdAt: new Date().toISOString()
        }
      ]
    };
    localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
  }
};

const getDemoUsers = () => {
  const data = localStorage.getItem('demoUsers');
  return data ? JSON.parse(data) : { users: [], admins: [] };
};

const saveDemoUsers = (data) => {
  localStorage.setItem('demoUsers', JSON.stringify(data));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize demo users and check if user is already logged in
  useEffect(() => {
    initializeDemoUsers();
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to restore user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, isAdmin = false) => {
    try {
      const allUsers = getDemoUsers();
      const userList = isAdmin ? allUsers.admins : allUsers.users;
      
      // Find user by username
      const foundUser = userList.find(u => u.username === username);
      
      if (!foundUser) {
        return { success: false, message: 'Username not found' };
      }
      
      // Check password
      if (foundUser.password !== password) {
        logger.log('LOGIN_FAILED', `Failed login attempt for: ${username}`);
        return { success: false, message: 'Invalid password' };
      }
      
      // Successful login
      const userData = {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        department: foundUser.department
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      logger.log('LOGIN', `${userData.role.toUpperCase()} logged in: ${userData.username}`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const signup = async (username, email, password, role = 'user', department = null) => {
    try {
      const allUsers = getDemoUsers();
      
      // Check if username already exists
      const userExists = [...allUsers.users, ...allUsers.admins].some(
        u => u.username === username
      );
      
      if (userExists) {
        return { success: false, message: 'Username already exists' };
      }
      
      // Check if email already exists
      const emailExists = [...allUsers.users, ...allUsers.admins].some(
        u => u.email === email
      );
      
      if (emailExists) {
        return { success: false, message: 'Email already registered' };
      }
      
      // Create new user
      const newUser = {
        _id: `user_${Date.now()}`,
        username,
        email,
        password, // In production, this would be hashed
        role,
        department: role === 'admin' ? department : null,
        createdAt: new Date().toISOString()
      };
      
      // Add to appropriate list
      if (role === 'admin') {
        allUsers.admins.push(newUser);
      } else {
        allUsers.users.push(newUser);
      }
      
      saveDemoUsers(allUsers);
      
      // Auto-login after signup
      const userData = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      logger.log('LOGIN', `New ${userData.role} signed up: ${userData.username}`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Signup failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        logger.log('LOGOUT', `${user.role.toUpperCase()} logged out: ${user.username}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('currentUser');
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
