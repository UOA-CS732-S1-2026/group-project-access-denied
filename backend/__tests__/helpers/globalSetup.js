const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  // Pin a known-good binary; SIGABRT on macOS often comes from a bad/default download.
  // Override: MONGOMS_VERSION=6.0.16 or MONGOMS_SYSTEM_BINARY=$(which mongod)
  const binary = {};
  if (process.env.MONGOMS_SYSTEM_BINARY) {
    binary.systemBinary = process.env.MONGOMS_SYSTEM_BINARY;
  } else {
    binary.version = process.env.MONGOMS_VERSION || '7.0.14';
  }

  const mongod = await MongoMemoryServer.create({ binary });
  process.env.MONGO_URI_TEST = mongod.getUri();
  // globalThis is shared between globalSetup and globalTeardown (same Jest main process)
  globalThis.__MONGOD__ = mongod;
};