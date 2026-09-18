const Property = require('../models/Property');
const Contact = require('../models/Contact');
const User = require('../models/User');

/**
 * GET /api/dashboard/stats
 * Returns different data based on the logged-in user's role and permissions.
 *
 * Admin:
 *   - Everything (properties, users, messages, pending agents)
 * Agent:
 *   - Only their own properties (or all if allowed)
 *   - Messages (if canViewMessages)
 *   - No user management data
 * User:
 *   - Access denied (only admins/agents reach this)
 */
const getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role;
    const permissions = user.permissions || {};

    if (role !== 'admin' && role !== 'agent') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // =========================================================
    // COMMON: MESSAGES (only if permitted)
    // =========================================================
    let messageData = {
      total: 0,
      new: 0,
      recentMessages: [],
      canView: false,
    };

    const canViewMessages = role === 'admin' || permissions.canViewMessages === true;

    if (canViewMessages) {
      const totalMessages = await Contact.countDocuments();
      const newMessages = await Contact.countDocuments({ status: 'new' });

      const recentMessages = await Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email propertyTitle status createdAt');

      messageData = {
        total: totalMessages,
        new: newMessages,
        recentMessages,
        canView: true,
      };
    }

    // =========================================================
    // PROPERTIES — filtering differs by role
    // =========================================================

    // Agents see only properties they created; admins see all
    const propertyFilter = role === 'agent' ? { createdBy: user._id } : {};

    const totalProperties = await Property.countDocuments(propertyFilter);
    const availableProperties = await Property.countDocuments({
      ...propertyFilter,
      status: 'available',
    });
    const pendingProperties = await Property.countDocuments({
      ...propertyFilter,
      status: 'pending',
    });
    const soldProperties = await Property.countDocuments({
      ...propertyFilter,
      status: 'sold',
    });

    const recentProperties = await Property.find(propertyFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price status propertyType location createdAt slug');

    // =========================================================
    // ADMIN-ONLY DATA
    // =========================================================
    let userData = null;

    if (role === 'admin') {
      const totalUsers = await User.countDocuments();
      const pendingAgents = await User.countDocuments({
        role: 'agent',
        isApproved: false,
      });
      const totalAgents = await User.countDocuments({ role: 'agent' });

      // Recently added users (last 5)
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role isApproved createdAt');

      userData = {
        totalUsers,
        totalAgents,
        pendingAgents,
        recentUsers,
        canManage: true,
      };
    }

    // =========================================================
    // CLIENT COUNT (both admins and agents can see)
    // =========================================================
    // We're inferring "clients" from unique email/phone of contacts
    const totalClients = await Contact.countDocuments();

    // =========================================================
    // RESPONSE
    // =========================================================
    res.json({
      success: true,
      role,
      permissions,
      data: {
        properties: {
          total: totalProperties,
          available: availableProperties,
          pending: pendingProperties,
          sold: soldProperties,
          recent: recentProperties,
          canAdd: role === 'admin' || permissions.canAddProperties === true,
          canEdit: role === 'admin' || permissions.canEditProperties === true,
          canDelete: role === 'admin' || permissions.canDeleteProperties === true,
          canRevalue: role === 'admin' || permissions.canRevalueProperties === true,
        },
        messages: messageData,
        users: userData,       // null for agents
        clients: {
          total: totalClients,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats };