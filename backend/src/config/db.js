const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri && mongoUri.startsWith('mongodb://')) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`[DB] Connected to external MongoDB: ${mongoUri}`);
        return;
      } catch (err) {
        console.warn(`[DB] External MongoDB connection failed (${err.message}). Falling back to MongoMemoryServer...`);
      }
    }

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`[DB] Connected to MongoMemoryServer (In-Memory DB): ${uri}`);
  } catch (error) {
    console.error(`[DB] Critical MongoDB connection error:`, error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
