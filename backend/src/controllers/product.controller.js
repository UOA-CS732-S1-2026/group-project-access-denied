const productSchema = require('../models/product.model').schema;

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const ProductModel = req.db.model('Product', productSchema);
    const { category, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await ProductModel.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const ProductModel = req.db.model('Product', productSchema);
    const product = await ProductModel.findById(req.params.id);
    if (!product || !product.isActive) {
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
    const ProductModel = req.db.model('Product', productSchema);
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const ProductModel = req.db.model('Product', productSchema);
    const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
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
    const ProductModel = req.db.model('Product', productSchema);
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
