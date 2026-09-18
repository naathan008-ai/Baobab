const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  approveAgent,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// ===== Public =====
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ===== Authenticated =====
router.use(protect);

// Password change (any logged-in user)
router.put('/change-password', changePassword);

// ===== Admin only =====
router.get('/', adminOnly, getUsers);
router.get('/:id', adminOnly, getUserById);
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);
router.post('/:id/approve', adminOnly, approveAgent);

module.exports = router;