import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', propertyType: '', status: '', minPrice: '', maxPrice: '', bedrooms: ''
  });

  useEffect(() => { fetchProperties(); }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties?${params}`);
      const data = res.data.map(p => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
      setProperties(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); fetchProperties(); };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent mb-8">
          Our Properties
        </h1>

        {/* Search filters – glass */}
        <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input type="text" name="search" placeholder="Search..." value={filters.search} onChange={handleFilterChange} className="input-neon" />
            <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="input-neon appearance-none">
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="input-neon appearance-none">
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
            <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="input-neon appearance-none">
              <option value="">Bedrooms</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <button type="submit" className="btn-neon w-full">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-white/50 py-20">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="text-center text-white/50 py-20">No properties found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const imageUrl = property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg';
              return (
                <div key={property._id} className="glass-card group hover-lift animate-fadeInUp">
                  <div className="relative h-56 overflow-hidden rounded-xl">
                    <ProtectedImage src={imageUrl} alt={property.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
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
                    <p className="text-white/60 flex items-center gap-1 text-sm mt-1">
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
                    <Link to={`/properties/${property.slug}`} className="mt-4 block text-center border border-white/20 rounded-full py-2 text-white/70 hover:text-white hover:border-neon-gold transition-all hover:shadow-[0_0_30px_rgba(245,200,66,0.2)]">
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;