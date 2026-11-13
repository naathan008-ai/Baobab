import React, { useState } from 'react';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, formData);
      toast.success('Message sent! We will reply soon.');
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const locationUrl =
    'https://www.google.com/maps/search/?api=1&query=2+South+Avenue+Kwekwe+Zimbabwe';
  const mapEmbedUrl =
    'https://www.google.com/maps?q=2+South+Avenue+Kwekwe+Zimbabwe&output=embed';

  return (
    <div className="min-h-screen bg-surface-soft py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-ink mb-3">Contact Us</h1>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-premium p-6 border border-surface-border">
              <h2 className="text-xl font-serif font-semibold text-ink mb-6">Get in Touch</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm mb-1">Phone</p>
                    <a href="tel:263776891540" className="block text-ink-muted hover:text-primary transition text-sm">
                      263 776 891 540
                    </a>
                    <a href="tel:263772732861" className="block text-ink-muted hover:text-primary transition text-sm">
                      263 772 732 861
                    </a>
                    <a href="tel:263778354267" className="block text-ink-muted hover:text-primary transition text-sm">
                      263 778 354 267
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm mb-1">Email</p>
                    <a
                      href="mailto:baobabrealestate02@gmail.com"
                      className="text-ink-muted hover:text-primary transition text-sm break-all"
                    >
                      baobabrealestate02@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm mb-1">Location</p>
                    <a
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-muted hover:text-primary transition text-sm"
                    >
                      2 South Avenue, Kwekwe, Zimbabwe
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-surface-border">
                <p className="font-medium text-ink text-sm mb-3">Follow Us</p>
                <div className="flex space-x-2">
                  {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 rounded-full bg-surface-soft flex items-center justify-center text-ink-muted hover:bg-primary hover:text-white transition"
                    >
                      <Icon size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-surface-border shadow-premium">
              <iframe
                title="Baobab Real Estate Location"
                src={mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-premium p-8 border border-surface-border">
              <h2 className="text-2xl font-serif font-semibold text-ink mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-neon"
                      disabled={!!user}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-neon"
                      disabled={!!user}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-ink-soft mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-neon"
                    disabled={!!user}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink-soft mb-2">Message *</label>
                  <textarea
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-neon"
                    required
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn-neon w-full">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;