const orderSchema = require('../models/order.model').schema;

// GET /api/orders
// CTF: intentional vulnerability — insecure-api (IDOR, Flag #3)
const getOrders = async (req, res, next) => {
  try {
    const OrderModel = req.db.model('Order', orderSchema);
    const orders = await OrderModel.find({ user: req.user.id })
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
    const OrderModel = req.db.model('Order', orderSchema);
    // CTF: intentional vulnerability — insecure-api
    // Missing ownership check: should verify order.user.toString() === req.user.id
    const order = await OrderModel.findById(req.params.id).populate(
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
    const OrderModel = req.db.model('Order', orderSchema);
    const { items, total, shippingAddress, discountApplied } = req.body;

    if (!items || !items.length || !total || !shippingAddress) {
      return res.status(400).json({ message: 'items, total and shippingAddress are required' });
    }

    const order = await OrderModel.create({
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
    const OrderModel = req.db.model('Order', orderSchema);
    const orders = await OrderModel.find()
      .populate('user', 'username email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, getOrder, createOrder, getAllOrders };
