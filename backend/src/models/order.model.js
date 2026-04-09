const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { getOrders, getOrder, createOrder, getAllOrders } = require('../controllers/order.controller');

// All order routes require authentication
router.get('/', protect, getOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);   // CTF: IDOR — no ownership check
router.post('/', protect, createOrder);

module.exports = router;