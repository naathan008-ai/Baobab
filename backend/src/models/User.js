const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'agent', 'user'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    default: null,
  },
  permissions: {
    canEditProperties: { type: Boolean, default: false },
    canAddProperties: { type: Boolean, default: false },
    canDeleteProperties: { type: Boolean, default: false },
    canRevalueProperties: { type: Boolean, default: false },
    canViewMessages: { type: Boolean, default: false },
    canReplyMessages: { type: Boolean, default: false },
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);