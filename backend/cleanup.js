const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.deleteMany({
      email: { $in: ['nathan008@icloud.com', 'admin@baobab.com'] },
    });
    console.log(`✅ Deleted ${result.deletedCount} wrong admin(s)`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();