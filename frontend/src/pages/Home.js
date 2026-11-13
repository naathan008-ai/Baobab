import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaSearch, FaHome, FaBuilding, FaMapMarkerAlt, FaBed, FaBath,
  FaRulerCombined, FaArrowRight, FaShieldAlt, FaRocket, FaUsers,
} from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', propertyType: '', minPrice: '' });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties?isFeatured=true`);
        const props = res.data.map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
        setFeaturedProperties(props.slice(0, 6));
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => e.preventDefault();

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 z-10">
          <div className="max-w-3xl animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Find Your<br />
              <span className="text-secondary-light">Dream Home</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl">
              Discover exceptional properties with Baobab Real Estate — where professional service meets trusted expertise in Zimbabwe.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties"
                className="group bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary-light transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-2"
              >
                Explore Properties
                <FaArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/contact"
                className="bg-primary-dark/40 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark/60 transition-all duration-300 border border-white/30"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <section className="relative -mt-10 container mx-auto px-4 z-20">
        <div className="bg-white rounded-xl shadow-premium-lg p-6 border border-surface-border">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                name="search"
                placeholder="Search by location..."
                value={filters.search}
                onChange={handleFilterChange}
                className="input-neon pl-10"
              />
            </div>
            <div className="relative">
              <FaHome className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="input-neon pl-10 appearance-none"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <select
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="input-neon pl-10 appearance-none"
              >
                <option value="">Min Price</option>
                <option value="50000">$50,000</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
                <option value="500000">$500,000</option>
              </select>
            </div>
            <button type="submit" className="btn-neon">
              Search Properties
            </button>
          </form>
        </div>
      </section>

      

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Baobab?</h2>
            <p className="section-subtitle">
              We combine local expertise with global standards to deliver exceptional real estate service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaRocket, title: 'Modern Approach', desc: 'Cutting-edge tools for property discovery and management.' },
              { icon: FaShieldAlt, title: 'Trusted & Secure', desc: 'Verified listings and transparent transactions every time.' },
              { icon: FaUsers, title: 'Expert Team', desc: 'Professional agents with deep local market knowledge.' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-surface-soft hover:shadow-premium-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary text-white flex items-center justify-center text-2xl mb-4">
                  <item.icon />
                </div>
                <h3 className="text-xl font-serif font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-ink-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;