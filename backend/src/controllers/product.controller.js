const Product = require('../models/product.model');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isSqlInjectionSearch = (value) => {
  const normalised = value.toLowerCase().replace(/\s+/g, ' ').trim();
  return (
    normalised.includes("' or '1'='1") ||
    normalised.includes('" or "1"="1') ||
    normalised.includes("' or 1=1--") ||
    normalised.includes("' or price=0--")
  );
};

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const filter = { isActive: true };
    const searchTerm = typeof search === 'string' ? search.trim() : '';

    if (searchTerm) {
      if (isSqlInjectionSearch(searchTerm)) {
        // CTF: intentional vulnerability — sql-injection
        delete filter.isActive;
      } else {
        const searchRegex = new RegExp(escapeRegex(searchTerm), 'i');
        filter.$or = [
          { name: searchRegex },
          { brand: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
        ];
      }
    }

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /api/products  (admin only)
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
