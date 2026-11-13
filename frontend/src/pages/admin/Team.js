import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import ProtectedImage from '../../components/ProtectedImage';
import { FaEdit, FaTrash, FaPlus, FaUpload, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '', title: '', bio: '', email: '', phone: '', order: 0,
    socialLinks: { linkedin: '', twitter: '', facebook: '' },
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/team`);
      setMembers(res.data);
    } catch (error) {
      toast.error('Failed to fetch team');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const resetForm = () => {
    setFormData({
      name: '', title: '', bio: '', email: '', phone: '', order: 0,
      socialLinks: { linkedin: '', twitter: '', facebook: '' },
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setEditingMember(null);
    setShowForm(false);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name, title: member.title, bio: member.bio,
      email: member.email, phone: member.phone || '', order: member.order || 0,
      socialLinks: member.socialLinks || { linkedin: '', twitter: '', facebook: '' },
    });
    setPhotoPreview(member.photo);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'socialLinks') fd.append(key, JSON.stringify(formData[key]));
        else fd.append(key, formData[key]);
      });
      if (photoFile) fd.append('teamPhoto', photoFile);

      const url = editingMember
        ? `${process.env.REACT_APP_API_URL}/team/${editingMember._id}`
        : `${process.env.REACT_APP_API_URL}/team`;
      const method = editingMember ? 'put' : 'post';

      await axios[method](url, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success(editingMember ? 'Updated!' : 'Added!');
      resetForm();
      fetchMembers();
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Deleted');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <AdminLayout><div className="text-ink-muted text-center py-20">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink">Team Management</h1>
          <p className="text-ink-muted mt-1">Manage your team members.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-neon flex items-center gap-2">
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-2xl overflow-hidden border border-surface-border shadow-premium hover:shadow-premium-lg transition group">
            <div className="relative h-56 overflow-hidden">
              <ProtectedImage src={member.photo || '/default-avatar.jpg'} alt={member.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-serif font-semibold text-ink">{member.name}</h3>
              <p className="text-primary text-sm font-medium">{member.title}</p>
              <p className="text-ink-muted text-sm mt-2 line-clamp-2">{member.bio}</p>
              <div className="flex space-x-2 mt-4 pt-4 border-t border-surface-border">
                <button onClick={() => handleEdit(member)} className="flex-1 btn-neon !py-2 !text-sm flex items-center justify-center gap-1">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(member._id, member.name)} className="flex-1 bg-red-50 text-danger px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1 text-sm font-medium">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-surface-border shadow-premium-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-ink">{editingMember ? 'Edit' : 'Add'} Team Member</h2>
              <button onClick={resetForm} className="text-ink-muted hover:text-ink transition"><FaTimes size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-neon" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-neon" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Bio *</label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" className="input-neon" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-neon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-neon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Order</label>
                <input type="number" name="order" value={formData.order} onChange={handleInputChange} className="input-neon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Social Links</label>
                <input type="url" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleInputChange} placeholder="LinkedIn" className="input-neon mb-2" />
                <input type="url" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleInputChange} placeholder="Twitter" className="input-neon mb-2" />
                <input type="url" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleInputChange} placeholder="Facebook" className="input-neon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-soft mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {photoPreview && <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />}
                  <label className="bg-surface-soft px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-50 transition text-ink-soft border border-surface-border">
                    <FaUpload className="inline mr-2 text-primary" /> {photoPreview ? 'Change' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 pt-4 border-t border-surface-border">
                <button type="submit" disabled={submitting} className="btn-neon flex-1">
                  {submitting ? 'Saving...' : editingMember ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeam;