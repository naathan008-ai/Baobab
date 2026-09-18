const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  areaSqM: { type: Number, required: true },
  location: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  images: {
    type: [String],
    default: [], // always an array
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default: 'available',
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'land', 'commercial'],
    required: true,
  },
  features: [String],
  isFeatured: { type: Boolean, default: false },
  lastValuationDate: { type: Date, default: Date.now },
  valuationHistory: [{
    price: Number,
    date: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

propertySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema);