import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phoneNumber: '', role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary/10 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-premium-lg p-8 border border-surface-border">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            B
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink">Create Account</h2>
          <p className="text-ink-muted mt-1 text-sm">Join the Baobab community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Full Name *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-neon pl-10"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Email *</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-neon pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Password *</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-neon pl-10 pr-10"
                placeholder="Min 6 characters"
                minLength="6"
                required
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

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Phone Number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-neon pl-10"
                placeholder="+263 ..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-2">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-neon"
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
            </select>
            <p className="text-xs text-ink-faint mt-1">
              Agent accounts require admin approval before access.
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-neon w-full">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;