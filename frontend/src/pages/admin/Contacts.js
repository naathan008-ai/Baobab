import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { FaEye, FaCheck, FaReply, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | new | read | replied

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/contact/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filtered = contacts.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

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
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-white/50">Client enquiries and replies.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-white/5 rounded-full p-1 border border-white/10">
          {['all', 'new', 'read', 'replied'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
                filter === f
                  ? 'bg-neon-gold text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white/80">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-white/50">Name</th>
                <th className="text-left py-3 px-4 text-white/50">Email</th>
                <th className="text-left py-3 px-4 text-white/50">Property</th>
                <th className="text-left py-3 px-4 text-white/50">Date</th>
                <th className="text-left py-3 px-4 text-white/50">Replies</th>
                <th className="text-left py-3 px-4 text-white/50">Status</th>
                <th className="text-left py-3 px-4 text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-white/40">
                    <FaEnvelope className="inline mr-2" />
                    No messages to show.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4">{c.name}</td>
                    <td className="py-3 px-4 text-white/60">{c.email}</td>
                    <td className="py-3 px-4 text-white/50">
                      {c.propertyTitle || 'General'}
                    </td>
                    <td className="py-3 px-4 text-white/50">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-white/60">
                      {c.replies?.length || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'replied'
                            ? 'bg-neon-gold/20 text-neon-gold'
                            : c.status === 'read'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/contacts/${c._id}`}
                          className="text-neon-cyan hover:text-neon-gold transition"
                          title="View & Reply"
                        >
                          <FaReply />
                        </Link>
                        {c.status === 'new' && (
                          <button
                            onClick={() => markAsRead(c._id)}
                            className="text-green-400 hover:text-green-300 transition"
                            title="Mark as read"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Contacts;