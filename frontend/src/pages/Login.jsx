import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTenant } from '../App';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Delete, CornerDownLeft, User, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

const Login = () => {
  const [pin, setPin] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Get tenant context from subdomain
  const tenantContext = useTenant();
  const tenant = tenantContext?.tenant;
  const tenantLoading = tenantContext?.tenantLoading;

  // Handle PIN login (for cashiers) - redirects to POS/Arka
  const handlePinLogin = async () => {
    if (pin.length < 1) return;
    setLoading(true);
    const result = await login(pin, pin);
    setLoading(false);
    if (result.success) {
      navigate('/pos');
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
      navigate('/app/dashboard');
    }
  };

  // Add digit to PIN
  const addDigit = useCallback((digit) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  }, [pin.length]);

  // Remove last digit
  const removeDigit = useCallback(() => {
    setPin(prev => prev.slice(0, -1));
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showAdminLogin) return;
      
      if (e.key >= '0' && e.key <= '9') {
        addDigit(e.key);
      } else if (e.key === 'Backspace') {
        removeDigit();
      } else if (e.key === 'Enter' && pin.length >= 1) {
        handlePinLogin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, showAdminLogin, addDigit, removeDigit]);

  const numpadButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'C', '0', '←'
  ];

  const handleNumpadClick = (value) => {
    if (value === 'C') {
      setPin('');
    } else if (value === '←') {
      removeDigit();
    } else {
      addDigit(value);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00a79d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00a79d]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>

      {!tenantLoading && !showAdminLogin && (
        // PIN Login View
        <div className="relative w-full max-w-sm">
          <div className="bg-[#0f1f35]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-8">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-8">
              {tenant?.logo_url ? (
                <img 
                  src={tenant.logo_url} 
                  alt={tenant.company_name || tenant.name}
                  className="h-16 object-contain mb-3"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <img 
                  src="https://customer-assets.emergentagent.com/job_retailsys-1/artifacts/9i1h1bxb_logo%20icon.png" 
                  alt="DataPOS" 
                  className="h-16 object-contain mb-3"
                />
              )}
              <h1 className="text-2xl font-bold text-white">
                {tenant?.company_name || tenant?.name || 'DataPOS'}
              </h1>
              {tenant && (
                <p className="text-sm text-gray-400 mt-1">Sistemi POS</p>
              )}
            </div>

            {/* PIN Display */}
            <div className="mb-6">
              <div className="flex justify-center gap-3 mb-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      i < pin.length 
                        ? 'bg-[#00a79d] border-[#00a79d] shadow-lg shadow-[#00a79d]/30' 
                        : 'border-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm">Shkruani PIN-in tuaj</p>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {numpadButtons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleNumpadClick(btn)}
                  disabled={loading}
                  className={`h-14 rounded-xl text-xl font-semibold transition-all duration-200 ${
                    btn === 'C' 
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                      : btn === '←'
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                      : 'bg-white/5 text-white hover:bg-[#00a79d]/20 hover:text-[#00a79d] border border-white/10 hover:border-[#00a79d]/30'
                  }`}
                >
                  {btn === '←' ? <Delete className="w-5 h-5 mx-auto" /> : btn}
                </button>
              ))}
            </div>

            {/* Login Button */}
            <Button
              onClick={handlePinLogin}
              disabled={pin.length < 1 || loading}
              className="w-full h-12 bg-[#00a79d] hover:bg-[#008f86] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CornerDownLeft className="w-5 h-5 mr-2" />
                  KYÇU
                </>
              )}
            </Button>

            {/* Admin Login Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-[#00a79d] hover:text-[#00c9b7] text-sm font-medium transition-colors"
              >
                Kyçu si Administrator →
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-gray-600 text-xs mt-4">
              Përdor tastet 0-9 • Backspace për fshirje • Enter për kyçje
            </p>
          </div>
        </div>
      )}

      {!tenantLoading && showAdminLogin && (
        // Admin Login View
        <div className="relative w-full max-w-md">
          <div className="bg-[#0f1f35]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-8 md:p-10">
            {/* Back button */}
            <button
              onClick={() => {
                setShowAdminLogin(false);
                setUsername('');
                setPassword('');
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Kthehu te PIN</span>
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-8">
              {tenant?.logo_url ? (
                <img 
                  src={tenant.logo_url} 
                  alt={tenant.company_name || tenant.name}
                  className="h-14 object-contain mb-3"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <img 
                  src="https://customer-assets.emergentagent.com/job_retailsys-1/artifacts/9i1h1bxb_logo%20icon.png" 
                  alt="DataPOS" 
                  className="h-14 object-contain mb-3"
                />
              )}
              <h1 className="text-2xl font-bold text-white">
                {tenant?.company_name || tenant?.name || 'DataPOS'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">Kyçje Administrative</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Shkruani username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#00a79d] focus:ring-[#00a79d]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Fjalëkalimi</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Shkruani fjalëkalimin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-[#00a79d] focus:ring-[#00a79d]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#00a79d] hover:bg-[#008f86] text-white font-semibold rounded-xl transition-all duration-200 mt-6"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'KYÇU'
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
