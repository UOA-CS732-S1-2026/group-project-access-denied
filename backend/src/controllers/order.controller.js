const Order = require('../models/order.model');

// GET /api/orders — returns current session's orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ sessionId: req.sessionId })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:orderNumber
// CTF: intentional vulnerability — insecure-api (IDOR, Flag #3)
// No session check — any authenticated user can fetch any order by orderNumber,
// including alice's seeded order (orderNumber: 1) which has the flag in internalNote.
const getOrder = async (req, res, next) => {
  try {
    // CTF: intentional vulnerability — insecure-api
    // Missing session check: should verify order.sessionId === req.sessionId
    const order = await Order.findOne({ orderNumber: parseInt(req.params.orderNumber, 10) }).populate(
      'items.product',
      'name price images'
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, total, shippingAddress, discountApplied } = req.body;

    if (!items || !items.length || !total || !shippingAddress) {
      return res.status(400).json({ message: 'items, total and shippingAddress are required' });
    }

    const last = await Order.findOne().sort({ orderNumber: -1 }).select('orderNumber');
    const nextNumber = last?.orderNumber ? last.orderNumber + 1 : 2;

    const order = await Order.create({
      orderNumber: nextNumber,
      user: req.user.id,
      sessionId: req.sessionId,
      items,
      total,
      shippingAddress,
      discountApplied: discountApplied || 0,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/admin/all  (admin only)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, getOrder, createOrder, getAllOrders };

