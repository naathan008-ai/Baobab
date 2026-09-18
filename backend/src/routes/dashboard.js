const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, agentOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Both admins and approved agents can access
router.get('/stats', protect, agentOrAdmin, getDashboardStats);

module.exports = router;