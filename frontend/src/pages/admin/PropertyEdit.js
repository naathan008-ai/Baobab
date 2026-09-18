import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import ProtectedImage from '../../components/ProtectedImage';
import { FaUpload, FaTimes, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    areaSqM: '',
    location: '',
    propertyType: 'house',
    status: 'available',
    features: '',
    isFeatured: false,
  });
  const [images, setImages] = useState([]);           // new File objects
  const [previewImages, setPreviewImages] = useState([]); // existing URLs + blob URLs
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isNew) fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/properties/id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const p = res.data;

      setFormData({
        title: p.title || '',
        description: p.description || '',
        price: p.price ?? '',
        bedrooms: p.bedrooms ?? '',
        bathrooms: p.bathrooms ?? '',
        areaSqM: p.areaSqM ?? '',
        location: p.location || '',
        propertyType: p.propertyType || 'house',
        status: p.status || 'available',
        features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
        isFeatured: !!p.isFeatured,
      });
      setPreviewImages(p.images || []);
    } catch (error) {
      console.error('Fetch property error:', error);
      if (error.response?.status === 404) {
        setNotFound(true);
        toast.error('Property not found');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load property');
      }
      setTimeout(() => navigate('/admin/properties'), 1500);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + previewImages.filter((p) => !p.startsWith('blob:')).length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImages]);
    setPreviewImages([...previewImages, ...newImages.map((img) => img.preview)]);
  };

  const removeImage = (index) => {
    const previewToRemove = previewImages[index];

    // If it's a blob preview, remove from the new-images array too
    if (previewToRemove.startsWith('blob:')) {
      const remaining = images.filter((img) => img.preview !== previewToRemove);
      setImages(remaining);
    }

    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();

      // Text fields
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value?.toString() ?? '');
      });

      // New images
      images.forEach((img) => fd.append('propertyImages', img.file));

      // Existing images (URLs the frontend wants to keep)
      previewImages
        .filter((url) => !url.startsWith('blob:'))
        .forEach((url) => fd.append('existingImages', url));

      const url = isNew
        ? `${process.env.REACT_APP_API_URL}/properties`
        : `${process.env.REACT_APP_API_URL}/properties/${id}`;
      const method = isNew ? 'post' : 'put';

      await axios[method](url, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(isNew ? 'Property created!' : 'Property updated!');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Save property error:', error.response?.data || error.message);
      const msg = error.response?.data?.message || 'Failed to save property';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 text-white/50">
          Loading property...
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <p className="text-white/60 mb-4">Property not found.</p>
          <button
            onClick={() => navigate('/admin/properties')}
            className="btn-neon"
          >
            Back to Properties
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/properties')}
          className="text-white/50 hover:text-neon-gold transition"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent">
            {isNew ? 'Add New Property' : 'Edit Property'}
          </h1>
          <p className="text-white/50 text-sm">
            {isNew ? 'Create a new property listing' : 'Update the property details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-white/70 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-neon"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Price (USD) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-neon"
              required
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-neon"
              placeholder="e.g. Kwekwe"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="input-neon"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="input-neon"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Area (m²)</label>
            <input
              type="number"
              name="areaSqM"
              value={formData.areaSqM}
              onChange={handleChange}
              className="input-neon"
            />
          </div>

          <div>
            <label className="block text-white/70 mb-1">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="input-neon"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-white/70 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-neon"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-white/70 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="input-neon"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-white/70 mb-1">
              Features (comma separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Swimming pool, Garden, Garage"
              className="input-neon"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 text-white/70">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 accent-neon-gold"
              />
              Feature this property on the homepage
            </label>
          </div>

          {/* Image upload */}
          <div className="md:col-span-2">
            <label className="block text-white/70 mb-2">
              Property Images (max 10)
            </label>
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="flex flex-wrap gap-4 mb-4">
                {previewImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-28 h-28 rounded-lg overflow-hidden border border-white/10 group"
                  >
                    <ProtectedImage
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}

                {previewImages.length < 10 && (
                  <label className="w-28 h-28 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-neon-gold transition">
                    <FaUpload className="text-white/40 text-xl" />
                    <span className="text-white/30 text-xs mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-white/30 text-sm">
                {previewImages.length} / 10 images
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-8 pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={loading}
            className="btn-neon"
          >
            {loading ? 'Saving...' : isNew ? 'Create Property' : 'Update Property'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default PropertyEdit;