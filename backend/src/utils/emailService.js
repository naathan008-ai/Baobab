const nodemailer = require('nodemailer');

// NOTE: Method is createTransport (NOT createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ====== Send new contact enquiry to company inbox ======
const sendContactEmail = async (contactData) => {
  const { name, email, phone, message, propertyTitle } = contactData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.COMPANY_EMAIL,
    subject: `New Enquiry from ${name}`,
    html: `
      <h2>New Enquiry from Baobab Real Estate Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${propertyTitle ? `<p><strong>Property Enquiry:</strong> ${propertyTitle}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><small>This enquiry was sent from the Baobab Real Estate website contact form.</small></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

// ====== Agent approval email ======
const sendApprovalEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Baobab Real Estate - Account Approved',
    html: `
      <h2>Welcome to Baobab Real Estate!</h2>
      <p>Dear ${userName},</p>
      <p>Your account has been approved by the admin. You now have access to the agent dashboard.</p>
      <p>You can now manage properties and respond to client enquiries.</p>
      <p><a href="${process.env.FRONTEND_URL}/login">Login here</a></p>
      <hr>
      <p><small>Baobab Real Estate Team</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Approval email error:', error);
    return false;
  }
};

// ====== Reply to a client enquiry ======
const sendReplyEmail = async ({ toEmail, toName, originalMessage, replyMessage, repliedByName }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    replyTo: process.env.COMPANY_EMAIL,
    subject: `Re: Your enquiry to Baobab Real Estate`,
    html: `
      <h2>Reply from Baobab Real Estate</h2>
      <p>Hi ${toName},</p>

      <p><strong>${repliedByName}</strong> from our team has replied to your enquiry:</p>

      <blockquote style="border-left:3px solid #C49B3B;padding-left:12px;color:#555;">
        ${replyMessage}
      </blockquote>

      <hr>
      <p style="font-size:12px;color:#888;"><strong>Your original message:</strong></p>
      <p style="font-size:12px;color:#888;">${originalMessage}</p>
      <hr>
      <p><small>Baobab Real Estate — 2 South Avenue, Kwekwe, Zimbabwe</small></p>
      <p><small>📞 263776891540 · 263772732861 · 263778354267</small></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Reply email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Reply email error:', error);
    return false;
  }
};

module.exports = { sendContactEmail, sendApprovalEmail, sendReplyEmail };