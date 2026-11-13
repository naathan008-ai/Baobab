import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => { fetchProperties(); }, []);

  useEffect(() => {
    if (!search) return setFiltered(properties);
    const q = search.toLowerCase();
    setFiltered(properties.filter((p) =>
      p.title.toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q)
    ));
  }, [search, properties]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties`);
      const data = res.data.map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
      setProperties(data);
      setFiltered(data);
    } catch (error) {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Property deleted');
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <AdminLayout><div className="text-ink-muted text-center py-20">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink">Properties</h1>
          <p className="text-ink-muted mt-1">Manage all properties.</p>
        </div>
        <Link to="/admin/properties/new" className="btn-neon flex items-center gap-2">
          <FaPlus /> Add Property
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-surface-border shadow-premium mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-neon pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-soft border-b border-surface-border">
              <tr>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Title</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Price</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Location</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Status</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Type</th>
                <th className="text-right py-3 px-4 text-ink-muted text-xs uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-surface-border hover:bg-surface-soft transition">
                  <td className="py-3 px-4 text-sm text-ink font-medium">{p.title}</td>
                  <td className="py-3 px-4 text-sm text-ink">${p.price?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-ink-muted">{p.location}</td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4">
                    <span className="bg-primary-50 text-primary px-2 py-1 rounded-full text-[10px] font-medium capitalize">
                      {p.propertyType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end space-x-3">
                      <Link
                        to={`/properties/${p.slug}`}
                        target="_blank"
                        className="text-primary hover:text-primary-dark transition"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/properties/${p._id}/edit`}
                        className="text-secondary-dark hover:text-primary transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        className="text-danger hover:text-red-700 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-ink-muted">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;