import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import {
  FaArrowLeft, FaEnvelope, FaPhone, FaUser, FaPaperPlane, FaClock,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchContact(); }, [id]);

  const fetchContact = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContact(res.data);
    } catch (error) {
      toast.error('Failed to load message');
      navigate('/admin/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return toast.error('Please type a reply');
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/contact/${id}/reply`,
        { message: reply.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContact(res.data.contact);
      setReply('');
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <AdminLayout><div className="text-ink-muted text-center py-20">Loading...</div></AdminLayout>;
  if (!contact) return <AdminLayout><div className="text-ink-muted text-center py-20">Message not found.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link to="/admin/contacts" className="text-ink-muted hover:text-primary transition inline-flex items-center gap-2">
          <FaArrowLeft /> Back to Messages
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-premium">
            <h2 className="text-xl font-serif font-semibold text-ink mb-4">Client Info</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <FaUser className="text-primary mt-1" />
                <div>
                  <p className="text-ink-muted text-xs">Name</p>
                  <p className="text-ink">{contact.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-primary mt-1" />
                <div>
                  <p className="text-ink-muted text-xs">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline break-all">{contact.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-primary mt-1" />
                <div>
                  <p className="text-ink-muted text-xs">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-primary hover:underline">{contact.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaClock className="text-primary mt-1" />
                <div>
                  <p className="text-ink-muted text-xs">Received</p>
                  <p className="text-ink">{new Date(contact.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {contact.propertyTitle && (
                <div className="pt-4 border-t border-surface-border">
                  <p className="text-ink-muted text-xs mb-1">Property</p>
                  <p className="text-primary font-medium">{contact.propertyTitle}</p>
                </div>
              )}
              <div className="pt-4 border-t border-surface-border">
                <p className="text-ink-muted text-xs mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  contact.status === 'replied'
                    ? 'bg-primary-50 text-primary'
                    : contact.status === 'read'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-amber-50 text-warning'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-premium mb-6">
            <h2 className="text-lg font-serif font-semibold text-ink mb-3">Original Message</h2>
            <p className="text-ink-soft whitespace-pre-wrap leading-relaxed">{contact.message}</p>
          </div>

          {contact.replies && contact.replies.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-premium mb-6">
              <h2 className="text-lg font-serif font-semibold text-ink mb-4">
                Conversation ({contact.replies.length})
              </h2>
              <div className="space-y-4">
                {contact.replies.map((r, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-4 py-2">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-primary text-sm font-semibold">{r.repliedByName}</p>
                      <p className="text-ink-faint text-xs">{new Date(r.repliedAt).toLocaleString()}</p>
                    </div>
                    <p className="text-ink-soft whitespace-pre-wrap">{r.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-premium">
            <h2 className="text-lg font-serif font-semibold text-ink mb-3">Send Reply</h2>
            <form onSubmit={handleSendReply}>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows="5"
                placeholder="Type your reply to the client..."
                className="input-neon mb-4"
                required
              />
              <button type="submit" disabled={sending} className="btn-neon flex items-center gap-2">
                <FaPaperPlane />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
              <p className="text-ink-faint text-xs mt-2">A copy will be sent to {contact.email}</p>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactDetail;