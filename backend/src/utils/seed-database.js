const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Service = require('../models/Service');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');

    // Load services from knowledge base
    const servicesPath = path.join(__dirname, '../../../knowledge-base/services.json');
    const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

    // Insert services
    const services = Object.values(servicesData);
    await Service.insertMany(services);
    console.log(`✅ Inserted ${services.length} services`);

    // List inserted services
    console.log('\n📋 Services in database:');
    services.forEach(service => {
      console.log(`   - ${service.name} (${service.code})`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
