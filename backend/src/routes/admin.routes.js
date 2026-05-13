const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const Product = require('../models/product.model');

// GET /api/admin/products
// Admin product list — includes drafts/inactive items the public catalogue hides.
// CTF: the default-credentials flag is seeded into the description of an inactive
// "draft" product. An attacker who logs in with admin/admin lands on the panel
// and finds the flag while inspecting product entries here.
router.get('/products', protect, adminOnly, async (_req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
