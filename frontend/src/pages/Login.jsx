import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { User, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1d23' }}>
      {/* Decorative top bar - Blue */}
      <div className="fixed top-0 left-0 right-0 h-1" style={{ backgroundColor: '#3b82f6' }} />
      
      <div className="w-full max-w-md mx-4">
        <div className="rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12" style={{ backgroundColor: '#22262e', border: '1px solid #374151' }}>
          {/* Brand name */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#3b82f6' }}>
              <Smartphone className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Mobilshop</span>
              <span style={{ color: '#94a3b8' }}>urimi</span>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5" style={{ color: '#94a3b8' }} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 h-14 rounded-xl text-base transition-all duration-200"
                style={{ 
                  backgroundColor: '#2a2f38', 
                  border: '1px solid #374151',
                  color: '#f1f5f9'
                }}
                required
                data-testid="login-username-input"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5" style={{ color: '#3b82f6' }} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Fjalëkalimi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 h-14 rounded-xl text-base transition-all duration-200"
                style={{ 
                  backgroundColor: '#2a2f38', 
                  border: '1px solid #374151',
                  color: '#f1f5f9'
                }}
                required
                data-testid="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" style={{ color: '#94a3b8' }} />
                ) : (
                  <Eye className="h-5 w-5" style={{ color: '#94a3b8' }} />
                )}
              </button>
            </div>

            {/* Login Button - Primary Blue */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-base"
              style={{ backgroundColor: '#3b82f6' }}
              data-testid="login-submit-btn"
            >
              {loading ? (
                <div className="spinner border-white border-t-transparent" />
              ) : (
                'KYÇU'
              )}
            </Button>

            {/* Remember Me */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-[#3b82f6] data-[state=checked]:bg-[#3b82f6]"
              />
              <label
                htmlFor="remember"
                className="text-sm cursor-pointer select-none"
                style={{ color: '#94a3b8' }}
              >
                Më mbaj mend!
              </label>
            </div>
          </form>
        </div>
        
        {/* Footer text */}
        <p className="text-center mt-6 text-xs" style={{ color: '#6b7280' }}>
          Mobilshopurimi POS System v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;
