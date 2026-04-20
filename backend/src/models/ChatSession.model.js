const mongoose = require('mongoose');

// Intentionally uses a simple auto-incrementing integer sessionId
// instead of a UUID — low entropy makes it enumerable (IDOR vulnerability)
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  // Intentionally sequential integer — makes session IDs predictable and enumerable
  sessionId: {
    type: Number,
    required: true,
    unique: true,
  },
  // userId is stored but never validated against the requesting user (IDOR)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  messages: [messageSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);