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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    <div className="min-h-screen bg-[#0A0A0F] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-white/50 mt-2">
            We'd love to hear from you. Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Get in Touch
              </h2>

              <div className="space-y-4 text-white/70">
                <div className="flex items-start gap-3">
                  <FaPhone className="text-neon-gold mt-1" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <a href="tel:263776891540" className="block hover:text-neon-gold transition">
                      263776891540
                    </a>
                    <a href="tel:263772732861" className="block hover:text-neon-gold transition">
                      263772732861
                    </a>
                    <a href="tel:263778354267" className="block hover:text-neon-gold transition">
                      263778354267
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-neon-gold mt-1" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <a
                      href="mailto:baobabrealestate02@gmail.com"
                      className="hover:text-neon-gold transition break-all"
                    >
                      baobabrealestate02@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-neon-gold mt-1" />
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <a
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-neon-gold transition"
                    >
                      2 South Avenue, Kwekwe, Zimbabwe
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="font-medium text-white mb-3">Follow Us</p>
                <div className="flex space-x-4 text-white/40">
                  <a href="#" className="hover:text-neon-gold transition"><FaFacebook size={22} /></a>
                  <a href="#" className="hover:text-neon-gold transition"><FaTwitter size={22} /></a>
                  <a href="#" className="hover:text-neon-gold transition"><FaInstagram size={22} /></a>
                  <a href="#" className="hover:text-neon-gold transition"><FaLinkedin size={22} /></a>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
              <iframe
                title="Baobab Real Estate Location"
                src={mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 hover:opacity-100 transition"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-neon"
                    disabled={!!user}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-neon"
                    disabled={!!user}
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-neon"
                    disabled={!!user}
                    required
                  />
                </div>

                <div className="mb-6">
                  <textarea
                    name="message"
                    rows="6"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="input-neon"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-neon w-full"
                >
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