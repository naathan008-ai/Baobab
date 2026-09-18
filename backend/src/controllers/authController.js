const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const AGENT_DEFAULT_PERMISSIONS = {
  canEditProperties: false,
  canAddProperties: false,
  canDeleteProperties: false,
  canRevalueProperties: false,
  canViewMessages: true,     // agents can see messages by default
  canReplyMessages: true,    // agents can reply by default
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const finalRole = role || 'user';

    const userData = {
      name,
      email,
      password,
      phoneNumber,
      role: finalRole,
      isApproved: finalRole === 'admin', // only admins auto-approved
    };

    if (finalRole === 'agent') {
      userData.permissions = AGENT_DEFAULT_PERMISSIONS;
    }

    const user = await User.create(userData);

    await AuditLog.create({
      user: user._id,
      userEmail: user.email,
      action: 'create',
      collection: 'User',
      recordId: user._id,
      changes: { name, email, role: user.role },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(401).json({ message: 'Account deactivated' });

    if (user.role === 'agent' && !user.isApproved) {
      return res.status(403).json({
        message: 'Account pending admin approval. Please contact the administrator.',
        isApproved: false,
      });
    }

    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
      user: user._id,
      userEmail: user.email,
      action: 'login',
      collection: 'User',
      recordId: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        permissions: user.permissions || {},
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe };