import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTachometerAlt, FaUsers, FaHome, FaEnvelope, FaUserFriends,
  FaSignOutAlt, FaUser, FaBuilding, FaKey, FaCog, FaGlobe,
  FaChevronRight,
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const perms = user?.permissions || {};

  // ===== Sidebar menu =====
  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/admin' },
  ];

  // Properties (admins always; agents only if they have any property permission)
  const agentCanUseProperties =
    isAgent &&
    (perms.canAddProperties ||
      perms.canEditProperties ||
      perms.canDeleteProperties ||
      perms.canRevalueProperties);

  if (isAdmin || agentCanUseProperties) {
    menuItems.push({ icon: FaHome, label: 'Properties', path: '/admin/properties' });
  }

  // Messages
  if (isAdmin || perms.canViewMessages) {
    menuItems.push({ icon: FaEnvelope, label: 'Messages', path: '/admin/contacts' });
  }

  // Admin-only
  if (isAdmin) {
    menuItems.push(
      { icon: FaUsers, label: 'Users', path: '/admin/users' },
      { icon: FaUserFriends, label: 'Team', path: '/admin/team' },
      { icon: FaCog, label: 'Settings', path: '/admin/settings' }
    );
  }

  menuItems.push({ icon: FaKey, label: 'Change Password', path: '/change-password' });

  const roleLabel = isAdmin ? 'Administrator' : isAgent ? 'Agent' : 'User';

  // Page title (longest match first)
  const currentItem = [...menuItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) =>
      item.path === '/admin'
        ? location.pathname === '/admin'
        : location.pathname.startsWith(item.path)
    );
  const pageTitle = currentItem?.label || 'Dashboard';
  const isOnDashboard = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-64 bg-[#0A0A0F] border-r border-white/10 min-h-screen flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/5">
          <Link to="/admin" className="flex items-center space-x-2 group">
            <FaBuilding className="text-neon-gold group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xl font-bold block leading-tight">Baobab</span>
              <span className="text-xs text-white/40">{roleLabel} Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const active =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition group ${
                  active
                    ? 'bg-gradient-to-r from-neon-gold/20 to-neon-purple/10 text-neon-gold border-l-2 border-neon-gold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={
                      active
                        ? 'text-neon-gold'
                        : 'text-white/40 group-hover:text-neon-gold transition'
                    }
                  />
                  <span className="text-sm">{item.label}</span>
                </div>
                {active && <FaChevronRight className="text-xs opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/5 transition text-white/60 hover:text-neon-cyan text-sm"
          >
            <FaGlobe />
            <span>View Site</span>
          </Link>

          <div className="flex items-center space-x-3 px-4 py-3 border-t border-white/5 pt-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-gold to-neon-purple flex items-center justify-center text-black text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg hover:bg-red-500/10 transition text-red-400 hover:text-red-300 text-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <div className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-40 bg-[#0A0A0F]/95 backdrop-blur border-b border-white/5 px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                  isOnDashboard
                    ? 'bg-neon-gold text-black shadow-[0_0_20px_rgba(245,200,66,0.4)]'
                    : 'bg-neon-gold/10 text-neon-gold border border-neon-gold/30 hover:bg-neon-gold hover:text-black'
                }`}
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>

              {!isOnDashboard && (
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <FaChevronRight className="text-white/20 text-xs" />
                  <span className="text-white/70">{pageTitle}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-white/30 hidden sm:inline">
                {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;