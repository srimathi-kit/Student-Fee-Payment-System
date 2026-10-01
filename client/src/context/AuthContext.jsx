import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const localUser = JSON.parse(userInfoStr);
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${localUser.token}` }
          });
          const data = await res.json();
          if (data.success) {
            const updatedUser = { ...data.data, token: localUser.token };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
          } else {
            setUser(null);
            localStorage.removeItem('userInfo');
          }
        } catch (err) {
          console.error('Session restore failed', err);
          setUser(null);
          localStorage.removeItem('userInfo');
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (id, password, role) => {
    try {
      const endpoint = role === 'admin' ? '/api/auth/admin/login' : '/api/auth/student/login';
      const body = role === 'admin' ? { email: id, password } : { studentId: id, password };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const resData = await response.json();

      if (response.ok && resData.success) {
        setUser(resData.data);
        localStorage.setItem('userInfo', JSON.stringify(resData.data));
        if(resData.data.role === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');
      } else {
        throw new Error(resData.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};