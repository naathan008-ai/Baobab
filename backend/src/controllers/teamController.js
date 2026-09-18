const TeamMember = require('../models/TeamMember');

const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true })
      .sort({ order: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTeamMember = async (req, res) => {
  try {
    const { name, title, bio, email, phone, socialLinks } = req.body;

    let photo = null;
    if (req.processedPhoto) {
      photo = req.processedPhoto;
    }

    const member = await TeamMember.create({
      name,
      title,
      bio,
      photo,
      email,
      phone,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {}
    });

    res.status(201).json({ message: 'Team member created', member });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const updates = req.body;
    if (req.processedPhoto) {
      updates.photo = req.processedPhoto;
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({ message: 'Team member updated', member: updatedMember });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await member.deleteOne();
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};