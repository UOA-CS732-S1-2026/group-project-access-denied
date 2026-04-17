const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const logger = require('./src/utils/logger');
const seedChatbot = require('./src/config/seedChatbot');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start the server
connectDB().then(async () => {
  await seedChatbot();
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});