import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure Axios defaults
  axios.defaults.baseURL = ''; // Handled by Vite reverse proxy
  
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/users/profile');
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (err) {
          console.error('Error loading session profile', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Register Creator
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', userData);
      if (res.data.success) {
        const { token, user: newUser } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(newUser);
        toast.success('Registration successful!');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', credentials);
      if (res.data.success) {
        const { token, user: loggedUser } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(loggedUser);
        toast.success(`Welcome back, ${loggedUser.name}!`);
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.warn('Backend logout failed', err);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  // Update Profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('/api/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setUser(res.data.data);
        toast.success('Profile updated successfully!');
        return true;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      toast.error(msg);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
