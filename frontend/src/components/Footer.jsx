import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // 2 South Avenue, Kwekwe – opens Google Maps directly
  const locationUrl =
    'https://www.google.com/maps/search/?api=1&query=2+South+Avenue+Kwekwe+Zimbabwe';

  return (
    <footer className="glass border-t border-white/5 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent mb-4">
              Baobab
            </h3>
            <p className="text-white/60 text-sm">
              Where vision meets reality – discover your future home.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/40 hover:text-neon-gold transition text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-white/40 hover:text-neon-gold transition text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-white/40 hover:text-neon-gold transition text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-white/40 hover:text-neon-gold transition text-xl">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/50 hover:text-neon-gold transition">Home</Link></li>
              <li><Link to="/properties" className="text-white/50 hover:text-neon-gold transition">Properties</Link></li>
              <li><Link to="/team" className="text-white/50 hover:text-neon-gold transition">Our Team</Link></li>
              <li><Link to="/contact" className="text-white/50 hover:text-neon-gold transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <FaPhone className="text-neon-gold" /> 263776891540
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-neon-gold" /> 263772732861
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-neon-gold" /> baobabrealestate02@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-neon-gold" />
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neon-gold transition"
                >
                  2 South Avenue, Kwekwe
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Newsletter</h4>
            <p className="text-white/50 text-sm mb-4">
              Get the latest listings and updates.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="input-neon !py-3 text-sm"
              />
              <button className="btn-neon !py-3 text-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/30 text-sm">
          &copy; {currentYear} Baobab Real Estate · 2 South Avenue, Kwekwe, Zimbabwe
        </div>
      </div>
    </footer>
  );
};

export default Footer;