const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const agentOrAdmin = (req, res, next) => {
  if (!['admin', 'agent'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Agent or admin access required' });
  }
  // Agents must be approved
  if (req.user.role === 'agent' && !req.user.isApproved) {
    return res.status(403).json({ message: 'Your agent account is pending admin approval' });
  }
  next();
};

/**
 * Checks whether the current user has a specific permission.
 * Admin bypasses all checks. Agents must have the permission flag set to true.
 * Regular users are always denied.
 */
const checkPropertyPermission = (action) => {
  return (req, res, next) => {
    const user = req.user;

    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'agent') {
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Account not approved by admin' });
      }

      const permissionMap = {
        edit: 'canEditProperties',
        add: 'canAddProperties',
        delete: 'canDeleteProperties',
        revalue: 'canRevalueProperties',
      };

      const permission = permissionMap[action];
      if (!permission || !user.permissions || !user.permissions[permission]) {
        return res.status(403).json({
          message: `You don't have permission to ${action} properties`,
        });
      }
      return next();
    }

    return res.status(403).json({ message: 'Access denied' });
  };
};

/**
 * Same idea but for messages.
 */
const checkMessagePermission = (action) => {
  return (req, res, next) => {
    const user = req.user;

    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'agent') {
      if (!user.isApproved) {
        return res.status(403).json({ message: 'Account not approved by admin' });
      }
      const permissionMap = {
        view: 'canViewMessages',
        reply: 'canReplyMessages',
      };
      const permission = permissionMap[action];
      if (!permission || !user.permissions || !user.permissions[permission]) {
        return res.status(403).json({
          message: `You don't have permission to ${action} messages`,
        });
      }
      return next();
    }

    return res.status(403).json({ message: 'Access denied' });
  };
};

module.exports = {
  protect,
  adminOnly,
  agentOrAdmin,
  checkPropertyPermission,
  checkMessagePermission,
};