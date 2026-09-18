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

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/contact/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    if (!reply.trim()) {
      toast.error('Please type a reply');
      return;
    }

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-white/50 text-center py-20">Loading...</div>
      </AdminLayout>
    );
  }

  if (!contact) {
    return (
      <AdminLayout>
        <div className="text-white/50 text-center py-20">Message not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          to="/admin/contacts"
          className="text-white/60 hover:text-neon-gold transition inline-flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Messages
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Client Info</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FaUser className="text-neon-gold mt-1" />
                <div>
                  <p className="text-white/40 text-xs">Name</p>
                  <p className="text-white">{contact.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaEnvelope className="text-neon-gold mt-1" />
                <div>
                  <p className="text-white/40 text-xs">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-neon-cyan hover:text-neon-gold transition break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaPhone className="text-neon-gold mt-1" />
                <div>
                  <p className="text-white/40 text-xs">Phone</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-neon-cyan hover:text-neon-gold transition"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaClock className="text-neon-gold mt-1" />
                <div>
                  <p className="text-white/40 text-xs">Received</p>
                  <p className="text-white">
                    {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {contact.propertyTitle && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs mb-1">Property Enquiry</p>
                  <p className="text-neon-gold">{contact.propertyTitle}</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/40 text-xs mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    contact.status === 'replied'
                      ? 'bg-neon-gold/20 text-neon-gold'
                      : contact.status === 'read'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}
                >
                  {contact.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages column */}
        <div className="lg:col-span-2">
          {/* Original message */}
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              Original Message
            </h2>
            <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
              {contact.message}
            </p>
          </div>

          {/* Conversation thread */}
          {contact.replies && contact.replies.length > 0 && (
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Conversation ({contact.replies.length})
              </h2>
              <div className="space-y-4">
                {contact.replies.map((r, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-neon-gold/40 pl-4 py-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-neon-gold text-sm font-semibold">
                        {r.repliedByName}
                      </p>
                      <p className="text-white/40 text-xs">
                        {new Date(r.repliedAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap">
                      {r.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply form */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Send Reply</h2>
            <form onSubmit={handleSendReply}>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows="5"
                placeholder="Type your reply to the client..."
                className="input-neon mb-4"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-neon flex items-center gap-2"
              >
                <FaPaperPlane />
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
              <p className="text-white/40 text-xs mt-2">
                A copy will be sent to {contact.email}
              </p>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactDetail;