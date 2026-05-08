const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { getReviews, createReview, deleteReview } = require('../controllers/review.controller');

// Product routes — require auth for db routing
router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);

// Admin-only product management
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Reviews — nested under products
router.get('/:productId/reviews', protect, getReviews);
router.post('/:productId/reviews', protect, createReview);
router.delete('/:productId/reviews/:id', protect, adminOnly, deleteReview);

module.exports = router;
