import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome, FaEnvelope, FaUsers, FaUserPlus, FaEye, FaPlus,
  FaCheckCircle, FaClock, FaTimesCircle, FaReply, FaChartLine,
  FaKey, FaCog,
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
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/dashboard/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 text-white/50">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-white/50">
          Could not load dashboard data.
        </div>
      </AdminLayout>
    );
  }

  const { properties, messages, users, clients } = stats;

  // =========================================================
  // BUILD STAT CARDS BASED ON ROLE + PERMISSIONS
  // =========================================================
  const statCards = [];

  // Properties (both roles see this)
  statCards.push({
    title: isAdmin ? 'Total Properties' : 'My Properties',
    value: properties.total,
    icon: FaHome,
    color: 'text-neon-gold',
    link: '/admin/properties',
    show: true,
  });

  statCards.push({
    title: 'Available',
    value: properties.available,
    icon: FaCheckCircle,
    color: 'text-green-400',
    link: '/admin/properties',
    show: true,
  });

  statCards.push({
    title: 'Pending',
    value: properties.pending,
    icon: FaClock,
    color: 'text-yellow-400',
    link: '/admin/properties',
    show: true,
  });

  statCards.push({
    title: 'Sold',
    value: properties.sold,
    icon: FaTimesCircle,
    color: 'text-gray-400',
    link: '/admin/properties',
    show: true,
  });

  // Messages (only if canView)
  if (messages.canView) {
    statCards.push({
      title: 'Messages',
      value: messages.total,
      icon: FaEnvelope,
      color: 'text-neon-purple',
      link: '/admin/contacts',
      show: true,
      badge: messages.new > 0 ? `${messages.new} new` : null,
    });
  }

  // Admin-only cards
  if (isAdmin && users) {
    statCards.push({
      title: 'Total Users',
      value: users.totalUsers,
      icon: FaUsers,
      color: 'text-neon-cyan',
      link: '/admin/users',
      show: true,
    });
    statCards.push({
      title: 'Pending Agents',
      value: users.pendingAgents,
      icon: FaUserPlus,
      color: 'text-red-400',
      link: '/admin/users',
      show: true,
      badge: users.pendingAgents > 0 ? 'Needs review' : null,
    });
  }

  const visibleCards = statCards.filter((c) => c.show);

  return (
    <AdminLayout>
      {/* ============ HEADER ============ */}
      <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin
                  ? 'bg-neon-purple/20 text-neon-purple'
                  : 'bg-neon-cyan/20 text-neon-cyan'
              }`}
            >
              {roleLabel}
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-white/50 mt-1">
            Welcome back, {user?.name}. Here's your overview.
          </p>
        </div>

        {/* Quick actions based on permissions */}
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

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {visibleCards.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className="glass rounded-2xl p-5 border border-white/10 hover:border-neon-gold/30 transition hover:shadow-[0_0_40px_rgba(245,200,66,0.1)] hover:scale-[1.02] duration-300 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wide">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                {stat.badge && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neon-gold/20 text-neon-gold">
                    {stat.badge}
                  </span>
                )}
              </div>
              <div className={`${stat.color} bg-white/5 p-3 rounded-xl text-xl`}>
                <stat.icon />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ============ TWO COLUMN LAYOUT ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties (both roles) */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {isAdmin ? 'Recent Properties' : 'My Recent Properties'}
            </h2>
            <Link
              to="/admin/properties"
              className="text-neon-gold hover:underline text-sm"
            >
              View All
            </Link>
          </div>

          {properties.recent.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <FaHome className="mx-auto text-3xl mb-2 opacity-50" />
              <p>No properties yet.</p>
              {properties.canAdd && (
                <Link
                  to="/admin/properties/new"
                  className="text-neon-gold hover:underline text-sm mt-2 inline-block"
                >
                  Add your first property →
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white/80">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left py-3 px-3 text-white/50 text-xs uppercase">Title</th>
                    <th className="text-left py-3 px-3 text-white/50 text-xs uppercase">Price</th>
                    <th className="text-left py-3 px-3 text-white/50 text-xs uppercase">Status</th>
                    <th className="text-right py-3 px-3 text-white/50 text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.recent.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium truncate max-w-[220px]">
                          {p.title}
                        </p>
                        <p className="text-xs text-white/40 truncate max-w-[220px]">
                          {p.location || 'No location'}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-sm">
                        ${p.price?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                            p.status === 'available'
                              ? 'bg-green-500/20 text-green-300'
                              : p.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {properties.canEdit ? (
                          <Link
                            to={`/admin/properties/${p._id}/edit`}
                            className="text-neon-cyan hover:text-neon-gold transition inline-flex"
                            title="Edit"
                          >
                            <FaEye />
                          </Link>
                        ) : (
                          <Link
                            to={`/properties/${p.slug}`}
                            target="_blank"
                            className="text-neon-cyan hover:text-neon-gold transition inline-flex"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                        )}
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
          {/* Permissions summary (agents) */}
          {isAgent && (
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaKey className="text-neon-gold" /> Your Permissions
              </h2>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'Add Properties', allowed: properties.canAdd },
                  { label: 'Edit Properties', allowed: properties.canEdit },
                  { label: 'Delete Properties', allowed: properties.canDelete },
                  { label: 'Revalue Properties', allowed: properties.canRevalue },
                  { label: 'View Messages', allowed: messages.canView },
                ].map((perm, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-white/5"
                  >
                    <span className="text-white/70">{perm.label}</span>
                    {perm.allowed ? (
                      <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                        <FaCheckCircle /> Allowed
                      </span>
                    ) : (
                      <span className="text-red-400 text-xs font-semibold flex items-center gap-1">
                        <FaTimesCircle /> Not allowed
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent Messages (if permitted) */}
          {messages.canView && (
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
                <Link
                  to="/admin/contacts"
                  className="text-neon-gold hover:underline text-xs"
                >
                  View All
                </Link>
              </div>

              {messages.recentMessages.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">
                  No messages yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {messages.recentMessages.map((m) => (
                    <li
                      key={m._id}
                      className="border-l-2 border-neon-gold/40 pl-3 py-1 hover:bg-white/5 transition rounded-r cursor-pointer"
                      onClick={() => navigate(`/admin/contacts/${m._id}`)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium text-white truncate">
                          {m.name}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                            m.status === 'replied'
                              ? 'bg-neon-gold/20 text-neon-gold'
                              : m.status === 'read'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate">
                        {m.propertyTitle || 'General enquiry'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Admin-only: pending agents alert */}
          {isAdmin && users && users.pendingAgents > 0 && (
            <div className="rounded-2xl p-6 border border-yellow-500/30 bg-yellow-500/5">
              <h2 className="text-lg font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                <FaUserPlus /> {users.pendingAgents} Pending Agent{users.pendingAgents > 1 ? 's' : ''}
              </h2>
              <p className="text-white/60 text-sm mb-4">
                New agent registrations are waiting for your approval.
              </p>
              <Link
                to="/admin/users"
                className="btn-neon !py-2 !px-4 text-sm inline-flex items-center gap-2"
              >
                <FaEye /> Review Now
              </Link>
            </div>
          )}

          {/* Admin-only: recent users */}
          {isAdmin && users && users.recentUsers && users.recentUsers.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">New Users</h2>
                <Link
                  to="/admin/users"
                  className="text-neon-gold hover:underline text-xs"
                >
                  Manage
                </Link>
              </div>
              <ul className="space-y-2">
                {users.recentUsers.map((u) => (
                  <li
                    key={u._id}
                    className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{u.name}</p>
                      <p className="text-xs text-white/40 truncate">{u.email}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                        u.role === 'admin'
                          ? 'bg-neon-purple/20 text-neon-purple'
                          : u.role === 'agent'
                          ? 'bg-neon-cyan/20 text-neon-cyan'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {u.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;