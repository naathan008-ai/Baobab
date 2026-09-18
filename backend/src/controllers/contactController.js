const Contact = require('../models/Contact');
const { sendContactEmail, sendReplyEmail } = require('../utils/emailService');

// ===== Submit a new enquiry (public) =====
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId, propertyTitle } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || null,
    });

    try {
      await sendContactEmail({ name, email, phone, message, propertyTitle });
    } catch (mailError) {
      console.error('Email send failed (non-fatal):', mailError.message);
    }

    res.status(201).json({
      message: 'Contact submitted successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Failed to submit contact' });
  }
};

// ===== Get all contacts (admin + agents with canViewMessages) =====
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('propertyId', 'title')
      .populate('replies.repliedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== Get single contact =====
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('propertyId', 'title')
      .populate('replies.repliedBy', 'name email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== Mark as read =====
const markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({ message: 'Contact marked as read', contact });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== Reply to a contact (admin + agents with canReplyMessages) =====
const replyToContact = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Reply message cannot be empty' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const reply = {
      message: message.trim(),
      repliedBy: req.user._id,
      repliedByName: req.user.name,
      repliedByEmail: req.user.email,
      repliedAt: new Date(),
    };

    contact.replies.push(reply);
    contact.status = 'replied';
    await contact.save();

    // Send reply via email (non-fatal if it fails)
    try {
      await sendReplyEmail({
        toEmail: contact.email,
        toName: contact.name,
        originalMessage: contact.message,
        replyMessage: reply.message,
        repliedByName: req.user.name,
      });
    } catch (mailError) {
      console.error('Reply email failed (non-fatal):', mailError.message);
    }

    // Return the updated contact with populated replies
    const updated = await Contact.findById(contact._id)
      .populate('propertyId', 'title')
      .populate('replies.repliedBy', 'name email');

    res.json({ message: 'Reply sent successfully', contact: updated });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== Delete contact (admin only) =====
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    await contact.deleteOne();
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContactById,
  markContactRead,
  replyToContact,
  deleteContact,
};