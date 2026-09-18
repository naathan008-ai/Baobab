const Property = require('../models/Property');
const AuditLog = require('../models/AuditLog');
const { protectImage } = require('../middleware/watermark');
const slugify = require('slugify');
const mongoose = require('mongoose');

// =========================================================
// HELPERS
// =========================================================

const parseFeatures = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
    } catch (_) { /* fall through */ }
  }

  return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
};

const parseCoordinates = (value) => {
  if (!value) return undefined;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    return undefined;
  }
};

// =========================================================
// GET all (public)
// =========================================================
const getProperties = async (req, res) => {
  try {
    const { status, propertyType, minPrice, maxPrice, bedrooms, search } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (propertyType && propertyType !== 'all') query.propertyType = propertyType;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    const safe = properties.map((p) => {
      const obj = p.toObject();
      if (!obj.images) obj.images = [];
      return obj;
    });

    res.json(safe);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// GET by ID (protected – used for the admin edit form)
// =========================================================
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    const property = await Property.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const safe = property.toObject();
    if (!safe.images) safe.images = [];
    res.json(safe);
  } catch (error) {
    console.error('Get property by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// GET one by slug (public) — kept for the public website
// =========================================================
const getPropertyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const property = await Property.findOne({ slug })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const safe = property.toObject();
    if (!safe.images) safe.images = [];
    res.json(safe);
  } catch (error) {
    console.error('Get property by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// CREATE
// =========================================================
const createProperty = async (req, res) => {
  try {
    const {
      title, description, price, bedrooms, bathrooms, areaSqM,
      location, coordinates, propertyType, features, isFeatured, status,
    } = req.body;

    const missing = {};
    if (!title) missing.title = true;
    if (!description) missing.description = true;
    if (!price) missing.price = true;
    if (!propertyType) missing.propertyType = true;

    if (Object.keys(missing).length > 0) {
      return res.status(400).json({ message: 'Missing required fields', missing });
    }

    let slug;
    try {
      slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();
    } catch (slugError) {
      slug = 'property-' + Date.now();
    }

    let imageUrls = [];
    if (req.processedImages && req.processedImages.length > 0) {
      for (const url of req.processedImages) {
        try {
          imageUrls.push(await protectImage(url));
        } catch (imgErr) {
          console.error('Image protection failed:', imgErr.message);
          imageUrls.push(url);
        }
      }
    }

    const property = await Property.create({
      title: String(title).trim(),
      slug,
      description: String(description).trim(),
      price: Number(price),
      bedrooms: bedrooms !== undefined && bedrooms !== '' ? Number(bedrooms) : undefined,
      bathrooms: bathrooms !== undefined && bathrooms !== '' ? Number(bathrooms) : undefined,
      areaSqM: areaSqM !== undefined && areaSqM !== '' ? Number(areaSqM) : undefined,
      location: location ? String(location).trim() : '',
      coordinates: parseCoordinates(coordinates),
      images: imageUrls,
      propertyType,
      features: parseFeatures(features),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      status: status || 'available',
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'create',
        collection: 'Property',
        recordId: property._id,
        changes: { title, price },
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    console.error('===== CREATE PROPERTY ERROR =====');
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// =========================================================
// UPDATE
// =========================================================
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const updates = { ...req.body };
    const changes = {};

    if (updates.features !== undefined) {
      updates.features = parseFeatures(updates.features);
    }
    if (updates.coordinates !== undefined) {
      updates.coordinates = parseCoordinates(updates.coordinates);
    }

    ['price', 'bedrooms', 'bathrooms', 'areaSqM'].forEach((k) => {
      if (updates[k] !== undefined && updates[k] !== '') {
        updates[k] = Number(updates[k]);
      }
    });

    if (updates.isFeatured !== undefined) {
      updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
    }

    Object.keys(updates).forEach((key) => {
      if (property[key] !== undefined && String(property[key]) !== String(updates[key])) {
        changes[key] = { from: property[key], to: updates[key] };
      }
    });

    // Merge new images with existing ones
    let imageUrls = property.images || [];
    if (req.processedImages && req.processedImages.length > 0) {
      for (const url of req.processedImages) {
        try {
          imageUrls.push(await protectImage(url));
        } catch (_) {
          imageUrls.push(url);
        }
      }
    }

    // Allow removing images via existingImages field from the frontend
    if (updates.existingImages !== undefined) {
      // The frontend sends the list of URLs it wants to keep
      const keep = Array.isArray(updates.existingImages)
        ? updates.existingImages
        : [updates.existingImages];
      imageUrls = keep.filter(Boolean);
      delete updates.existingImages;
    }

    delete updates.slug;
    delete updates._id;
    updates.images = imageUrls;
    updates.updatedBy = req.user._id;

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'update',
        collection: 'Property',
        recordId: property._id,
        changes,
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// =========================================================
// DELETE
// =========================================================
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.deleteOne();

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'delete',
        collection: 'Property',
        recordId: property._id,
        changes: { deletedProperty: property.title },
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// REVALUE
// =========================================================
const revalueProperty = async (req, res) => {
  try {
    const { price } = req.body;
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const oldPrice = property.price;
    property.price = Number(price);
    property.lastValuationDate = new Date();
    property.valuationHistory.push({
      price: Number(price),
      date: new Date(),
      updatedBy: req.user._id,
    });
    property.updatedBy = req.user._id;

    await property.save();

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'revalue',
        collection: 'Property',
        recordId: property._id,
        changes: { oldPrice, newPrice: price },
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.json({ message: 'Property revalued successfully', property });
  } catch (error) {
    console.error('Revalue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  revalueProperty,
};