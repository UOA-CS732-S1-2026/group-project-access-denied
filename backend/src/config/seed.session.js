/**
 * ThreadVault session seed
 *
 * Called automatically when a new session is created (register/login).
 * Creates per-session writable data scoped to the sessionId:
 *   - alice's flagged order (IDOR flag)
 *   - seeded reviews (admin username visible for SQL injection discovery)
 *
 * Teammates: add new per-session fixtures here if a flag requires
 * fresh data on every session.
 */

const User    = require('../models/user.model');
const Product = require('../models/product.model');
const Order   = require('../models/order.model');
const Review  = require('../models/review.model');

async function seedSession(sessionId) {
  const alice    = await User.findOne({ username: 'alice' });
  const admin    = await User.findOne({ username: 'admin' });
  const products = await Product.find({ isActive: true });

  if (!alice || !admin || products.length === 0) {
    console.warn('seedSession: global data missing — run seed.global.js first');
    return;
  }

  // ── Alice's flagged order (IDOR flag) ───────────────────────────────────────
  // CTF: intentional vulnerability — insecure-api (IDOR, Flag #3)
  // internalNote is never rendered in the UI — players must hit the API directly.
  await Order.create({
    user: alice._id,
    sessionId,
    items: [{ product: products[0]._id, size: 'M', quantity: 1, priceAtPurchase: products[0].price }],
    total: products[0].price,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Alice Smith',
      street: '12 Harbour View',
      city: 'Auckland',
      postcode: '1010',
      country: 'New Zealand',
    },
    internalNote: 'CTF{idor_order_exposed}',
  });

  // ── Seeded reviews (admin username publicly visible — Flag #7 dependency) ───
  await Review.insertMany([
    {
      user: admin._id,
      product: products[0]._id,
      sessionId,
      username: 'admin', // CTF: admin username must be publicly visible for SQL injection flag
      rating: 5,
      body: 'Absolutely stunning piece. The silk drapes beautifully — worth every penny.',
    },
    {
      user: alice._id,
      product: products[0]._id,
      sessionId,
      username: 'alice',
      rating: 4,
      body: 'Gorgeous blouse, runs slightly small. Size up if between sizes.',
    },
    {
      user: admin._id,
      product: products[2]._id,
      sessionId,
      username: 'admin',
      rating: 5,
      body: 'The construction quality is exceptional. This is a coat you keep for life.',
    },
  ]);
}

module.exports = { seedSession };
