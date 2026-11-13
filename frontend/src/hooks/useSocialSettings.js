import { useState, useEffect } from 'react';
import axios from 'axios';

const defaultSettings = {
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
};

let cachedSettings = null;
let fetchPromise = null;

export const useSocialSettings = () => {
  const [settings, setSettings] = useState(cachedSettings || defaultSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }
    if (fetchPromise) {
      fetchPromise.then((data) => {
        cachedSettings = data;
        setSettings(data);
        setLoading(false);
      });
      return;
    }
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
        const data = { ...defaultSettings, ...res.data };
        cachedSettings = data;
        setSettings(data);
      } catch (error) {
        console.error('Failed to load social settings:', error);
        cachedSettings = defaultSettings;
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };
    fetchPromise = fetchSettings();
  }, []);

  return { settings, loading };
};

/**
 * Turns whatever the admin typed into a clickable URL.
 *
 * Accepts:
 *   - Full URL:      "https://facebook.com/baobab"  → unchanged
 *   - @handle:       "@baobab"                      → https://facebook.com/baobab
 *   - Plain handle:  "baobab"                       → https://facebook.com/baobab
 *   - Empty:         ""                             → null (icon hidden)
 */
export const resolveSocialUrl = (platform, value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const handle = trimmed.replace(/^@/, '').replace(/^\/+/, '');

  const bases = {
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/in/',
    youtube: 'https://youtube.com/@',
    tiktok: 'https://tiktok.com/@',
  };

  return (bases[platform] || 'https://') + handle;
};