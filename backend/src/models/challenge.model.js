const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Challenge description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['sql-injection', 'xss', 'auth-bypass', 'exposed-files', 'insecure-api', 'default-credentials', 'prompt-injection', 'logic-flaw', 'other'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    points: {
      type: Number,
      required: true,
      default: 100,
    },
    flag: {
      type: String,
      required: [true, 'Flag is required'],
      select: false, // never returned in API responses by default
    },
    hints: [
      {
        text: { type: String, required: true },
        cost: { type: Number, default: 0 }, // points deducted for using hint
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    solveCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);
