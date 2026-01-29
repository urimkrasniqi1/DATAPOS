import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Stock from './pages/Stock';
import Users from './pages/Users';
import Branches from './pages/Branches';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';
import SuperAdmin from './pages/SuperAdmin';
import LandingDashboard from './pages/LandingDashboard';

// Layout
import MainLayout from './components/MainLayout';

// Remove Emergent badge
const removeEmergentBadge = () => {
  const badge = document.getElementById('emergent-badge');
  if (badge) badge.remove();
  
  // Also remove any elements with emergent in href
  document.querySelectorAll('a[href*="emergent"]').forEach(el => el.remove());
  
  // Remove fixed position elements that might be badges
  document.querySelectorAll('body > a[style*="position: fixed"]').forEach(el => {
    if (el.textContent?.includes('Emergent') || el.innerHTML?.includes('emergent')) {
      el.remove();
    }
  });
};

// Run on load and periodically
if (typeof window !== 'undefined') {
  removeEmergentBadge();
  setTimeout(removeEmergentBadge, 100);
  setTimeout(removeEmergentBadge, 500);
  setTimeout(removeEmergentBadge, 1000);
  setTimeout(removeEmergentBadge, 2000);
}

// Update page title based on subdomain or tenant
const updatePageTitle = (userData) => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if it's a subdomain (e.g., firma.datapos.pro)
  if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'app') {
    const subdomain = parts[0];
    const companyName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    document.title = `${companyName} - POS`;
  } else if (userData?.role === 'super_admin') {
    document.title = 'DataPOS - Admin';
  } else {
    document.title = 'DataPOS';
  }
};

// Set initial title based on subdomain
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'app') {
    const subdomain = parts[0];
    const companyName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    document.title = `${companyName} - POS`;
  }
}

// Determine backend URL - for desktop app use localhost, otherwise use env variable
const isElectron = window.navigator.userAgent.toLowerCase().includes('electron');
const BACKEND_URL = isElectron ? 'http://127.0.0.1:8001' : (process.env.REACT_APP_BACKEND_URL || '');
const API = `${BACKEND_URL}/api`;

// Get subdomain from current URL
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  // Check if it's a subdomain (e.g., mobilshopurimi.datapos.pro)
  if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'app' && parts[0] !== 'localhost') {
    return parts[0].toLowerCase();
  }
  // Also check for preview URLs (e.g., mobilshopurimi.saaspos-2.preview.emergentagent.com)
  if (parts.length > 3 && parts[0] !== 'www' && parts[0] !== 'app') {
    return parts[0].toLowerCase();
  }
  return null;
};

// Auth Context
const AuthContext = createContext(null);

// Tenant Context for subdomain-based routing
const TenantContext = createContext(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  return context; // Can be null if no subdomain
};

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

// Tenant Provider - Fetches tenant info based on subdomain
const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(false);

  useEffect(() => {
    const subdomain = getSubdomain();
    
    if (!subdomain) {
      return;
    }

    setTenantLoading(true);
    
    // Fetch tenant info from API
    const fetchTenant = async () => {
      try {
        const response = await axios.get(`${API}/tenants/by-subdomain/${subdomain}`);
        setTenant(response.data);
        
        // Update page title with tenant name
        document.title = `${response.data.company_name || response.data.name} - POS`;
        
        // Store tenant context for login
        localStorage.setItem('tenant_context', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch tenant:', error);
        // Don't show error, just continue with default branding
      } finally {
        setTenantLoading(false);
      }
    };

    fetchTenant();
  }, []);

  const value = { tenant, tenantLoading, subdomain: getSubdomain() };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

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
      
      // Update document title based on tenant
      updatePageTitle(userData);
      
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
      {/* Landing Dashboard - Entry Point */}
      <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'cashier' ? '/pos' : '/dashboard'} /> : <LandingDashboard />} />
      
      {/* Registration Page */}
      <Route path="/register" element={isAuthenticated ? <Navigate to={user?.role === 'cashier' ? '/pos' : '/dashboard'} /> : <Register />} />
      
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'cashier' ? '/pos' : '/dashboard'} /> : <Login />} />
      
      {/* Cashier gets POS without MainLayout */}
      <Route path="/pos" element={
        <ProtectedRoute>
          <POS />
        </ProtectedRoute>
      } />
      
      <Route path="/app" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
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
        <Route path="super-admin" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdmin />
          </ProtectedRoute>
        } />
      </Route>

      {/* Legacy routes - redirect to new paths */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/products" element={<Navigate to="/app/products" replace />} />
      <Route path="/stock" element={<Navigate to="/app/stock" replace />} />
      <Route path="/users" element={<Navigate to="/app/users" replace />} />
      <Route path="/branches" element={<Navigate to="/app/branches" replace />} />
      <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/audit-logs" element={<Navigate to="/app/audit-logs" replace />} />
      <Route path="/super-admin" element={<Navigate to="/app/super-admin" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <HashRouter>
      <TenantProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <AppRoutes />
        </AuthProvider>
      </TenantProvider>
    </HashRouter>
  );
}

export default App;
