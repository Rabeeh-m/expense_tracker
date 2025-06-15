import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/auth/users/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
            isStaff: res.data.is_staff || false, // Ensure isStaff is included
            token,
          });
          setLoading(false);
        } catch (error) {
          console.error('Failed to restore user:', error.response?.data || error.message);
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    restoreUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/jwt/create/', { username, password });
      const token = res.data.access;
      localStorage.setItem('token', token);
      const userRes = await axios.get('http://localhost:8000/api/auth/users/me/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        id: userRes.data.id,
        username: userRes.data.username,
        email: userRes.data.email,
        isStaff: userRes.data.is_staff || false,
        token,
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return false;
    }
  };

  const register = async (username, email, password, password2) => {
    try {
      if (!username || !email || !password || !password2) {
        throw new Error('All fields are required');
      }
      await axios.post('http://localhost:8000/api/auth/users/', {
        username,
        email,
        password,
        re_password: password2,
      });
      return true;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

