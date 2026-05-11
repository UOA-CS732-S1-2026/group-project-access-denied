const { getReviews, createReview, deleteReview } = require('../../src/controllers/review.controller');
const Review = require('../../src/models/review.model');
const Product = require('../../src/models/product.model');

jest.mock('../../src/models/review.model');
jest.mock('../../src/models/product.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReview = {
  _id: 'review-id-123',
  user: 'user-id-123',
  product: 'product-id-123',
  sessionId: 'sess-abc',
  username: 'testuser',
  rating: 5,
  body: 'Great product!',
};

const mockProduct = { _id: 'product-id-123', name: 'Draped Silk Blouse' };

beforeEach(() => jest.clearAllMocks());

// ─── getReviews ───────────────────────────────────────────────────────────────

describe('getReviews', () => {
  it('returns reviews scoped to the current session and product', async () => {
    const reviews = [mockReview];
    Review.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(reviews) });

    const req = { params: { productId: 'product-id-123' }, sessionId: 'sess-abc' };
    const res = mockRes();

    await getReviews(req, res, jest.fn());

    expect(Review.find).toHaveBeenCalledWith({
      sessionId: 'sess-abc',
      product: 'product-id-123',
    });
    expect(res.json).toHaveBeenCalledWith(reviews);
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Review.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(err) });

    const next = jest.fn();
    await getReviews({ params: { productId: 'x' }, sessionId: 'x' }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── createReview ─────────────────────────────────────────────────────────────

describe('createReview', () => {
  it('creates a review and returns 201', async () => {
    Product.findById.mockResolvedValue(mockProduct);
    Review.create.mockResolvedValue(mockReview);

    const req = {
      params: { productId: 'product-id-123' },
      body: { rating: 5, body: 'Great product!' },
      user: { id: 'user-id-123', username: 'testuser' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createReview(req, res, jest.fn());

    expect(Review.create).toHaveBeenCalledWith(expect.objectContaining({
      user: 'user-id-123',
      username: 'testuser',
      rating: 5,
      body: 'Great product!',
      sessionId: 'sess-abc',
    }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockReview);
  });

  it('stores username directly from the JWT without sanitisation (XSS surface)', async () => {
    Product.findById.mockResolvedValue(mockProduct);
    Review.create.mockResolvedValue({ ...mockReview, username: '<script>alert(1)</script>' });

    const req = {
      params: { productId: 'product-id-123' },
      body: { rating: 5, body: 'Interesting' },
      user: { id: 'user-id-123', username: '<script>alert(1)</script>' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createReview(req, res, jest.fn());

    expect(Review.create).toHaveBeenCalledWith(
      expect.objectContaining({ username: '<script>alert(1)</script>' })
    );
  });

  it('returns 404 when the product does not exist', async () => {
    Product.findById.mockResolvedValue(null);

    const req = {
      params: { productId: 'bad-id' },
      body: { rating: 5, body: 'Nice' },
      user: { id: 'user-id-123', username: 'testuser' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createReview(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  it('returns 400 when rating or body is missing', async () => {
    Product.findById.mockResolvedValue(mockProduct);

    const req = {
      params: { productId: 'product-id-123' },
      body: { rating: 5 },
      user: { id: 'user-id-123', username: 'testuser' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createReview(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'rating and body are required' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Product.findById.mockRejectedValue(err);

    const next = jest.fn();
    await createReview(
      { params: { productId: 'x' }, body: { rating: 5, body: 'x' }, user: { id: 'x', username: 'x' }, sessionId: 'x' },
      mockRes(),
      next
    );

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── deleteReview ─────────────────────────────────────────────────────────────

describe('deleteReview', () => {
  it('deletes a review and returns a confirmation message', async () => {
    Review.findByIdAndDelete.mockResolvedValue(mockReview);

    const req = { params: { productId: 'product-id-123', id: 'review-id-123' } };
    const res = mockRes();

    await deleteReview(req, res, jest.fn());

    expect(Review.findByIdAndDelete).toHaveBeenCalledWith('review-id-123');
    expect(res.json).toHaveBeenCalledWith({ message: 'Review deleted' });
  });

  it('returns 404 when review does not exist', async () => {
    Review.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { productId: 'product-id-123', id: 'bad-id' } };
    const res = mockRes();

    await deleteReview(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Review not found' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Review.findByIdAndDelete.mockRejectedValue(err);

    const next = jest.fn();
    await deleteReview({ params: { productId: 'x', id: 'x' } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
