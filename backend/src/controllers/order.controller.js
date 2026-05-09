const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Challenge = require('../models/challenge.model');

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

      // Accept total from the client without enforcing server-side recalculation.
      // CTF: intentional vulnerability — price tampering
      if (!items || !items.length || !shippingAddress) {
        return res.status(400).json({ message: 'items and shippingAddress are required' });
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

    const realPrices = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return (product?.price || 0) * (item.quantity || 1);
      })
    );
    const realTotal = realPrices.reduce((sum, n) => sum + n, 0);

    const out = order.toObject ? order.toObject() : order;
    // CTF: intentional vulnerability — price tampering
    // Flag is revealed when the submitted total is less than the real product prices.
    if (Number(total) < realTotal) {
      out.flag = 'CTF{price_tampering}';
    }

    // CTF: intentional vulnerability — logic-flaw (discount stacking)
    // If the player stacked discounts until items were free, we leak the flag in the response
    // (discoverable via DevTools Network) instead of rendering it in the UI.
    const rawSubtotal = Array.isArray(items)
      ? items.reduce((sum, it) => sum + Number(it.priceAtPurchase || 0) * Number(it.quantity || 0), 0)
      : 0;
    const isFreeItemsExploit =
      rawSubtotal > 0 && Number(discountApplied || 0) >= rawSubtotal;
    if (isFreeItemsExploit) {
      const challenge = await Challenge.findOne({ title: 'Stack the Savings' }).select('+flag');
      out.ctf = { challengeTitle: 'Stack the Savings', flag: challenge?.flag || null };
    }

    res.status(201).json(out);
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