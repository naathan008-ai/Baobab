import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaEnvelope, FaUsers, FaUserPlus, FaEye, FaPlus,
  FaCheckCircle, FaClock, FaTimesCircle, FaKey,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const roleLabel = isAdmin ? 'Administrator' : 'Agent';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 text-ink-muted">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-ink-muted">Could not load dashboard data.</div>
      </AdminLayout>
    );
  }

  const { properties, messages, users } = stats;

  const statCards = [
    {
      title: isAdmin ? 'Total Properties' : 'My Properties',
      value: properties.total,
      icon: FaHome,
      color: 'bg-primary',
      link: '/admin/properties',
    },
    {
      title: 'Available',
      value: properties.available,
      icon: FaCheckCircle,
      color: 'bg-success',
      link: '/admin/properties',
    },
    {
      title: 'Pending',
      value: properties.pending,
      icon: FaClock,
      color: 'bg-warning',
      link: '/admin/properties',
    },
    {
      title: 'Sold',
      value: properties.sold,
      icon: FaTimesCircle,
      color: 'bg-ink-muted',
      link: '/admin/properties',
    },
  ];

  if (messages.canView) {
    statCards.push({
      title: 'Messages',
      value: messages.total,
      icon: FaEnvelope,
      color: 'bg-accent',
      link: '/admin/contacts',
      badge: messages.new > 0 ? `${messages.new} new` : null,
    });
  }

  if (isAdmin && users) {
    statCards.push({
      title: 'Total Users',
      value: users.totalUsers,
      icon: FaUsers,
      color: 'bg-secondary-dark',
      link: '/admin/users',
    });
    statCards.push({
      title: 'Pending Agents',
      value: users.pendingAgents,
      icon: FaUserPlus,
      color: 'bg-danger',
      link: '/admin/users',
      badge: users.pendingAgents > 0 ? 'Needs review' : null,
    });
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin ? 'bg-accent/10 text-accent' : 'bg-secondary/15 text-secondary-dark'
              }`}
            >
              {roleLabel}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink">Dashboard</h1>
          <p className="text-ink-muted mt-1">Welcome back, {user?.name}.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {properties.canAdd && (
            <Link
              to="/admin/properties/new"
              className="btn-neon flex items-center gap-2 !py-2 !px-4 text-sm"
            >
              <FaPlus /> Add Property
            </Link>
          )}
          {messages.canView && (
            <Link
              to="/admin/contacts"
              className="btn-ghost flex items-center gap-2 !py-2 !px-4 text-sm"
            >
              <FaEnvelope /> View Messages
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className="bg-white rounded-xl p-5 border border-surface-border hover:border-primary/30 transition hover:shadow-premium-lg relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ink-muted text-xs uppercase tracking-wide">{stat.title}</p>
                <p className="text-3xl font-bold text-ink mt-1">{stat.value}</p>
                {stat.badge && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-50 text-primary">
                    {stat.badge}
                  </span>
                )}
              </div>
              <div className={`${stat.color} text-white p-3 rounded-xl`}>
                <stat.icon />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-surface-border shadow-premium">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-serif font-semibold text-ink">
              {isAdmin ? 'Recent Properties' : 'My Recent Properties'}
            </h2>
            <Link to="/admin/properties" className="text-primary hover:underline text-sm font-medium">
              View All
            </Link>
          </div>

          {properties.recent.length === 0 ? (
            <div className="text-center py-8 text-ink-muted">
              <FaHome className="mx-auto text-3xl mb-2 opacity-40" />
              <p className="text-sm">No properties yet.</p>
              {properties.canAdd && (
                <Link to="/admin/properties/new" className="text-primary hover:underline text-sm mt-2 inline-block">
                  Add your first property →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-surface-border">
                  <tr>
                    <th className="text-left py-2 px-3 text-ink-muted text-xs uppercase font-medium">Title</th>
                    <th className="text-left py-2 px-3 text-ink-muted text-xs uppercase font-medium">Price</th>
                    <th className="text-left py-2 px-3 text-ink-muted text-xs uppercase font-medium">Status</th>
                    <th className="text-right py-2 px-3 text-ink-muted text-xs uppercase font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.recent.map((p) => (
                    <tr key={p._id} className="border-b border-surface-border hover:bg-surface-soft transition">
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium text-ink truncate max-w-[220px]">{p.title}</p>
                        <p className="text-xs text-ink-muted truncate max-w-[220px]">
                          {p.location || 'No location'}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-sm text-ink">${p.price?.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            p.status === 'available'
                              ? 'bg-green-50 text-success'
                              : p.status === 'pending'
                              ? 'bg-amber-50 text-warning'
                              : 'bg-gray-100 text-ink-muted'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={properties.canEdit ? `/admin/properties/${p._id}/edit` : `/properties/${p.slug}`}
                          target={!properties.canEdit ? '_blank' : undefined}
                          className="text-primary hover:text-primary-dark transition inline-flex"
                        >
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {isAgent && (
            <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-premium">
              <h2 className="text-lg font-serif font-semibold text-ink mb-4 flex items-center gap-2">
                <FaKey className="text-primary" /> Your Permissions
              </h2>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'Add Properties', allowed: properties.canAdd },
                  { label: 'Edit Properties', allowed: properties.canEdit },
                  { label: 'Delete Properties', allowed: properties.canDelete },
                  { label: 'Revalue Properties', allowed: properties.canRevalue },
                  { label: 'View Messages', allowed: messages.canView },
                ].map((perm, i) => (
                  <li key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                    <span className="text-ink-soft">{perm.label}</span>
                    {perm.allowed ? (
                      <span className="text-success text-xs font-semibold flex items-center gap-1">
                        <FaCheckCircle /> Allowed
                      </span>
                    ) : (
                      <span className="text-danger text-xs font-semibold flex items-center gap-1">
                        <FaTimesCircle /> Not allowed
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages.canView && (
            <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-premium">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-semibold text-ink">Recent Messages</h2>
                <Link to="/admin/contacts" className="text-primary hover:underline text-xs font-medium">
                  View All
                </Link>
              </div>
              {messages.recentMessages.length === 0 ? (
                <p className="text-ink-muted text-sm text-center py-4">No messages yet.</p>
              ) : (
                <ul className="space-y-3">
                  {messages.recentMessages.map((m) => (
                    <li
                      key={m._id}
                      className="border-l-2 border-primary/30 pl-3 py-1 hover:bg-surface-soft transition rounded-r cursor-pointer"
                      onClick={() => navigate(`/admin/contacts/${m._id}`)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium text-ink truncate">{m.name}</p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                            m.status === 'replied'
                              ? 'bg-primary-50 text-primary'
                              : m.status === 'read'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-amber-50 text-warning'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted truncate">
                        {m.propertyTitle || 'General enquiry'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {isAdmin && users && users.pendingAgents > 0 && (
            <div className="rounded-2xl p-6 border border-warning/30 bg-amber-50">
              <h2 className="text-lg font-serif font-semibold text-warning mb-2 flex items-center gap-2">
                <FaUserPlus /> {users.pendingAgents} Pending Agent{users.pendingAgents > 1 ? 's' : ''}
              </h2>
              <p className="text-ink-soft text-sm mb-4">
                New agent registrations are waiting for your approval.
              </p>
              <Link to="/admin/users" className="btn-neon !py-2 !px-4 text-sm inline-flex items-center gap-2">
                <FaEye /> Review Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;