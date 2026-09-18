import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Use environment variable with fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  // Ensure no trailing slash
  const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

  console.log('🔗 API URL:', cleanApiUrl); // Debug - remove in production

  // Configure axios defaults
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${cleanApiUrl}/auth/login`, { email, password });
      const { token, user } = response.data;

      if (!user.isApproved && user.role === 'agent') {
        toast.error('Account pending admin approval');
        return { success: false, message: 'Pending approval' };
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success('Login successful');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      console.error('Login error:', error.response?.data || error.message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${cleanApiUrl}/auth/register`, userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message);
      console.error('Register error:', error.response?.data || error.message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  };

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${cleanApiUrl}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Load user error:', error.response?.data || error.message);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
    isUser: user?.role === 'user',
    hasPermission: (permission) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      if (user.role === 'agent' && user.isApproved) {
        return user.permissions?.[permission] || false;
      }
      return false;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};