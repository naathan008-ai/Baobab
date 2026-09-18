const express = require('express');
const {
  getProperties,
  getPropertyById,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  revalueProperty,
} = require('../controllers/propertyController');
const {
  protect,
  agentOrAdmin,
  checkPropertyPermission,
} = require('../middleware/auth');
const { upload, processPropertyImages } = require('../middleware/upload');
const router = express.Router();

// =========================================================
// PUBLIC ROUTES
// =========================================================

// GET all
router.get('/', getProperties);

// GET by ID (protected – must be BEFORE /:slug)
router.get('/id/:id', protect, getPropertyById);

// GET by slug (public – for the public website)
router.get('/:slug', getPropertyBySlug);

// =========================================================
// PROTECTED ROUTES
// =========================================================
router.use(protect);

// Add property
router.post(
  '/',
  agentOrAdmin,
  checkPropertyPermission('add'),
  upload.array('propertyImages', 10),
  processPropertyImages,
  createProperty
);

// Edit
router.put(
  '/:id',
  agentOrAdmin,
  checkPropertyPermission('edit'),
  upload.array('propertyImages', 10),
  processPropertyImages,
  updateProperty
);

// Delete
router.delete(
  '/:id',
  agentOrAdmin,
  checkPropertyPermission('delete'),
  deleteProperty
);

// Revalue
router.put(
  '/:id/revalue',
  agentOrAdmin,
  checkPropertyPermission('revalue'),
  revalueProperty
);

module.exports = router;