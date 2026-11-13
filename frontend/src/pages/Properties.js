import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', propertyType: '', status: '', minPrice: '', bedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties?${params}`);
      const data = res.data.map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }));
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-surface-soft py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-ink mb-2">Our Properties</h1>
          <p className="text-ink-muted">Browse our complete collection of available properties.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-premium p-6 border border-surface-border mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                name="search"
                placeholder="Search..."
                value={filters.search}
                onChange={handleFilterChange}
                className="input-neon pl-10"
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
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-neon appearance-none"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="input-neon appearance-none"
            >
              <option value="">Bedrooms</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
            <button type="submit" className="btn-neon">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-ink-muted">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-border">
            <p className="text-lg text-ink-muted">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const imageUrl = property.images?.[0] || '/placeholder.jpg';
              return (
                <div key={property._id} className="glass-card hover-lift group">
                  <div className="relative h-56 overflow-hidden rounded-xl">
                    <ProtectedImage
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        property.status === 'available'
                          ? 'bg-success text-white'
                          : property.status === 'pending'
                          ? 'bg-warning text-white'
                          : 'bg-ink-muted text-white'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-ink group-hover:text-primary transition mb-1">
                      {property.title}
                    </h3>
                    <p className="text-ink-muted mb-4 flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-1.5 text-primary" />
                      {property.location}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${property.price?.toLocaleString()}
                      </span>
                      <span className="text-sm text-ink-muted">{property.areaSqM} m²</span>
                    </div>
                    <div className="flex justify-between text-ink-soft border-t border-surface-border pt-3 text-sm">
                      <span className="flex items-center">
                        <FaBed className="mr-1.5 text-primary" /> {property.bedrooms || 0}
                      </span>
                      <span className="flex items-center">
                        <FaBath className="mr-1.5 text-primary" /> {property.bathrooms || 0}
                      </span>
                      <span className="flex items-center">
                        <FaRulerCombined className="mr-1.5 text-primary" /> {property.areaSqM || 0} m²
                      </span>
                    </div>
                    <Link
                      to={`/properties/${property.slug}`}
                      className="mt-4 block text-center bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition duration-300 font-medium text-sm"
                    >
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