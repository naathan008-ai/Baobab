import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import {
  FaTrash, FaCheck, FaTimes, FaUserCheck, FaUserShield, FaKey,
  FaHome, FaEnvelope,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PERMISSION_GROUPS = [
  {
    title: 'Property Management',
    icon: FaHome,
    permissions: [
      { key: 'canAddProperties', label: 'Add Properties', description: 'Create new property listings' },
      { key: 'canEditProperties', label: 'Edit Properties', description: 'Modify existing property details' },
      { key: 'canDeleteProperties', label: 'Delete Properties', description: 'Remove properties from the system' },
      { key: 'canRevalueProperties', label: 'Revalue Properties', description: 'Change property prices and valuation history' },
    ],
  },
  {
    title: 'Client Messages',
    icon: FaEnvelope,
    permissions: [
      { key: 'canViewMessages', label: 'View Messages', description: 'See enquiries sent by clients' },
      { key: 'canReplyMessages', label: 'Reply to Messages', description: 'Send replies back to clients' },
    ],
  },
];

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions);

const PermissionsModal = ({ user, onClose, onSave }) => {
  const [permissions, setPermissions] = useState({
    canAddProperties: false, canEditProperties: false,
    canDeleteProperties: false, canRevalueProperties: false,
    canViewMessages: false, canReplyMessages: false,
    ...user.permissions,
  });
  const [isApproved, setIsApproved] = useState(!!user.isApproved);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const toggle = (key) => setPermissions((p) => ({ ...p, [key]: !p[key] }));
  const grantAll = () => { const all = {}; ALL_PERMISSIONS.forEach((p) => (all[p.key] = true)); setPermissions(all); };
  const revokeAll = () => { const none = {}; ALL_PERMISSIONS.forEach((p) => (none[p.key] = false)); setPermissions(none); };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ permissions, isApproved, role });
    setSaving(false);
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-surface-border shadow-premium-lg">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-ink flex items-center gap-2">
                <FaUserShield className="text-primary" /> Manage Permissions
              </h2>
              <p className="text-ink-muted text-sm mt-1">{user.name} · {user.email}</p>
            </div>
            <button onClick={onClose} className="text-ink-muted hover:text-ink transition">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-surface-soft border border-surface-border">
            <div>
              <label className="block text-xs text-ink-muted mb-1 uppercase tracking-wide">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input-neon !py-2">
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-ink-muted mb-1 uppercase tracking-wide">Approval</label>
              <button
                type="button"
                onClick={() => setIsApproved(!isApproved)}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition ${
                  isApproved
                    ? 'bg-green-50 text-success border border-green-200'
                    : 'bg-amber-50 text-warning border border-amber-200'
                }`}
              >
                {isApproved ? '✓ Approved' : '⏳ Pending'}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-ink-soft text-sm">
              <strong className="text-primary">{enabledCount}</strong> of {ALL_PERMISSIONS.length} granted
            </p>
            <div className="flex gap-2">
              <button onClick={grantAll} className="text-xs px-3 py-1 rounded-full bg-green-50 text-success hover:bg-green-100 transition">
                Grant All
              </button>
              <button onClick={revokeAll} className="text-xs px-3 py-1 rounded-full bg-red-50 text-danger hover:bg-red-100 transition">
                Revoke All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {PERMISSION_GROUPS.map((group, gi) => (
              <div key={gi}>
                <h3 className="text-xs font-bold text-ink-muted mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <group.icon className="text-primary" /> {group.title}
                </h3>
                <div className="space-y-2">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        permissions[perm.key]
                          ? 'bg-primary-50 border-primary/30'
                          : 'bg-white border-surface-border hover:border-primary/20'
                      }`}
                    >
                      <div className="flex-1 pr-4">
                        <p className="text-ink text-sm font-medium">{perm.label}</p>
                        <p className="text-ink-muted text-xs mt-0.5">{perm.description}</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full relative transition ${permissions[perm.key] ? 'bg-primary' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${permissions[perm.key] ? 'left-5.5' : 'left-0.5'}`} style={{ left: permissions[perm.key] ? '22px' : '2px' }} />
                      </div>
                      <input type="checkbox" checked={!!permissions[perm.key]} onChange={() => toggle(perm.key)} className="hidden" />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-surface-border">
            <button onClick={handleSave} disabled={saving} className="flex-1 btn-neon flex items-center justify-center gap-2">
              <FaCheck /> {saving ? 'Saving...' : 'Save Permissions'}
            </button>
            <button onClick={onClose} className="flex-1 btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (userId, data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Permissions updated');
      setEditing(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleApproveQuick = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Agent approved');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user._id}`, { isActive: !user.isActive }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (userId, email) => {
    if (!window.confirm(`Delete ${email}?`)) return;
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
  const countPermissions = (u) => (!u.permissions ? 0 : Object.values(u.permissions).filter(Boolean).length);

  if (loading) {
    return <AdminLayout><div className="text-ink-muted text-center py-20">Loading users...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink">User Management</h1>
          <p className="text-ink-muted mt-1">Grant permissions and manage access.</p>
        </div>
        <div className="flex gap-2 bg-white rounded-full p-1 border border-surface-border">
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
                filter === f.k ? 'bg-primary text-white font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-soft border-b border-surface-border">
              <tr>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">User</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Role</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Status</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Permissions</th>
                <th className="text-right py-3 px-4 text-ink-muted text-xs uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const permCount = countPermissions(u);
                const isAgent = u.role === 'agent';
                return (
                  <tr key={u._id} className="border-b border-surface-border hover:bg-surface-soft transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-ink text-sm font-medium truncate">{u.name}</p>
                          <p className="text-ink-muted text-xs truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-accent/10 text-accent'
                          : u.role === 'agent'
                          ? 'bg-secondary/15 text-secondary-dark'
                          : 'bg-gray-100 text-ink-muted'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {isAgent && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                            u.isApproved ? 'bg-green-50 text-success' : 'bg-amber-50 text-warning'
                          }`}>
                            {u.isApproved ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${
                          u.isActive ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
                        }`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {isAgent ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className={`w-1.5 h-4 rounded-full ${i < permCount ? 'bg-primary' : 'bg-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-ink-muted">{permCount}/6</span>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-faint">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end items-center gap-2">
                        {isAgent && !u.isApproved && (
                          <button onClick={() => handleApproveQuick(u._id)} className="text-success hover:text-green-700 transition" title="Approve">
                            <FaUserCheck />
                          </button>
                        )}
                        {isAgent && (
                          <button
                            onClick={() => setEditing(u)}
                            className="flex items-center gap-1 text-primary hover:text-primary-dark text-xs font-medium px-2 py-1 rounded-lg bg-primary-50 hover:bg-primary-100"
                            title="Manage permissions"
                          >
                            <FaKey size={12} /> Permissions
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`text-xs transition ${u.isActive ? 'text-danger hover:text-red-700' : 'text-success hover:text-green-700'}`}
                        >
                          {u.isActive ? <FaTimes /> : <FaCheck />}
                        </button>
                        <button onClick={() => handleDelete(u._id, u.email)} className="text-danger hover:text-red-700 transition">
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
          <div className="py-12 text-center text-ink-muted text-sm">No users in this category.</div>
        )}
      </div>

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