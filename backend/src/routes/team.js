const express = require('express');
const {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, processTeamPhoto } = require('../middleware/upload');
const router = express.Router();

router.get('/', getTeamMembers);

// Admin only routes
router.use(protect, adminOnly);
router.post(
  '/',
  upload.single('teamPhoto'),
  processTeamPhoto,
  createTeamMember
);
router.put(
  '/:id',
  upload.single('teamPhoto'),
  processTeamPhoto,
  updateTeamMember
);
router.delete('/:id', deleteTeamMember);

module.exports = router;