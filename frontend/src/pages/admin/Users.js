import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import {
  FaEdit, FaTrash, FaCheck, FaTimes, FaUserCheck, FaUserShield,
  FaKey, FaPlus, FaHome, FaTrashAlt, FaDollarSign, FaEnvelope, FaReply,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// ===== Permission metadata =====
const PERMISSION_GROUPS = [
  {
    title: 'Property Management',
    icon: FaHome,
    permissions: [
      {
        key: 'canAddProperties',
        label: 'Add Properties',
        description: 'Create new property listings',
      },
      {
        key: 'canEditProperties',
        label: 'Edit Properties',
        description: 'Modify existing property details',
      },
      {
        key: 'canDeleteProperties',
        label: 'Delete Properties',
        description: 'Remove properties from the system',
      },
      {
        key: 'canRevalueProperties',
        label: 'Revalue Properties',
        description: 'Change property prices and valuation history',
      },
    ],
  },
  {
    title: 'Client Messages',
    icon: FaEnvelope,
    permissions: [
      {
        key: 'canViewMessages',
        label: 'View Messages',
        description: 'See enquiries sent by clients',
      },
      {
        key: 'canReplyMessages',
        label: 'Reply to Messages',
        description: 'Send replies back to clients',
      },
    ],
  },
];

// Flatten for quick lookup
const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions);

// ===== Permission Editor Modal =====
const PermissionsModal = ({ user, onClose, onSave }) => {
  const [permissions, setPermissions] = useState({
    canAddProperties: false,
    canEditProperties: false,
    canDeleteProperties: false,
    canRevalueProperties: false,
    canViewMessages: false,
    canReplyMessages: false,
    ...user.permissions,
  });
  const [isApproved, setIsApproved] = useState(!!user.isApproved);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const toggle = (key) =>
    setPermissions((p) => ({ ...p, [key]: !p[key] }));

  const grantAll = () => {
    const all = {};
    ALL_PERMISSIONS.forEach((p) => (all[p.key] = true));
    setPermissions(all);
  };

  const revokeAll = () => {
    const none = {};
    ALL_PERMISSIONS.forEach((p) => (none[p.key] = false));
    setPermissions(none);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      permissions,
      isApproved,
      role,
    });
    setSaving(false);
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <FaUserShield className="text-neon-gold" />
                Manage Permissions
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {user.name} · {user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Role + Approval row */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-neon !py-2"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1 uppercase tracking-wide">
                Approval Status
              </label>
              <button
                type="button"
                onClick={() => setIsApproved(!isApproved)}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition ${
                  isApproved
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                }`}
              >
                {isApproved ? '✓ Approved' : '⏳ Pending'}
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-white/60 text-sm">
              <strong className="text-neon-gold">{enabledCount}</strong> of{' '}
              {ALL_PERMISSIONS.length} permissions granted
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={grantAll}
                className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30 transition"
              >
                Grant All
              </button>
              <button
                type="button"
                onClick={revokeAll}
                className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
              >
                Revoke All
              </button>
            </div>
          </div>

          {/* Permission groups */}
          <div className="space-y-6">
            {PERMISSION_GROUPS.map((group, gi) => (
              <div key={gi}>
                <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <group.icon className="text-neon-gold" />
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        permissions[perm.key]
                          ? 'bg-neon-gold/10 border-neon-gold/40'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <p className="text-white text-sm font-medium">
                          {perm.label}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {perm.description}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full relative transition ${
                          permissions[perm.key]
                            ? 'bg-neon-gold'
                            : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                            permissions[perm.key] ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </div>
                      <input
                        type="checkbox"
                        checked={!!permissions[perm.key]}
                        onChange={() => toggle(perm.key)}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 btn-neon flex items-center justify-center gap-2"
            >
              <FaCheck /> {saving ? 'Saving...' : 'Save Permissions'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== Main Users Page =====
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // user being edited
  const [filter, setFilter] = useState('all'); // all | admin | agent | user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userId, data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Permissions updated');
      setEditing(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleApproveQuick = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/users/${userId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Agent approved');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${user._id}`,
        { isActive: !user.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (userId, email) => {
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = users.filter((u) => filter === 'all' || u.role === filter);

  // Count enabled permissions for a user
  const countPermissions = (u) => {
    if (!u.permissions) return 0;
    return Object.values(u.permissions).filter(Boolean).length;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-white/50 text-center py-20">Loading users...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-white/50">Grant permissions and manage access.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-white/5 rounded-full p-1 border border-white/10">
          {[
            { k: 'all', label: 'All' },
            { k: 'agent', label: 'Agents' },
            { k: 'admin', label: 'Admins' },
            { k: 'user', label: 'Users' },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                filter === f.k
                  ? 'bg-neon-gold text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white/80">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase">User</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase">Role</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase">Status</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase">Permissions</th>
                <th className="text-right py-3 px-4 text-white/50 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const permCount = countPermissions(u);
                const isAgent = u.role === 'agent';
                return (
                  <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    {/* User info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-gold to-neon-purple flex items-center justify-center text-black text-sm font-bold">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {u.name}
                          </p>
                          <p className="text-white/40 text-xs truncate">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-neon-purple/20 text-neon-purple'
                            : u.role === 'agent'
                            ? 'bg-neon-cyan/20 text-neon-cyan'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Approval / active */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {isAgent && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                              u.isApproved
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {u.isApproved ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                            u.isActive
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Permissions summary */}
                    <td className="py-3 px-4">
                      {isAgent ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-4 rounded-full ${
                                  i < permCount ? 'bg-neon-gold' : 'bg-white/10'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-white/60">
                            {permCount}/6
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/30">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex justify-end items-center gap-2">
                        {isAgent && !u.isApproved && (
                          <button
                            onClick={() => handleApproveQuick(u._id)}
                            className="text-green-400 hover:text-green-300 transition"
                            title="Approve"
                          >
                            <FaUserCheck />
                          </button>
                        )}

                        {isAgent && (
                          <button
                            onClick={() => setEditing(u)}
                            className="flex items-center gap-1 text-neon-gold hover:text-yellow-300 transition text-xs font-medium px-2 py-1 rounded-lg bg-neon-gold/10 hover:bg-neon-gold/20"
                            title="Manage permissions"
                          >
                            <FaKey size={12} /> Permissions
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`text-xs transition ${
                            u.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                          }`}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {u.isActive ? <FaTimes /> : <FaCheck />}
                        </button>

                        <button
                          onClick={() => handleDelete(u._id, u.email)}
                          className="text-red-400 hover:text-red-300 transition"
                          title="Delete user"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/40 text-sm">
            No users in this category.
          </div>
        )}
      </div>

      {/* Permissions Editor Modal */}
      {editing && (
        <PermissionsModal
          user={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => handleSave(editing._id, data)}
        />
      )}
    </AdminLayout>
  );
};

export default Users;