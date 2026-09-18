import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// ===== Layouts =====
import Layout from './components/Layout';

// ===== Public Pages =====
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';

// ===== Admin / Agent Pages =====
import AdminDashboard from './pages/admin/Dashboard';
import AdminProperties from './pages/admin/Properties';
import AdminPropertyEdit from './pages/admin/PropertyEdit';
import AdminContacts from './pages/admin/Contacts';
import AdminContactDetail from './pages/admin/ContactDetail';

// ===== Admin Only Pages =====
import AdminUsers from './pages/admin/Users';
import AdminTeam from './pages/admin/Team';
import AdminSettings from './pages/admin/Settings';

// =========================================================
// ProtectedRoute
// =========================================================
const ProtectedRoute = ({ children, allowedRoles, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0A0A0F] text-white/50">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only shortcut
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Role allow-list (e.g. ['admin', 'agent'])
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// =========================================================
// App
// =========================================================
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* =============================================== */}
        {/* PUBLIC ROUTES */}
        {/* =============================================== */}
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:slug" element={<PropertyDetail />} />
        <Route path="team" element={<Team />} />
        <Route path="contact" element={<Contact />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* =============================================== */}
        {/* ANY AUTHENTICATED USER */}
        {/* =============================================== */}
        <Route
          path="change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* =============================================== */}
        {/* ADMIN + AGENTS */}
        {/* =============================================== */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/properties"
          element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <AdminProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/properties/new"
          element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <AdminPropertyEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/properties/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <AdminPropertyEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/contacts"
          element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <AdminContacts />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/contacts/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'agent']}>
              <AdminContactDetail />
            </ProtectedRoute>
          }
        />

        {/* =============================================== */}
        {/* ADMIN ONLY */}
        {/* =============================================== */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/team"
          element={
            <ProtectedRoute adminOnly>
              <AdminTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/settings"
          element={
            <ProtectedRoute adminOnly>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* =============================================== */}
        {/* FALLBACK — unknown routes → home */}
        {/* =============================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;