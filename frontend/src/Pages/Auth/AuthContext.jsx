// src/Pages/Auth/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    console.log('🔄 Checking stored user:', storedUser);
    
    if (storedUser && storedUser !== 'undefined') {
      try {
        const userData = JSON.parse(storedUser);
        console.log('✅ Parsed user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('🔐 Logging in user:', userData);
    const userToStore = {
      id: userData.id || userData._id,
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      // Include any other fields you need
      ...userData
    };
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};