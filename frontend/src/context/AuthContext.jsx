import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  Trainee: {
    name: 'Jason Ranti',
    email: 'jason.ranti@coursue.com',
    password: 'trainee@123',
    role: 'Trainee',
    title: 'Product Designer',
  },
  Trainer: {
    name: 'Priya Nair',
    email: 'priya.nair@capacityconnect.in',
    password: 'trainer@123',
    role: 'Trainer',
    title: 'Senior Learning Specialist',
  },
  Admin: {
    name: 'Arjun Mehta',
    email: 'admin@capacityconnect.in',
    password: 'admin@123',
    role: 'Admin',
    title: 'Platform Administrator',
  },
};

const DEFAULT_USER = {
  _id: 'user-jason',
  name: 'Jason Ranti',
  email: 'jason.ranti@coursue.com',
  role: 'Trainee',
  status: 'Approved',
  profile: {
    designation: 'Product Designer',
    department: 'Design',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('capacity_connect_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
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

  const switchDemoRole = async (targetRole) => {
    const creds = DEMO_ACCOUNTS[targetRole];
    if (!creds) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.login(creds.email, creds.password);
      if (res?.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Failed to switch demo role');
    } catch (err) {
      if (err.status) {
        const msg = err.message || 'Unable to switch demo role';
        setError(msg);
        return { success: false, message: msg };
      }
      console.warn('Backend login switch failed, using local demo profile:', err.message);
      // Fallback local mock user so UI remains fully testable even if offline
      const mockUser = {
        _id: `demo-${targetRole.toLowerCase()}`,
        name: creds.name,
        email: creds.email,
        role: targetRole,
        status: 'Approved',
        profile: {
          designation: creds.title,
          department: targetRole === 'Admin' ? 'IT' : targetRole === 'Trainer' ? 'Human Resources' : 'Operations',
        },
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('capacity_connect_user');
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

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
