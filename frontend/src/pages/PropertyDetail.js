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
    name: '', email: '', phone: '', message: '', propertyId: '', propertyTitle: ''
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/properties/${slug}`);
        const data = { ...res.data, images: Array.isArray(res.data.images) ? res.data.images : [] };
        setProperty(data);
        setEnquiryData({ ...enquiryData, propertyId: data._id, propertyTitle: data.title });
      } catch (error) {
        toast.error('Property not found');
        navigate('/properties');
      } finally { setLoading(false); }
    };
    fetchProperty();
  }, [slug]);

  const handleEnquiryChange = (e) => setEnquiryData({ ...enquiryData, [e.target.name]: e.target.value });
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, enquiryData);
      toast.success('Enquiry sent!');
      setEnquiryData({ ...enquiryData, name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send enquiry.');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-white/50">Loading...</div>;
  if (!property) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="container mx-auto px-4">
        {/* Images */}
        <div className="glass rounded-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2 h-96">
              <ProtectedImage src={property.images[0] || '/placeholder.jpg'} alt={property.title} className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:grid grid-cols-2 gap-2">
              {property.images.slice(1, 5).map((img, i) => (
                <div key={i} className="h-48">
                  <ProtectedImage src={img} alt={`${property.title} ${i+2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-serif font-bold text-white">{property.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
                  property.status === 'available' ? 'bg-green-500/80 text-white' :
                  property.status === 'pending' ? 'bg-yellow-500/80 text-white' :
                  'bg-gray-500/80 text-white'
                }`}>
                  {property.status}
                </span>
              </div>
              <p className="text-white/60 flex items-center gap-2 mb-4"><FaMapMarkerAlt className="text-neon-gold" /> {property.location}</p>
              <div className="flex flex-wrap gap-6 mb-6 text-white/80">
                <span><FaBed className="inline mr-1 text-neon-gold" /> {property.bedrooms} Bedrooms</span>
                <span><FaBath className="inline mr-1 text-neon-gold" /> {property.bathrooms} Bathrooms</span>
                <span><FaRulerCombined className="inline mr-1 text-neon-gold" /> {property.areaSqM} m²</span>
                <span><FaCalendarAlt className="inline mr-1 text-neon-gold" /> Listed: {new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="border-t border-white/10 pt-6">
                <h2 className="text-2xl font-bold text-neon-gold mb-4">${property.price.toLocaleString()}</h2>
                <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                <p className="text-white/70 leading-relaxed">{property.description}</p>
              </div>
              {property.features && property.features.length > 0 && (
                <div className="border-t border-white/10 pt-6 mt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Features</h3>
                  <ul className="grid grid-cols-2 gap-2 text-white/60">
                    {property.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Enquiry Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-white mb-4">Make an Enquiry</h3>
              <form onSubmit={handleEnquirySubmit}>
                <div className="space-y-4">
                  {!user && (
                    <>
                      <input type="text" name="name" placeholder="Your Name" value={enquiryData.name} onChange={handleEnquiryChange} className="input-neon" required />
                      <input type="email" name="email" placeholder="Your Email" value={enquiryData.email} onChange={handleEnquiryChange} className="input-neon" required />
                      <input type="tel" name="phone" placeholder="Your Phone" value={enquiryData.phone} onChange={handleEnquiryChange} className="input-neon" required />
                    </>
                  )}
                  <textarea name="message" rows="4" placeholder="Message..." value={enquiryData.message} onChange={handleEnquiryChange} className="input-neon" required></textarea>
                  <button type="submit" className="btn-neon w-full">Send Enquiry</button>
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