import axios from 'axios';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store token in localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - token expired or invalid
    if (error.response?.status === 401) {
      // only redirect if we actually sent a token
      if (getToken()) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;