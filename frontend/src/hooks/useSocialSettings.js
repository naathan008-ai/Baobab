import { useState, useEffect } from 'react';
import axios from 'axios';

const defaultSettings = {
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  tiktok: ''
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
      fetchPromise.then(data => {
        cachedSettings = data;
        setSettings(data);
        setLoading(false);
      });
      return;
    }
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
        // Ensure all fields exist
        const data = { ...defaultSettings, ...res.data };
        cachedSettings = data;
        setSettings(data);
      } catch (error) {
        console.error('Failed to load social settings:', error);
        // Use defaults on error
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