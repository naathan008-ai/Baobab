const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import all models
const User = require('./src/models/User');
const Property = require('./src/models/Property');
const TeamMember = require('./src/models/TeamMember');
const SocialSettings = require('./src/models/SocialSettings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/baobab_realestate';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📁 Database:', mongoose.connection.db.databaseName);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

// ===== Commands =====

async function listCollections() {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\n📚 Collections:');
  if (collections.length === 0) {
    console.log('  (No collections yet)');
  } else {
    collections.forEach(c => console.log(`  - ${c.name}`));
  }
}

async function countDocuments() {
  const userCount = await User.countDocuments();
  const propertyCount = await Property.countDocuments();
  const teamCount = await TeamMember.countDocuments();
  
  console.log('\n📊 Document Counts:');
  console.log(`  Users: ${userCount}`);
  console.log(`  Properties: ${propertyCount}`);
  console.log(`  Team Members: ${teamCount}`);
}

async function listUsers() {
  const users = await User.find().select('-password');
  console.log('\n👤 Users:');
  if (users.length === 0) {
    console.log('  (No users yet)');
  } else {
    users.forEach(u => {
      const status = u.isApproved ? '✅ Approved' : '⏳ Pending';
      console.log(`  - ${u.email} (${u.role}) - ${status}`);
    });
  }
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'nathan008@icloud.com';
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log(`\n⚠️ Admin already exists: ${adminEmail}`);
    return false;
  }
  
  const admin = new User({
    name: 'Nathan Admin',
    email: adminEmail,
    password: 'Admin123!',
    role: 'admin',
    isActive: true,
    isApproved: true,
  });
  await admin.save();
  console.log(`\n✅ Admin created: ${adminEmail}`);
  console.log('🔑 Password: Admin123!');
  return true;
}

async function seedSocialSettings() {
  const existing = await SocialSettings.findOne();
  if (existing) {
    console.log('\n⚠️ Social settings already exist');
    return false;
  }
  
  await SocialSettings.create({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  });
  console.log('\n✅ Social settings created');
  return true;
}

async function clearDatabase() {
  console.log('\n⚠️ WARNING: This will delete ALL data!');
  console.log('Type "YES" to confirm:');
  
  // Read from stdin
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    readline.question('> ', async (answer) => {
      readline.close();
      if (answer === 'YES') {
        await User.deleteMany({});
        await Property.deleteMany({});
        await TeamMember.deleteMany({});
        await SocialSettings.deleteMany({});
        console.log('\n✅ All data cleared');
        resolve(true);
      } else {
        console.log('\n❌ Operation cancelled');
        resolve(false);
      }
    });
  });
}

// ===== Main =====

async function main() {
  const action = process.argv[2] || 'help';
  
  console.log(`\n🚀 MongoDB Management Tool`);
  console.log(`Action: ${action}\n`);
  
  const connected = await connectDB();
  if (!connected) {
    console.log('\n💡 Make sure MongoDB is running:');
    console.log('   net start MongoDB');
    console.log('   OR: "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe" --dbpath C:\\data\\db');
    process.exit(1);
  }
  
  switch(action) {
    case 'list':
      await listCollections();
      await countDocuments();
      break;
      
    case 'users':
      await listUsers();
      break;
      
    case 'seed':
      await seedAdmin();
      await seedSocialSettings();
      await listUsers();
      break;
      
    case 'clear':
      await clearDatabase();
      break;
      
    case 'all':
      await listCollections();
      await countDocuments();
      await listUsers();
      break;
      
    case 'help':
    default:
      console.log(`
📋 Available Commands:

  node manage.js list     - Show all collections and counts
  node manage.js users    - List all users
  node manage.js seed     - Create admin user and default settings
  node manage.js clear    - Delete ALL data (requires confirmation)
  node manage.js all      - Show everything
  node manage.js help     - Show this help

💡 Examples:
  node manage.js list
  node manage.js seed
  node manage.js users
      `);
  }
  
  await mongoose.disconnect();
  console.log('\n✅ Done');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});