const User = require('./models/User');

const AGENT_DEFAULT_PERMISSIONS = {
  canEditProperties: true,
  canAddProperties: true,
  canDeleteProperties: true,
  canRevalueProperties: true,
  canViewMessages: true,
  canReplyMessages: true,
};

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'naathan008@icloud.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Naa_thie4';
    const adminName = process.env.ADMIN_NAME || 'Nathan Admin';

    // ===== Admin =====
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      console.log(`ℹ️  Admin already exists: ${adminEmail}`);
      let updated = false;
      if (existing.role !== 'admin') { existing.role = 'admin'; updated = true; }
      if (!existing.isActive) { existing.isActive = true; updated = true; }
      if (!existing.isApproved) { existing.isApproved = true; updated = true; }
      if (updated) {
        await existing.save();
        console.log('✅ Admin permissions updated');
      }
    } else {
      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
        isApproved: true,
      });
      await admin.save();
      console.log('✅ Admin created successfully');
      console.log(`   📧 Email:    ${adminEmail}`);
      console.log(`   🔑 Password: ${adminPassword}`);
      console.log('   ⚠️  Change this password after first login!');
    }

    // ===== Backfill agent permissions =====
    // Any agent that exists but has no permissions gets the defaults.
    const agents = await User.find({ role: 'agent' });
    let patched = 0;

    for (const agent of agents) {
      const p = agent.permissions || {};
      const needsPatch =
        p.canAddProperties !== true ||
        p.canDeleteProperties !== true ||
        p.canViewMessages !== true ||
        p.canReplyMessages !== true;

      if (needsPatch) {
        agent.permissions = { ...AGENT_DEFAULT_PERMISSIONS, ...p };
        await agent.save();
        patched++;
      }
    }

    if (patched > 0) {
      console.log(`✅ Updated permissions for ${patched} existing agent(s)`);
    }

    return { ok: true };
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    throw error;
  }
};

module.exports = { seedAdmin };

// Allow running directly: node src/seed.js
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();

  (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
      await seedAdmin();
      await mongoose.disconnect();
      console.log('✅ Done');
      process.exit(0);
    } catch (err) {
      console.error('❌ Fatal:', err.message);
      process.exit(1);
    }
  })();
}