import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('capacity_connect_user');
      const token = localStorage.getItem('capacity_connect_token');
      return saved && token ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('capacity_connect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('capacity_connect_user');
    }
  }, [user]);

  useEffect(() => {
    const isBackendUser = user?._id
      && !user._id.startsWith('demo-')
      ;
    if (!isBackendUser) return undefined;

    const checkAccess = async () => {
      try {
        const response = await api.getUsers();
        const currentUser = response?.users?.find((candidate) => candidate._id === user._id);
        if (currentUser && currentUser.status !== 'Approved') {
          setError('Account access disabled. Please contact an administrator.');
          setUser(null);
        }
      } catch (err) {
        console.warn('Could not verify account access:', err);
      }
    };

    const accessInterval = window.setInterval(checkAccess, 5000);
    return () => window.clearInterval(accessInterval);
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      if (res?.success && res.user) {
        if (res.token) localStorage.setItem('capacity_connect_token', res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (err) {
      const msg = err.message || 'Unable to connect to server';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(userData);
      return { success: true, message: res.message, user: res.user };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('capacity_connect_user');
    localStorage.removeItem('capacity_connect_token');
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  const switchDemoRole = async (targetRole) => {
    // Simulate network delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    const updated = user
      ? { ...user, role: targetRole }
      : {
          _id: 'demo-123',
          name: 'Demo User',
          email: 'demo@example.com',
          role: targetRole,
          status: 'Approved',
        };
    setUser(updated);
    try {
      localStorage.setItem('capacity_connect_user', JSON.stringify(updated));
    } catch {
      // ignore storage failure
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        updateUser,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
