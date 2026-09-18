import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import ProtectedImage from '../components/ProtectedImage';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/team`);
        setMembers(res.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-neon-gold to-neon-purple bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-white/50 mt-2">Meet the visionaries behind Baobab.</p>
        </div>

        {loading ? (
          <div className="text-center text-white/50 py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div key={member._id} className="glass-card group hover-lift animate-fadeInUp">
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <ProtectedImage src={member.photo || '/default-avatar.jpg'} alt={member.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-neon-gold transition">{member.name}</h3>
                  <p className="text-neon-gold text-sm font-medium">{member.title}</p>
                  <p className="text-white/60 text-sm mt-2">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3 text-sm text-white/50">
                    {member.email && <a href={`mailto:${member.email}`} className="hover:text-neon-gold transition flex items-center gap-1"><FaEnvelope /> {member.email}</a>}
                    {member.phone && <a href={`tel:${member.phone}`} className="hover:text-neon-gold transition flex items-center gap-1"><FaPhone /> {member.phone}</a>}
                  </div>
                  {member.socialLinks && (
                    <div className="flex space-x-3 mt-3 pt-3 border-t border-white/10">
                      {member.socialLinks.linkedin && <a href={member.socialLinks.linkedin} className="text-white/40 hover:text-neon-gold transition"><FaLinkedin /></a>}
                      {member.socialLinks.twitter && <a href={member.socialLinks.twitter} className="text-white/40 hover:text-neon-gold transition"><FaTwitter /></a>}
                      {member.socialLinks.facebook && <a href={member.socialLinks.facebook} className="text-white/40 hover:text-neon-gold transition"><FaFacebook /></a>}
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