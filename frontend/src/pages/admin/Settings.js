import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
      setSettings(res.data);
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
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const socialFields = [
    { name: 'facebook', icon: FaFacebook, label: 'Facebook URL' },
    { name: 'twitter', icon: FaTwitter, label: 'Twitter URL' },
    { name: 'instagram', icon: FaInstagram, label: 'Instagram URL' },
    { name: 'linkedin', icon: FaLinkedin, label: 'LinkedIn URL' },
    { name: 'youtube', icon: FaYoutube, label: 'YouTube URL' },
    { name: 'tiktok', icon: FaTiktok, label: 'TikTok URL' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-white/50 text-center py-20">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
          Social Media Settings
        </h1>
        <p className="text-white/50">Manage social media links displayed in the footer.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/10 max-w-2xl">
        <div className="space-y-4">
          {socialFields.map((field) => (
            <div key={field.name}>
              <label className="flex items-center gap-2 text-white/70 mb-1">
                <field.icon className="text-neon-gold" />
                {field.label}
              </label>
              <input
                type="url"
                name={field.name}
                value={settings[field.name] || ''}
                onChange={handleChange}
                placeholder="https://..."
                className="input-neon"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <button type="submit" disabled={saving} className="btn-neon flex items-center gap-2">
            <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;