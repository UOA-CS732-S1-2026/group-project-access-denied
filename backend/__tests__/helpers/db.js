const mongoose = require('mongoose');
const seedGlobal = require('../../src/config/seed.global');

const SEED_USERS = ['admin', 'alice', 'ajithpatel'];

// Login credentials for seeded users (username passed as email field — controller accepts both)
const SEED_CREDENTIALS = {
  admin: { email: 'admin', password: 'admin' },
  alice: { email: 'alice', password: 'alice1234' },
};

async function connect() {
  await mongoose.connect(process.env.MONGO_URI_TEST);
}

async function runGlobalSeed() {
  await seedGlobal();
}

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
}

module.exports = { connect, runGlobalSeed, clearSessionData, disconnect, SEED_CREDENTIALS };