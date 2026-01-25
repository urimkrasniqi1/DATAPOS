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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5E6F5] to-[#F8FAFC]">
      {/* Decorative top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9C27B0] via-[#E53935] to-[#9C27B0]" />
      
      <div className="w-full max-w-4xl mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left side - Logo/Brand */}
          <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-white">
            <div className="text-center md:text-left">
              {/* Arrow Logo */}
              <div className="flex items-center justify-center md:justify-start mb-6">
                <svg
                  viewBox="0 0 100 100"
                  className="w-32 h-32 md:w-48 md:h-48"
                  fill="none"
                >
                  {/* Main arrow shape */}
                  <path
                    d="M20 50 L50 20 L50 35 L80 35 L80 65 L50 65 L50 80 Z"
                    fill="#E53935"
                  />
                  {/* Inner cutout */}
                  <path
                    d="M35 50 L50 35 L50 42 L65 42 L65 58 L50 58 L50 65 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="md:w-1/2 p-8 md:p-12">
            {/* Brand name */}
            <div className="flex items-center justify-center gap-1 mb-8">
              <span className="text-3xl font-bold text-[#E53935]">→</span>
              <span className="text-2xl font-bold">
                <span className="text-[#E53935]">t</span>
                <span className="text-gray-400">3</span>
                <span className="text-[#00B9D7]">next</span>
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-full focus:ring-[#E53935] focus:border-[#E53935]"
                  required
                  data-testid="login-username-input"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#E53935]" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Fjalëkalimi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 rounded-full focus:ring-[#E53935] focus:border-[#E53935]"
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
                className="w-full h-12 bg-[#E53935] hover:bg-[#D32F2F] text-white font-semibold rounded-full shadow-md transition-all duration-200"
                data-testid="login-submit-btn"
              >
                {loading ? (
                  <div className="spinner border-white border-t-transparent" />
                ) : (
                  'LOGIN'
                )}
              </Button>

              {/* Remember Me */}
              <div className="flex items-center justify-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="border-[#E53935] data-[state=checked]:bg-[#E53935]"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Më mbaj mend!
                </label>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
