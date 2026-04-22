const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/snackshield';

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await mongoose.connection.collection('users').deleteMany({});
    console.log('Cleared existing users');

    // Pre-hash passwords here — insertMany bypasses the pre('save') hook
    // so we must hash manually to avoid double-hashing issues
    const users = [
      {
        name: 'Admin User',
        email: 'admin@snackshield.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'Admin',
        company: 'SnackShield Inc.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Manufacturer',
        email: 'manufacturer@test.com',
        password: await bcrypt.hash('test123', 10),
        role: 'Manufacturer',
        company: 'PureFoods India Pvt Ltd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah Distributor',
        email: 'distributor@test.com',
        password: await bcrypt.hash('test123', 10),
        role: 'Distributor',
        company: 'FastTrack Logistics',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike Retailer',
        email: 'retailer@test.com',
        password: await bcrypt.hash('test123', 10),
        role: 'Retailer',
        company: 'MegaMart Retail',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await mongoose.connection.collection('users').insertMany(users);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:        admin@snackshield.com / admin123');
    console.log('Manufacturer: manufacturer@test.com  / test123');
    console.log('Distributor:  distributor@test.com   / test123');
    console.log('Retailer:     retailer@test.com      / test123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedUsers();
