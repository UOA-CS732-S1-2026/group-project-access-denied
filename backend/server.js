const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const logger = require('./src/utils/logger');
const seedGlobal = require('./src/config/seed.global');

// Default to 5001 (dev docs and macOS notes recommend 5001)
const PORT = process.env.PORT || 5001;

// Connect to MongoDB then start the server
connectDB().then(async () => {
  await seedGlobal();
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});