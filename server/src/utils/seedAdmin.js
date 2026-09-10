const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('🌾 Connecting to MongoDB for Admin seeding...');
    await mongoose.connect(config.mongoUri);

    const email = config.adminEmail;
    const password = config.adminPassword;

    if (!email || !password) {
      console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment.');
      process.exit(1);
    }

    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`ℹ️  Admin user with email ${email} already exists. Updating role & credentials.`);
      admin.role = 'admin';
      admin.password = password; // Will be hashed by pre-save hook
      admin.isActive = true;
      await admin.save();
      console.log(`✅ Admin user updated successfully!`);
    } else {
      admin = await User.create({
        name: 'Platform Administrator',
        email,
        password,
        role: 'admin',
        phone: '+91 98765 43210',
        city: 'New Delhi',
        state: 'Delhi',
        isActive: true
      });
      console.log(`🎉 Admin user created successfully: ${admin.email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
