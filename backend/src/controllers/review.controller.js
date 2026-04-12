const reviewSchema  = require('../models/review.model').schema;
const productSchema = require('../models/product.model').schema;

// GET /api/products/:productId/reviews
const getReviews = async (req, res, next) => {
  try {
    const ReviewModel = req.db.model('Review', reviewSchema);
    const reviews = await ReviewModel.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// POST /api/products/:productId/reviews
// CTF: intentional vulnerability — xss
// username is pulled from req.user (JWT payload) and stored without sanitisation.
// It is then rendered raw on the product detail page, enabling XSS.
const createReview = async (req, res, next) => {
  try {
    const ProductModel = req.db.model('Product', productSchema);
    const ReviewModel  = req.db.model('Review', reviewSchema);

    const product = await ProductModel.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { rating, body } = req.body;
    if (!rating || !body) {
      return res.status(400).json({ message: 'rating and body are required' });
    }

    // CTF: intentional vulnerability — xss
    const review = await ReviewModel.create({
      user: req.user.id,
      product: req.params.productId,
      username: req.user.username, // stored as-is for XSS flag surface
      rating,
      body,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:productId/reviews/:id  (admin only)
const deleteReview = async (req, res, next) => {
  try {
    const ReviewModel = req.db.model('Review', reviewSchema);
    const review = await ReviewModel.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviews, createReview, deleteReview };
