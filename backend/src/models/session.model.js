const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL index — MongoDB auto-deletes session documents after 2 hours
    // Atlas trigger fires on delete to clean up orders/reviews
    expires: 7200,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
