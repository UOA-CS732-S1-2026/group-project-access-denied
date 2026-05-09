const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { INTERNAL_TOKEN } = require('../config/internal-token');
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

// POST /api/admin/products/:id/import-image
// Pulls a supplier-provided image URL into the admin product editor for preview.
// CTF: intentional vulnerability — SSRF (no URL validation, no protocol/IP allowlist,
// response body is echoed back as a "preview", and the internal-services token is
// blindly attached to every outbound request).
router.post('/products/:id/import-image', protect, adminOnly, async (req, res) => {
  const { imageUrl } = req.body || {};

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ message: 'imageUrl is required' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'APapparel-ImageImporter/1.0',
        'X-Internal-Token': INTERNAL_TOKEN,
      },
    });
    const buffer = Buffer.from(await response.arrayBuffer());

    return res.json({
      ok: response.ok,
      status: response.status,
      fetchedFrom: imageUrl,
      contentType: response.headers.get('content-type') || null,
      sizeBytes: buffer.length,
      preview: buffer.toString('utf8').slice(0, 2000),
    });
  } catch (err) {
    return res.status(502).json({
      message: 'Failed to fetch image',
      error: err.message,
      fetchedFrom: imageUrl,
    });
  } finally {
    clearTimeout(timer);
  }
});

module.exports = router;
