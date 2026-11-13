import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setEmail(''); setPassword(''); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const role = result.user?.role;
      navigate(role === 'admin' || role === 'agent' ? '/admin' : '/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary/10 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-premium-lg p-8 border border-surface-border">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            B
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink">Welcome Back</h2>
          <p className="text-ink-muted mt-1 text-sm">Sign in to your Baobab account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input type="text" style={{ display: 'none' }} />
          <input type="password" style={{ display: 'none' }} />

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-neon pl-10"
                placeholder="you@example.com"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-neon pl-10 pr-10"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-primary transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-neon w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2 text-sm">
          <p className="text-ink-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-ink-faint hover:text-primary transition text-xs">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;