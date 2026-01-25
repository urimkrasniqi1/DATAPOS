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
          <div className="md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-[#9C27B0] to-[#7B1FA2]">
            <div className="text-center">
              {/* Mobile Phone Logo */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="bg-white/20 p-6 rounded-2xl mb-4">
                  <Smartphone className="w-20 h-20 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-bold text-white">mobilshop</h1>
                <h2 className="text-2xl font-light text-white/90">urimi</h2>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="md:w-1/2 p-8 md:p-12">
            {/* Brand name */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="bg-[#E53935] p-2 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#E53935]">Mobilshop</span>
                <span className="text-gray-600">urimi</span>
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
                  'KYÇU'
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
