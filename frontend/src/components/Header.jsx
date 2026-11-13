import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars, FaTimes, FaUser, FaSignOutAlt,
  FaTachometerAlt, FaKey, FaCaretDown,
  FaHome, FaBuilding, FaUsers, FaEnvelope,
} from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setAccountDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/properties', label: 'Properties', icon: FaBuilding },
    { to: '/team', label: 'Our Team', icon: FaUsers },
    { to: '/contact', label: 'Contact', icon: FaEnvelope },
  ];

  const canAccessDashboard =
    user && (user.role === 'admin' || user.role === 'agent');

  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
           
            <div>
              <span className="text-xl font-serif font-bold text-primary leading-none block">
                BAOBAB REAL ESTATE
              </span>
              
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 text-ink-soft hover:text-primary transition-colors duration-200 relative group font-medium text-sm"
              >
                <Icon className="text-ink-faint group-hover:text-primary transition-colors" size={14} />
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Account dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center space-x-1.5 text-ink-soft hover:text-primary transition-colors font-medium text-sm"
              >
                <FaUser className="text-ink-faint" />
                <span>{user ? user.name : 'Account'}</span>
                <FaCaretDown className={`text-xs transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-premium-lg py-2 border border-surface-border animate-slideDown origin-top-right">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-surface-border">
                        <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
                        <p className="text-xs text-ink-muted truncate">{user.email}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                          user.role === 'admin'
                            ? 'bg-accent/10 text-accent'
                            : user.role === 'agent'
                            ? 'bg-secondary/15 text-secondary-dark'
                            : 'bg-surface-muted text-ink-muted'
                        }`}>
                          {user.role}
                        </span>
                      </div>

                      {canAccessDashboard && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-ink-soft hover:bg-primary-50 hover:text-primary transition-colors text-sm"
                        >
                          <FaTachometerAlt className="mr-3 text-primary" />
                          Dashboard
                        </Link>
                      )}

                      <Link
                        to="/change-password"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-ink-soft hover:bg-primary-50 hover:text-primary transition-colors text-sm"
                      >
                        <FaKey className="mr-3 text-primary" />
                        Change Password
                      </Link>

                      <div className="my-1 border-t border-surface-border"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-danger hover:bg-red-50 transition-colors text-sm"
                      >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-ink-soft hover:bg-primary-50 hover:text-primary transition-colors text-sm"
                      >
                        <FaUser className="mr-3 text-primary" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-ink-soft hover:bg-primary-50 hover:text-primary transition-colors text-sm"
                      >
                        <FaUser className="mr-3 text-primary" />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          <button
            className="md:hidden text-2xl text-ink-soft"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-surface-border animate-slideDown">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 text-ink-soft hover:text-primary transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="text-primary" /> {label}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="pt-3 border-t border-surface-border">
                    <p className="text-sm font-medium text-ink">{user.name}</p>
                    <p className="text-xs text-ink-muted">{user.email}</p>
                  </div>
                  {canAccessDashboard && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-ink-soft hover:text-primary transition py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTachometerAlt className="text-primary" /> Dashboard
                    </Link>
                  )}
                  <Link
                    to="/change-password"
                    className="flex items-center gap-2 text-ink-soft hover:text-primary transition py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaKey className="text-primary" /> Change Password
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="flex items-center gap-2 text-danger transition py-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 text-ink-soft hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                    <FaUser className="text-primary" /> Sign In
                  </Link>
                  <Link to="/register" className="flex items-center gap-2 text-ink-soft hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                    <FaUser className="text-primary" /> Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;