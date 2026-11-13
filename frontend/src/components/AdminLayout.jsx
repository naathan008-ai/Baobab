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

  const menuItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/admin' },
  ];

  const agentCanUseProperties =
    isAgent &&
    (perms.canAddProperties || perms.canEditProperties ||
     perms.canDeleteProperties || perms.canRevalueProperties);

  if (isAdmin || agentCanUseProperties) {
    menuItems.push({ icon: FaHome, label: 'Properties', path: '/admin/properties' });
  }

  if (isAdmin || perms.canViewMessages) {
    menuItems.push({ icon: FaEnvelope, label: 'Messages', path: '/admin/contacts' });
  }

  if (isAdmin) {
    menuItems.push(
      { icon: FaUsers, label: 'Users', path: '/admin/users' },
      { icon: FaUserFriends, label: 'Team', path: '/admin/team' },
      { icon: FaCog, label: 'Settings', path: '/admin/settings' }
    );
  }

  menuItems.push({ icon: FaKey, label: 'Change Password', path: '/change-password' });

  const roleLabel = isAdmin ? 'Administrator' : isAgent ? 'Agent' : 'User';

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
    <div className="min-h-screen bg-surface-soft text-ink flex">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-64 bg-white border-r border-surface-border min-h-screen flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-surface-border">
          <Link to="/admin" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              B
            </div>
            <div>
              <span className="text-lg font-serif font-bold text-primary leading-none block">
                Baobab
              </span>
              <span className="text-[10px] uppercase tracking-widest text-ink-muted">
                {roleLabel}
              </span>
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
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg mb-1 transition group text-sm ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink-soft hover:bg-primary-50 hover:text-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={
                      active
                        ? 'text-white'
                        : 'text-ink-faint group-hover:text-primary transition'
                    }
                  />
                  <span>{item.label}</span>
                </div>
                {active && <FaChevronRight className="text-xs opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-surface-muted transition text-ink-muted hover:text-primary text-sm"
          >
            <FaGlobe />
            <span>View Site</span>
          </Link>

          <div className="flex items-center space-x-3 px-4 py-3 border-t border-surface-border pt-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate text-ink">{user?.name}</p>
              <p className="text-xs text-ink-muted truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg hover:bg-red-50 transition text-danger text-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN ============ */}
      <div className="flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-surface-border px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                  isOnDashboard
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-primary-50 text-primary border border-primary-100 hover:bg-primary hover:text-white'
                }`}
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>

              {!isOnDashboard && (
                <div className="hidden md:flex items-center gap-2 text-sm text-ink-muted">
                  <FaChevronRight className="text-ink-faint text-xs" />
                  <span>{pageTitle}</span>
                </div>
              )}
            </div>

            <span className="text-xs text-ink-faint hidden sm:inline">
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;