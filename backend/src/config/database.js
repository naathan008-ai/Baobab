const mongoose = require('mongoose');
const { seedAdmin } = require('../seed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`   📁 Database: ${conn.connection.name}`);
    console.log(`   🌐 Host:     ${conn.connection.host}`);

    // ============================================
    // AUTO-SEED ADMIN AFTER CONNECTION
    // ============================================
    try {
      await seedAdmin();
    } catch (seedError) {
      console.error('⚠️  Auto-seed failed:', seedError.message);
      // Don't exit — server can still run without admin
    }

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('   💡 Make sure MongoDB is running: net start MongoDB');
    process.exit(1);
  }
};

module.exports = connectDB;