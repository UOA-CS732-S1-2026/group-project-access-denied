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

// Auto-increment sessionId on creation
chatSessionSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastSession = await this.constructor.findOne({}, {}, { sort: { sessionId: -1 } });
    this.sessionId = lastSession ? lastSession.sessionId + 1 : 2; // Start at 2, seed takes 1
  }
  next();
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);