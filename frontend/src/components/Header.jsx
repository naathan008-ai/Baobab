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

  // Close dropdown when clicking outside
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

  // Show dashboard link for admins AND agents
  const canAccessDashboard =
    user && (user.role === 'admin' || user.role === 'agent');

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition group"
          >
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent group-hover:scale-105 transition">
              Baobab
            </span>
            <span className="text-sm font-light text-white/60">Real Estate</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1 text-white/70 hover:text-white transition-all duration-300 relative group"
              >
                <Icon
                  className="text-neon-gold/60 group-hover:text-neon-gold transition-colors"
                  size={16}
                />
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-neon-gold to-neon-purple transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center space-x-1 text-white/70 hover:text-white transition-all duration-300 group focus:outline-none"
              >
                <FaUser className="group-hover:text-neon-gold transition-colors" />
                <span>{user ? user.name : 'Account'}</span>
                <FaCaretDown
                  className={`transition-transform duration-300 ${
                    accountDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 glass rounded-2xl shadow-2xl py-2 border border-white/10 animate-slideDown origin-top-right">
                  {user ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-white/50 truncate">
                          {user.email}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            user.role === 'admin'
                              ? 'bg-neon-purple/20 text-neon-purple'
                              : user.role === 'agent'
                              ? 'bg-neon-cyan/20 text-neon-cyan'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>

                      {/* ✅ Dashboard link for admin AND agent */}
                      {canAccessDashboard && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all hover:pl-6 border-l-2 border-transparent hover:border-neon-gold"
                        >
                          <FaTachometerAlt className="mr-2 text-neon-gold" />
                          Dashboard
                        </Link>
                      )}

                      {/* Change Password */}
                      <Link
                        to="/change-password"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all hover:pl-6 border-l-2 border-transparent hover:border-neon-gold"
                      >
                        <FaKey className="mr-2 text-neon-gold" />
                        Change Password
                      </Link>

                      {/* Divider */}
                      <div className="my-1 border-t border-white/10"></div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 transition-all hover:pl-6"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all hover:pl-6"
                      >
                        <FaUser className="mr-2 text-neon-gold" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all hover:pl-6"
                      >
                        <FaUser className="mr-2 text-neon-gold" />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-2xl text-white/70 hover:text-white transition-transform hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-slideDown">
            <div className="flex flex-col space-y-4">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="text-neon-gold" /> {label}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        user.role === 'admin'
                          ? 'bg-neon-purple/20 text-neon-purple'
                          : user.role === 'agent'
                          ? 'bg-neon-cyan/20 text-neon-cyan'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* ✅ Dashboard in mobile menu too */}
                  {canAccessDashboard && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-white/70 hover:text-neon-gold transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaTachometerAlt className="text-neon-gold" />
                      Dashboard
                    </Link>
                  )}

                  <Link
                    to="/change-password"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaKey className="text-neon-gold" />
                    Change Password
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="text-neon-gold" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaUser className="text-neon-gold" />
                    Sign Up
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