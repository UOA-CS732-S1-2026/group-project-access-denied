const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedGlobal = require('../../src/config/seed.global');

// Global seed usernames — these are never wiped between tests
const SEED_USERS = ['admin', 'alice', 'ajithpatel'];

let mongod;

async function connect() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function runGlobalSeed() {
  await seedGlobal();
}

// Wipe per-session data and test-created users between tests.
// Preserves global seed: admin, alice, ajithpatel, products, challenges, chatSessions.
async function clearSessionData() {
  const { collections } = mongoose.connection;
  const sessionCollections = ['sessions', 'orders', 'reviews', 'submissions'];
  for (const name of sessionCollections) {
    if (collections[name]) await collections[name].deleteMany({});
  }
  const User = require('../../src/models/user.model');
  await User.deleteMany({ username: { $nin: SEED_USERS } });
}

async function disconnect() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
}

module.exports = { connect, runGlobalSeed, clearSessionData, disconnect };