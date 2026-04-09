const Order = require('../models/order.model');

// GET /api/orders
// CTF: intentional vulnerability — insecure-api (IDOR, Flag #3)
// Returns ALL orders when no userId filter is enforced server-side.
// A player who hits this endpoint directly (e.g. via Postman) without
// scoping to req.user._id will see every user's orders, including the
// admin order whose internalNote contains the flag.
const getOrders = async (req, res, next) => {
  try {
    // CTF: intentional vulnerability — insecure-api
    // Should be: { user: req.user.id } — but deliberately omitted so any
    // authenticated user can enumerate all orders and find the IDOR flag.
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
// CTF: intentional vulnerability — insecure-api (IDOR, Flag #3)
// No ownership check — any authenticated user can fetch any order by ID.
const getOrder = async (req, res, next) => {
  try {
    // CTF: intentional vulnerability — insecure-api
    // Missing ownership check: should verify order.user.toString() === req.user.id
    const order = await Order.findById(req.params.id).populate(
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

    const order = await Order.create({
      user: req.user.id,
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