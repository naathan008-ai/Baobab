const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/baobab_realestate';
  console.log('Testing connection to:', uri);
  
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Connection state:', mongoose.connection.readyState);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Test complete');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Is MongoDB running? Run: net start MongoDB');
    console.log('2. Is the connection string correct in .env?');
    console.log('3. Is the data directory created? (C:\\data\\db)');
  }
}

testMongoDB();