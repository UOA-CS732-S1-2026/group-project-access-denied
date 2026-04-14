const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    // Links submission to a player session
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    submittedFlag: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
