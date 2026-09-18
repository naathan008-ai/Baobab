const express = require('express');
const {
  submitContact,
  getContacts,
  getContactById,
  markContactRead,
  replyToContact,
  deleteContact,
} = require('../controllers/contactController');
const {
  protect,
  adminOnly,
  agentOrAdmin,
  checkMessagePermission,
} = require('../middleware/auth');
const router = express.Router();

// ===== Public =====
router.post('/', submitContact);

// ===== Authenticated =====
router.use(protect);

// Admin + agents with canViewMessages
router.get('/', agentOrAdmin, checkMessagePermission('view'), getContacts);

// Get one
router.get(
  '/:id',
  agentOrAdmin,
  checkMessagePermission('view'),
  getContactById
);

// Mark read
router.put(
  '/:id/read',
  agentOrAdmin,
  checkMessagePermission('view'),
  markContactRead
);

// Reply
router.post(
  '/:id/reply',
  agentOrAdmin,
  checkMessagePermission('reply'),
  replyToContact
);

// Delete (admin only)
router.delete('/:id', adminOnly, deleteContact);

module.exports = router;