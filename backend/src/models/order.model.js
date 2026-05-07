const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      postcode: { type: String, required: true },
      country:  { type: String, required: true },
    },
    // Links order to a player session — null for seeded data (alice's order)
    sessionId: {
      type: String,
      default: null,
      index: true,
    },
    // CTF: never rendered in UI — seed populates this with the IDOR flag (Flag #3)
    internalNote: {
      type: String,
      default: '',
    },
    // CTF: tracks discount amount for the discount-stacking logic-flaw flag (Flag #10)
    discountApplied: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);