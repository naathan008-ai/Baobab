const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Public – anyone can read settings
router.get('/', getSettings);

// Admin only – update
router.put('/', protect, adminOnly, updateSettings);

module.exports = router;