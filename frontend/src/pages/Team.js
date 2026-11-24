import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/team`);
        
        // LOG THIS so you can see exactly what the backend is sending in the console!
        console.log("Team API Response:", res.data);

        let list = [];
        // Manually check every possible format
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if (res.data && Array.isArray(res.data.team)) {
          list = res.data.team;
        } else if (res.data && Array.isArray(res.data.data)) {
          list = res.data.data;
        } else {
          console.error("Backend returned invalid data format:", res.data);
        }

        setMembers(list);
      } catch (err) {
        console.error('Failed to load team:', err);
        setError('Could not load team members at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // If loading, show spinner
  if (loading) {
    return <div className="min-h-screen bg-surface-soft flex justify-center items-center text-ink-muted">Loading team...</div>;
  }

  // If error, show error message instead of crashing
  if (error) {
    return <div className="min-h-screen bg-surface-soft flex justify-center items-center text-danger">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-surface-soft py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-ink mb-3">Our Team</h1>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Meet the professionals behind Baobab Real Estate. We're here to help you find your dream home.
          </p>
        </div>

        {/* Check if members is actually an array before mapping */}
        {!Array.isArray(members) || members.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-border">
            <p className="text-ink-muted">Our team details are coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member._id || Math.random()} className="bg-white rounded-2xl shadow-premium overflow-hidden border border-surface-border hover:shadow-premium-lg transition-all group">
                <div className="relative h-72 overflow-hidden">
                  <ProtectedImage
                    src={member.photo || '/default-avatar.jpg'}
                    alt={member.name || 'Team Member'}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-ink mb-1">{member.name || 'Unknown'}</h3>
                  <p className="text-primary font-medium mb-3 text-sm">{member.title || 'Team Member'}</p>
                  <p className="text-ink-muted text-sm mb-4 leading-relaxed">
                    {member.bio || 'Bio coming soon.'}
                  </p>

                  <div className="space-y-2 text-sm">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center text-ink-soft hover:text-primary transition">
                        <FaEnvelope className="mr-2 text-primary" size={12} /> {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center text-ink-soft hover:text-primary transition">
                        <FaPhone className="mr-2 text-primary" size={12} /> {member.phone}
                      </a>
                    )}
                  </div>

                  {(member.socialLinks?.linkedin || member.socialLinks?.twitter || member.socialLinks?.facebook) && (
                    <div className="flex space-x-3 mt-4 pt-4 border-t border-surface-border">
                      {member.socialLinks?.linkedin && (
                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-ink-muted hover:bg-primary hover:text-white transition">
                          <FaLinkedin size={14} />
                        </a>
                      )}
                      {member.socialLinks?.twitter && (
                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-ink-muted hover:bg-primary hover:text-white transition">
                          <FaTwitter size={14} />
                        </a>
                      )}
                      {member.socialLinks?.facebook && (
                        <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center text-ink-muted hover:bg-primary hover:text-white transition">
                          <FaFacebook size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;