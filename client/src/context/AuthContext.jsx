import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('coffeeridge_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.error('Session expired, clearing token:', err);
          localStorage.removeItem('coffeeridge_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // Default to guest mode
        setUser({ role: 'guest', fullName: 'Guest Visitor' });
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('coffeeridge_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const demoLogin = async (targetRole) => {
    if (targetRole === 'guest') {
      localStorage.removeItem('coffeeridge_token');
      setToken(null);
      setUser({ role: 'guest', fullName: 'Guest Visitor' });
      return;
    }
    const data = await api.demoLogin(targetRole);
    localStorage.setItem('coffeeridge_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('coffeeridge_token');
    setToken(null);
    setUser({ role: 'guest', fullName: 'Guest Visitor' });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      role: user ? user.role : 'guest',
      isStaff: user && (user.role === 'reservations_staff' || user.role === 'general_manager'),
      isGM: user && user.role === 'general_manager',
      login,
      demoLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
