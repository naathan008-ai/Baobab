import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import {
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok,
  FaSave, FaInfoCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
      setSettings((prev) => ({ ...prev, ...res.data }));
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const socialFields = [
    { name: 'facebook', icon: FaFacebook, label: 'Facebook', example: 'https://facebook.com/baobab or baobab' },
    { name: 'twitter', icon: FaTwitter, label: 'Twitter / X', example: 'https://twitter.com/baobab or baobab' },
    { name: 'instagram', icon: FaInstagram, label: 'Instagram', example: 'https://instagram.com/baobab or baobab' },
    { name: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', example: 'https://linkedin.com/in/baobab or baobab' },
    { name: 'youtube', icon: FaYoutube, label: 'YouTube', example: 'https://youtube.com/@baobab or baobab' },
    { name: 'tiktok', icon: FaTiktok, label: 'TikTok', example: 'https://tiktok.com/@baobab or baobab' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-ink-muted text-center py-20">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-ink">Social Media Settings</h1>
        <p className="text-ink-muted mt-1">
          Manage social media links displayed in the website footer.
        </p>
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 flex items-start gap-3 max-w-2xl">
        <FaInfoCircle className="text-primary mt-1 flex-shrink-0" />
        <div className="text-sm text-ink-soft">
          <p className="font-medium text-ink mb-1">
            Tip: You can enter either a full URL or just the account name.
          </p>
          <p>
            For example,{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border border-surface-border">baobab</code>{' '}
            or{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border border-surface-border">@baobab</code>{' '}
            will be converted to the correct platform URL automatically. Leave a field
            empty to hide that icon from the footer.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 border border-surface-border shadow-premium max-w-2xl"
      >
        <div className="space-y-5">
          {socialFields.map((field) => (
            <div key={field.name}>
              <label className="flex items-center gap-2 text-sm font-medium text-ink-soft mb-2">
                <field.icon className="text-primary" /> {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={settings[field.name] || ''}
                onChange={handleChange}
                placeholder={field.example}
                className="input-neon"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border">
          <button
            type="submit"
            disabled={saving}
            className="btn-neon flex items-center gap-2"
          >
            <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;