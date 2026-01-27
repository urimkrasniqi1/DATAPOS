import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Stock from './pages/Stock';
import Users from './pages/Users';
import Branches from './pages/Branches';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';

// Layout
import MainLayout from './components/MainLayout';

// Determine backend URL - for desktop app use localhost, otherwise use env variable
const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
const BACKEND_URL = isElectron ? 'http://127.0.0.1:8001' : (process.env.REACT_APP_BACKEND_URL || '');
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// API instance
export const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' }
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('t3next_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('t3next_token');
      localStorage.removeItem('t3next_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is a fresh app start (PWA)
    const isNewSession = sessionStorage.getItem('ipos_session_active') !== 'true';
    
    if (isNewSession) {
      // Clear previous session data for fresh start
      localStorage.removeItem('t3next_token');
      localStorage.removeItem('t3next_user');
      sessionStorage.setItem('ipos_session_active', 'true');
      setLoading(false);
      return;
    }
    
    // Restore session if exists
    const savedUser = localStorage.getItem('t3next_user');
    const savedToken = localStorage.getItem('t3next_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Clear session when app is closed/hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Mark session for reset on next open
        sessionStorage.removeItem('ipos_session_active');
      }
    };

    const handleBeforeUnload = () => {
      // Clear session on close
      sessionStorage.removeItem('ipos_session_active');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('t3next_token', access_token);
      localStorage.setItem('t3next_user', JSON.stringify(userData));
      sessionStorage.setItem('ipos_session_active', 'true');
      setUser(userData);
      toast.success('Mirësevini!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Gabim gjatë kyçjes';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('t3next_token');
    localStorage.removeItem('t3next_user');
    sessionStorage.removeItem('ipos_session_active');
    setUser(null);
    toast.info('U çkyçët me sukses');
  }, []);

  const value = { user, login, logout, loading, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Routes
const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'cashier' ? '/pos' : '/dashboard'} /> : <Login />} />
      
      {/* Cashier gets POS without MainLayout */}
      <Route path="/pos" element={
        <ProtectedRoute>
          <POS />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="stock" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Stock />
          </ProtectedRoute>
        } />
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="branches" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Branches />
          </ProtectedRoute>
        } />
        <Route path="reports" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="audit-logs" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AuditLogs />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton />
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
