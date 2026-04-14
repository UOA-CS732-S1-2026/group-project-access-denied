const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Links review to a player session — null for seeded data
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    // CTF: intentional vulnerability — xss
    // username is stored separately and rendered raw on the product page.
    // This allows XSS payloads submitted as a username to execute in other users' browsers.
    username: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    body: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);