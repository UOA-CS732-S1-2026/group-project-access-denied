const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI_TEST = mongod.getUri();
  // global is shared between globalSetup and globalTeardown (same Jest main process)
  global.__MONGOD__ = mongod;
};