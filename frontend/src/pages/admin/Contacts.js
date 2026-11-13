import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { FaCheck, FaReply, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filtered = contacts.filter((c) => filter === 'all' || c.status === filter);

  if (loading) {
    return <AdminLayout><div className="text-ink-muted text-center py-20">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink">Messages</h1>
          <p className="text-ink-muted mt-1">Client enquiries and replies.</p>
        </div>
        <div className="flex gap-2 bg-white rounded-full p-1 border border-surface-border">
          {['all', 'new', 'read', 'replied'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm transition capitalize ${
                filter === f ? 'bg-primary text-white font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-soft border-b border-surface-border">
              <tr>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Name</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Email</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Property</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Date</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Replies</th>
                <th className="text-left py-3 px-4 text-ink-muted text-xs uppercase font-medium">Status</th>
                <th className="text-right py-3 px-4 text-ink-muted text-xs uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-ink-muted">
                    <FaEnvelope className="inline mr-2 text-ink-faint" />
                    No messages to show.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="border-b border-surface-border hover:bg-surface-soft transition">
                    <td className="py-3 px-4 text-sm text-ink font-medium">{c.name}</td>
                    <td className="py-3 px-4 text-sm text-ink-muted">{c.email}</td>
                    <td className="py-3 px-4 text-sm text-ink-soft">{c.propertyTitle || 'General'}</td>
                    <td className="py-3 px-4 text-sm text-ink-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-ink-soft">{c.replies?.length || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        c.status === 'replied'
                          ? 'bg-primary-50 text-primary'
                          : c.status === 'read'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-amber-50 text-warning'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/admin/contacts/${c._id}`} className="text-primary hover:text-primary-dark transition" title="View & Reply">
                          <FaReply />
                        </Link>
                        {c.status === 'new' && (
                          <button onClick={() => markAsRead(c._id)} className="text-success hover:text-green-700 transition" title="Mark as read">
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