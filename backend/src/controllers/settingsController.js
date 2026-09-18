const SocialSettings = require('../models/SocialSettings');
const AuditLog = require('../models/AuditLog');

// Default empty settings
const defaultSettings = {
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
};

const getSettings = async (req, res) => {
  try {
    let settings = await SocialSettings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await SocialSettings.create(defaultSettings);
    }
    // Return with all fields
    const result = { ...defaultSettings, ...settings.toObject() };
    res.json(result);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { facebook, twitter, instagram, linkedin, youtube, tiktok } = req.body;
    let settings = await SocialSettings.findOne();
    if (!settings) {
      settings = await SocialSettings.create(defaultSettings);
    }
    settings.facebook = facebook || '';
    settings.twitter = twitter || '';
    settings.instagram = instagram || '';
    settings.linkedin = linkedin || '';
    settings.youtube = youtube || '';
    settings.tiktok = tiktok || '';
    settings.updatedBy = req.user._id;
    settings.updatedAt = new Date();
    await settings.save();

    await AuditLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      action: 'update',
      collection: 'SocialSettings',
      recordId: settings._id,
      changes: req.body,
    });

    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSettings, updateSettings };