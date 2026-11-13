import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users/forgot-password`, { email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary/10 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-premium-lg p-8 border border-surface-border">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
            <FaEnvelope className="text-primary text-xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink">Forgot Password</h2>
          <p className="text-ink-muted text-sm mt-1">
            {sent ? 'Check your email for the reset link.' : 'Enter your email to receive a reset link.'}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-success rounded-lg p-4 text-sm">
              A reset link has been sent to <strong>{email}</strong>. It expires in 1 hour.
            </div>
            <Link to="/login" className="btn-neon w-full flex items-center justify-center gap-2">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-neon pl-10"
                  placeholder="your-registered-email@example.com"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-neon w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link to="/login" className="block text-center text-sm text-ink-muted hover:text-primary transition">
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;