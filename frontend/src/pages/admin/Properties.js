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

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!search) return setFiltered(properties);
    const q = search.toLowerCase();
    setFiltered(
      properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.location || '').toLowerCase().includes(q)
      )
    );
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

  if (loading)
    return (
      <AdminLayout>
        <div className="text-white/50 text-center py-20">Loading...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent">
            Properties
          </h1>
          <p className="text-white/50">Manage all properties.</p>
        </div>
        <Link to="/admin/properties/new" className="btn-neon flex items-center gap-2">
          <FaPlus /> Add Property
        </Link>
      </div>

      <div className="glass rounded-2xl p-4 border border-white/10 mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-neon pl-10"
          />
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white/80">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-white/50">Title</th>
                <th className="text-left py-3 px-4 text-white/50">Price</th>
                <th className="text-left py-3 px-4 text-white/50">Location</th>
                <th className="text-left py-3 px-4 text-white/50">Status</th>
                <th className="text-left py-3 px-4 text-white/50">Type</th>
                <th className="text-left py-3 px-4 text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3 px-4">{p.title}</td>
                  <td className="py-3 px-4">${p.price?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-white/60">{p.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'available'
                          ? 'bg-green-500/30 text-green-300'
                          : p.status === 'pending'
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : 'bg-gray-500/30 text-gray-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-white/10 px-2 py-1 rounded-full text-xs text-white/60">
                      {p.propertyType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/properties/${p.slug}`}
                        target="_blank"
                        className="text-neon-cyan hover:text-neon-gold transition"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/admin/properties/${p._id}/edit`}
                        className="text-neon-cyan hover:text-neon-gold transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;