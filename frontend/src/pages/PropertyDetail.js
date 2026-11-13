import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquiryData, setEnquiryData] = useState({
    name: '', email: '', phone: '', message: '', propertyId: '', propertyTitle: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/${slug}`);
        const data = { ...res.data, images: Array.isArray(res.data.images) ? res.data.images : [] };
        setProperty(data);
        setEnquiryData((prev) => ({ ...prev, propertyId: data._id, propertyTitle: data.title }));
      } catch (error) {
        toast.error('Property not found');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug, navigate]);

  const handleEnquiryChange = (e) => setEnquiryData({ ...enquiryData, [e.target.name]: e.target.value });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, enquiryData);
      toast.success('Enquiry sent successfully!');
      setEnquiryData({ ...enquiryData, name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send enquiry.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center text-ink-muted">
        Loading property...
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-surface-soft py-12">
      <div className="container mx-auto px-4">
        {/* Images */}
        <div className="bg-white rounded-2xl shadow-premium overflow-hidden mb-8 border border-surface-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2 h-96">
              <ProtectedImage
                src={property.images[0] || '/placeholder.jpg'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-cols-2 gap-2">
              {property.images.slice(1, 5).map((img, i) => (
                <div key={i} className="h-48">
                  <ProtectedImage
                    src={img}
                    alt={`${property.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-premium p-6 border border-surface-border">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-serif font-bold text-ink">{property.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    property.status === 'available'
                      ? 'bg-green-50 text-success'
                      : property.status === 'pending'
                      ? 'bg-amber-50 text-warning'
                      : 'bg-gray-100 text-ink-muted'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <p className="text-ink-muted flex items-center mb-6">
                <FaMapMarkerAlt className="mr-2 text-primary" />
                {property.location}
              </p>

              <div className="flex flex-wrap gap-6 mb-6 text-ink-soft">
                <span className="flex items-center">
                  <FaBed className="mr-2 text-primary" /> {property.bedrooms || 0} Bedrooms
                </span>
                <span className="flex items-center">
                  <FaBath className="mr-2 text-primary" /> {property.bathrooms || 0} Bathrooms
                </span>
                <span className="flex items-center">
                  <FaRulerCombined className="mr-2 text-primary" /> {property.areaSqM || 0} m²
                </span>
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-primary" />
                  Listed: {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="border-t border-surface-border pt-6">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  ${property.price?.toLocaleString()}
                </h2>
                <h3 className="text-xl font-serif font-semibold text-ink mb-3">Description</h3>
                <p className="text-ink-soft leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {property.features && property.features.length > 0 && (
                <div className="border-t border-surface-border pt-6 mt-6">
                  <h3 className="text-xl font-serif font-semibold text-ink mb-3">Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {property.features.map((f, i) => (
                      <li key={i} className="text-ink-soft flex items-start">
                        <span className="text-primary mr-2">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Enquiry sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-premium p-6 border border-surface-border sticky top-24">
              <h3 className="text-xl font-serif font-semibold text-ink mb-4">Make an Enquiry</h3>
              <form onSubmit={handleEnquirySubmit}>
                <div className="space-y-4">
                  {!user && (
                    <>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={enquiryData.name}
                        onChange={handleEnquiryChange}
                        className="input-neon"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={enquiryData.email}
                        onChange={handleEnquiryChange}
                        className="input-neon"
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone"
                        value={enquiryData.phone}
                        onChange={handleEnquiryChange}
                        className="input-neon"
                        required
                      />
                    </>
                  )}
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us what you'd like to know about this property..."
                    value={enquiryData.message}
                    onChange={handleEnquiryChange}
                    className="input-neon"
                    required
                  ></textarea>
                  <button type="submit" className="btn-neon w-full">
                    Send Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;