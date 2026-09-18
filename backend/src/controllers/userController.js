const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { sendApprovalEmail } = require('../utils/emailService');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// =========================================================
// LIST / READ
// =========================================================
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// UPDATE USER (basic fields + role + permissions + approval)
// =========================================================
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      name,
      phoneNumber,
      role,
      permissions,
      isActive,
      isApproved,
    } = req.body;

    // Only admin can change role, permissions, active, approval
    if (req.user.role === 'admin') {
      if (role !== undefined) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;

      if (permissions !== undefined && typeof permissions === 'object') {
        user.permissions = {
          canEditProperties:
            permissions.canEditProperties ?? user.permissions?.canEditProperties ?? false,
          canAddProperties:
            permissions.canAddProperties ?? user.permissions?.canAddProperties ?? false,
          canDeleteProperties:
            permissions.canDeleteProperties ?? user.permissions?.canDeleteProperties ?? false,
          canRevalueProperties:
            permissions.canRevalueProperties ?? user.permissions?.canRevalueProperties ?? false,
          canViewMessages:
            permissions.canViewMessages ?? user.permissions?.canViewMessages ?? false,
          canReplyMessages:
            permissions.canReplyMessages ?? user.permissions?.canReplyMessages ?? false,
        };
      }

      // Handle approval transition
      if (isApproved !== undefined && isApproved !== user.isApproved) {
        user.isApproved = isApproved;
        if (isApproved && user.role === 'agent') {
          try {
            await sendApprovalEmail(user.email, user.name);
          } catch (mailErr) {
            console.warn('Approval email failed (non-fatal):', mailErr.message);
          }
        }
      }
    }

    // Admin + self-update allowed for these
    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'update',
        collection: 'User',
        recordId: user._id,
        changes: req.body,
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.json({ message: 'User updated', user: user.toObject({ versionKey: false }) });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// =========================================================
// DELETE
// =========================================================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Cannot delete main admin' });
    }

    await user.deleteOne();

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'delete',
        collection: 'User',
        recordId: user._id,
        changes: { deletedUser: user.email },
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// APPROVE AGENT (quick endpoint)
// =========================================================
const approveAgent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'agent') {
      return res.status(400).json({ message: 'User is not an agent' });
    }

    user.isApproved = true;
    await user.save();

    try {
      await sendApprovalEmail(user.email, user.name);
    } catch (mailErr) {
      console.warn('Approval email failed (non-fatal):', mailErr.message);
    }

    try {
      await AuditLog.create({
        user: req.user._id,
        userEmail: req.user.email,
        action: 'update',
        collection: 'User',
        recordId: user._id,
        changes: { isApproved: true },
      });
    } catch (auditErr) {
      console.warn('Audit log failed:', auditErr.message);
    }

    res.json({ message: 'Agent approved', user: user.toObject({ versionKey: false }) });
  } catch (error) {
    console.error('Approve agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// CHANGE PASSWORD
// =========================================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    try {
      await AuditLog.create({
        user: user._id,
        userEmail: user.email,
        action: 'update',
        collection: 'User',
        recordId: user._id,
        changes: { passwordChanged: true },
      });
    } catch (_) {}

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =========================================================
// FORGOT / RESET PASSWORD
// =========================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password. It expires in 1 hour.</p>
        <a href="${resetUrl}" style="background:#C49B3B;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
      `,
    });

    res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  approveAgent,
  changePassword,
  forgotPassword,
  resetPassword,
};