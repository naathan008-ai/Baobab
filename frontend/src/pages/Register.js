import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phoneNumber: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-[#0A0A0F]">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-neon-cyan/20 rounded-full filter blur-3xl animate-floatX"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-neon-gold/10 rounded-full filter blur-3xl animate-floatY"></div>
      </div>

      <div className="glass max-w-md w-full p-8 rounded-2xl border border-white/10 shadow-2xl animate-zoomIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-cyan to-neon-gold bg-clip-text text-transparent">
            Join the Future
          </h2>
          <p className="text-white/50 mt-2">Create your Baobab account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-neon pl-12"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-neon pl-12"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-neon pl-12 pr-12"
                placeholder="Min 6 chars"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Phone (optional)</label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="input-neon pl-12"
                placeholder="+263 77 123 4567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-neon appearance-none"
            >
              <option value="user">User</option>
              <option value="agent">Agent</option>
            </select>
            <p className="text-xs text-white/30 mt-1">Agents require admin approval.</p>
          </div>
          <button type="submit" disabled={loading} className="btn-neon w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-white/50">
            Already have an account? <Link to="/login" className="text-neon-gold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;