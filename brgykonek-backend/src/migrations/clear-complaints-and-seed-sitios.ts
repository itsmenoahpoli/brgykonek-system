import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from '../models/Complaint';
import Sitio from '../models/Sitio';

dotenv.config();

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/brgykonek';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    console.log('Clearing complaints collection...');
    await Complaint.deleteMany({});
    console.log('Complaints cleared.');

    console.log('Seeding sitios 1-100...');
    const sitios = Array.from({ length: 100 }, (_, i) => ({ code: i + 1, name: `Sitio ${i + 1}` }));
    await Sitio.deleteMany({});
    await Sitio.insertMany(sitios);
    console.log('Sitios seeded.');

    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  run();
}


