// utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // This will be proxied to http://localhost:5000/api
});

// ✅ Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log('Request data:', config.data);
  
  return config;
});

// ✅ Handle token expiration and errors
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
    console.error('Error details:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔐 Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;