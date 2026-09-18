import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaHome, FaBuilding, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaArrowRight, FaShieldAlt, FaRocket, FaUsers } from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', propertyType: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties?isFeatured=true`);
        const props = res.data.map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
        setFeaturedProperties(props.slice(0, 6));
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => e.preventDefault();

  return (
    <div className="min-h-screen">
      {/* Hero with animated background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A1A] via-[#1a0a2e] to-[#0a1a2e]"></div>
        {/* Floating neon orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-purple/20 rounded-full filter blur-3xl animate-floatY"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-neon-gold/10 rounded-full filter blur-3xl animate-floatX"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>

        <div className="relative container mx-auto px-4 py-20 z-10">
          <div className="max-w-3xl animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6" >
              Discover <br />
              <span >
                Extraordinary
              </span>
              <br />Living
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-2xl" >
              Step into a new dimension of real estate – where technology meets timeless elegance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/properties" className="btn-neon flex items-center gap-2">
                Explore Now <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <FaArrowRight className="rotate-90 text-2xl" />
        </div>
      </section>

      {/* Search Bar – glass */}
      <section className="relative -mt-10 container mx-auto px-4 z-20">
        <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-gold/60" />
              <input
                type="text"
                name="search"
                placeholder="Location..."
                value={filters.search}
                onChange={handleFilterChange}
                className="input-neon pl-12"
              />
            </div>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="input-neon appearance-none"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <select
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="input-neon appearance-none"
            >
              <option value="">Min Price</option>
              <option value="50000">$50k</option>
              <option value="100000">$100k</option>
              <option value="200000">$200k</option>
              <option value="500000">$500k</option>
            </select>
            <button type="submit" className="btn-neon w-full">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent">
            Featured Properties
          </h2>
          <p className="text-white/50 mt-2">Curated for the discerning few.</p>
        </div>

        {loading ? (
          <div className="text-center text-white/50">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => {
              const img = property.images?.[0] || '/placeholder.jpg';
              return (
                <div
                  key={property._id}
                  className="glass-card group hover-lift animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-56 overflow-hidden rounded-xl">
                    <ProtectedImage src={img} alt={property.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      property.status === 'available' ? 'bg-green-500/80 text-white' :
                      property.status === 'pending' ? 'bg-yellow-500/80 text-white' :
                      'bg-gray-500/80 text-white'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-neon-gold transition">{property.title}</h3>
                    <p className="text-white/50 flex items-center gap-1 text-sm mt-1">
                      <FaMapMarkerAlt className="text-neon-gold" /> {property.location}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-2xl font-bold text-neon-gold">${property.price.toLocaleString()}</span>
                      <span className="text-sm text-white/40">{property.areaSqM} m²</span>
                    </div>
                    <div className="flex justify-between text-white/40 border-t border-white/10 mt-3 pt-3 text-sm">
                      <span><FaBed className="inline mr-1 text-neon-gold" /> {property.bedrooms}</span>
                      <span><FaBath className="inline mr-1 text-neon-gold" /> {property.bathrooms}</span>
                      <span><FaRulerCombined className="inline mr-1 text-neon-gold" /> {property.areaSqM} m²</span>
                    </div>
                    <Link
                      to={`/properties/${property.slug}`}
                      className="mt-4 block text-center border border-white/20 rounded-full py-2 text-white/70 hover:text-white hover:border-neon-gold transition-all hover:shadow-[0_0_30px_rgba(245,200,66,0.2)]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Us – neon cards */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Why Baobab?
          </h2>
          <p className="text-white/50 mt-2">Reinventing real estate experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FaRocket, title: 'Cutting-Edge', desc: 'AI-powered matching and virtual tours.' },
            { icon: FaShieldAlt, title: 'Secure & Trusted', desc: 'Blockchain-verified transactions.' },
            { icon: FaUsers, title: 'Global Community', desc: 'Connect with buyers and sellers worldwide.' },
          ].map((item, i) => (
            <div
              key={i}
              className="glass-card text-center group hover-lift animate-fadeInUp"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-neon-gold/20 to-neon-purple/20 flex items-center justify-center text-3xl text-neon-gold group-hover:scale-110 transition">
                <item.icon />
              </div>
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="text-white/50 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;