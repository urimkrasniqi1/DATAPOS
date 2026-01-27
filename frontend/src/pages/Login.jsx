import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Delete, CornerDownLeft, Smartphone, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [pin, setPin] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle PIN login (for cashiers)
  const handlePinLogin = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    // Try to login with PIN as password and a default pattern
    // The PIN could be the user's password
    const result = await login(pin, pin);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setPin('');
    }
  };

  // Handle Admin login (username + password)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  // Add digit to PIN
  const addDigit = useCallback((digit) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  }, [pin]);

  // Remove last digit
  const removeDigit = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
  }, []);

  // Clear PIN
  const clearPin = () => {
    setPin('');
  };

  // Keyboard event handler
  useEffect(() => {
    if (showAdminLogin) return; // Don't handle keyboard when admin form is open

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        addDigit(e.key);
      } else if (e.key === 'Backspace') {
        removeDigit();
      } else if (e.key === 'Enter' && pin.length >= 4) {
        handlePinLogin();
      } else if (e.key === 'Escape') {
        clearPin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdminLogin, pin, addDigit, removeDigit]);

  // Auto-submit when PIN is 6 digits
  useEffect(() => {
    if (pin.length === 6) {
      handlePinLogin();
    }
  }, [pin]);

  const numpadButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'clear', '0', 'delete'
  ];

  // PIN Login View
  const PinLoginView = () => (
    <div className="w-full max-w-sm mx-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-[#00a79d] p-2 rounded-lg">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-[#00a79d]">Mobilshop</span>
            <span className="text-gray-600">urimi</span>
          </span>
        </div>

        {/* PIN Display */}
        <div className="mb-6">
          <div className="flex justify-center gap-3 mb-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                  i < pin.length 
                    ? 'border-[#00a79d] bg-[#00a79d]/10 text-[#00a79d]' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {i < pin.length ? '•' : ''}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">Shkruaj kodin PIN</p>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {numpadButtons.map((btn) => {
            if (btn === 'clear') {
              return (
                <button
                  key={btn}
                  onClick={clearPin}
                  className="h-16 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 flex items-center justify-center text-gray-500 font-medium"
                >
                  C
                </button>
              );
            }
            if (btn === 'delete') {
              return (
                <button
                  key={btn}
                  onClick={removeDigit}
                  className="h-16 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 flex items-center justify-center"
                >
                  <Delete className="h-6 w-6 text-gray-600" />
                </button>
              );
            }
            return (
              <button
                key={btn}
                onClick={() => addDigit(btn)}
                className="h-16 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 transition-all duration-150 text-2xl font-semibold text-gray-700"
              >
                {btn}
              </button>
            );
          })}
        </div>

        {/* Enter Button */}
        <Button
          onClick={handlePinLogin}
          disabled={pin.length < 4 || loading}
          className="w-full h-14 bg-[#00a79d] hover:bg-[#008f86] text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="spinner border-white border-t-transparent" />
          ) : (
            <>
              <CornerDownLeft className="h-5 w-5" />
              KYÇU
            </>
          )}
        </Button>

        {/* Admin Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={() => setShowAdminLogin(true)}
            className="w-full text-center text-[#00a79d] hover:text-[#008f86] font-medium transition-colors flex items-center justify-center gap-2"
          >
            <User className="h-4 w-4" />
            Kyçu si Administrator
          </button>
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="mt-4 text-center text-xs text-gray-400">
        Përdor tastet 0-9 • Backspace për fshirje • Enter për kyçje
      </div>
    </div>
  );

  // Admin Login View
  const AdminLoginView = () => (
    <div className="w-full max-w-md mx-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-10">
        {/* Back button */}
        <button
          onClick={() => {
            setShowAdminLogin(false);
            setUsername('');
            setPassword('');
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-[#00a79d] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kthehu
        </button>

        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-[#00a79d] p-2 rounded-lg">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold">
            <span className="text-[#00a79d]">Mobilshop</span>
            <span className="text-gray-600">urimi</span>
          </span>
        </div>

        <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
          Kyçje si Administrator
        </h2>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-[#00a79d] focus:border-[#00a79d]"
              required
              autoFocus
              data-testid="login-username-input"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#00a79d]" />
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Fjalëkalimi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-[#00a79d] focus:border-[#00a79d]"
              required
              data-testid="login-password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#00a79d] hover:bg-[#008f86] text-white font-semibold rounded-xl shadow-md transition-all duration-200"
            data-testid="login-submit-btn"
          >
            {loading ? (
              <div className="spinner border-white border-t-transparent" />
            ) : (
              'KYÇU'
            )}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Decorative top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#00a79d]" />
      
      {showAdminLogin ? <AdminLoginView /> : <PinLoginView />}
    </div>
  );
};

export default Login;
