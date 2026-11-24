import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const locationUrl =
    'https://www.google.com/maps/search/?api=1&query=2+South+Avenue+Kwekwe+Zimbabwe';

  return (
    <footer className="bg-white border-t border-surface-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
             
              <span className="text-xl font-serif font-bold text-primary">BAOBAB REAL ESTATE</span>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">
              Your trusted partner in finding the perfect property in Zimbabwe.
            </p>
            <div className="flex space-x-3 mt-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-surface-soft flex items-center justify-center text-ink-muted hover:bg-primary hover:text-white transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink mb-4 uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-22 text-sm">
              <li className="flex items-center gap-2 text-ink-muted">
                <FaPhone className="text-primary" size={12} />
                <a href="tel:263776891540" className="hover:text-primary transition">263 776 891 540</a>
              </li>
              <li className="flex items-center gap-2 text-ink-muted">
                <FaPhone className="text-primary" size={12} />
                <a href="tel:263772732861" className="hover:text-primary transition">263 772 732 861</a>
              </li>
              <li className="flex items-center gap-2 text-ink-muted">
                <FaEnvelope className="text-primary" size={12} />
                <a href="mailto:baobabrealestate02@gmail.com" className="hover:text-primary transition break-all">
                  baobabrealestate02@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-ink-muted">
                <FaMapMarkerAlt className="text-primary mt-1" size={12} />
                <a href={locationUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                  2 South Avenue, Kwekwe
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink mb-4 uppercase tracking-wide">
              Newsletter
            </h4>
            <p className="text-ink-muted text-sm mb-3">
              Get the latest listings and updates.
            </p>
            <form className="flex flex-col space-y-2">
              <input type="email" placeholder="Your email" className="input-neon !py-2.5 text-sm" />
              <button className="btn-neon !py-2.5 text-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-surface-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-ink-faint">
          <p>&copy; {currentYear} Baobab Real Estate. All rights reserved.</p>
          <p>2 South Avenue, Kwekwe, Zimbabwe</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;