const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  logger.info(`Attempting MongoDB connection...`);
  logger.info(`MONGO_MONGODB_URI exists: ${!!process.env.MONGO_MONGODB_URI}`);
  logger.info(`MONGO_URI exists: ${!!process.env.MONGO_URI}`);
  try {
    const conn = await mongoose.connect(process.env.MONGO_MONGODB_URI || process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
