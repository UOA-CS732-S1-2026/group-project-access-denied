const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../../src/controllers/product.controller');
const Product = require('../../src/models/product.model');

jest.mock('../../src/models/product.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockProduct = {
  _id: 'product-id-123',
  name: 'Draped Silk Blouse',
  price: 245,
  isActive: true,
};

const mockInactiveProduct = {
  _id: 'vault-id',
  name: 'Vault Prototype Trench Coat',
  isActive: false,
};

beforeEach(() => jest.clearAllMocks());

// ─── getProducts ──────────────────────────────────────────────────────────────

describe('getProducts', () => {
  it('returns only active products by default', async () => {
    const products = [mockProduct];
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(products) });

    const req = { query: {} };
    const res = mockRes();

    await getProducts(req, res, jest.fn());

    expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }));
    expect(res.json).toHaveBeenCalledWith(products);
  });

  it('adds a regex filter when a normal search term is provided', async () => {
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([mockProduct]) });

    const req = { query: { search: 'silk' } };
    const res = mockRes();

    await getProducts(req, res, jest.fn());

    const filterArg = Product.find.mock.calls[0][0];
    expect(filterArg.isActive).toBe(true);
    expect(filterArg.$or).toBeDefined();
  });

  it('drops the isActive filter when a SQL injection pattern is detected', async () => {
    const products = [mockProduct, mockInactiveProduct];
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(products) });

    const req = { query: { search: "' or '1'='1" } };
    const res = mockRes();

    await getProducts(req, res, jest.fn());

    const filterArg = Product.find.mock.calls[0][0];
    expect(filterArg.isActive).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith(products);
  });

  it('detects the OR 1=1 injection variant', async () => {
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

    const req = { query: { search: "' or 1=1--" } };
    const res = mockRes();

    await getProducts(req, res, jest.fn());

    const filterArg = Product.find.mock.calls[0][0];
    expect(filterArg.isActive).toBeUndefined();
  });

  it('applies category filter when provided', async () => {
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([mockProduct]) });

    const req = { query: { category: 'clothing' } };
    const res = mockRes();

    await getProducts(req, res, jest.fn());

    expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({ category: 'clothing' }));
  });

  it('applies price range filter when minPrice and maxPrice are provided', async () => {
    Product.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([mockProduct]) });

    const req = { query: { minPrice: '100', maxPrice: '300' } };
    const res = mockRes();

    await getProducts(req, res, jest.fn());

    expect(Product.find).toHaveBeenCalledWith(
      expect.objectContaining({ price: { $gte: 100, $lte: 300 } })
    );
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Product.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(err) });

    const next = jest.fn();
    await getProducts({ query: {} }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── getProduct ───────────────────────────────────────────────────────────────

describe('getProduct', () => {
  it('returns a product by id (active or inactive)', async () => {
    Product.findById.mockResolvedValue(mockProduct);

    const req = { params: { id: 'product-id-123' } };
    const res = mockRes();

    await getProduct(req, res, jest.fn());

    expect(Product.findById).toHaveBeenCalledWith('product-id-123');
    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  it('returns the vault product even though it is inactive', async () => {
    Product.findById.mockResolvedValue(mockInactiveProduct);

    const req = { params: { id: 'vault-id' } };
    const res = mockRes();

    await getProduct(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(mockInactiveProduct);
  });

  it('returns 404 when product does not exist', async () => {
    Product.findById.mockResolvedValue(null);

    const req = { params: { id: 'bad-id' } };
    const res = mockRes();

    await getProduct(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Product.findById.mockRejectedValue(err);

    const next = jest.fn();
    await getProduct({ params: { id: 'x' } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── createProduct ────────────────────────────────────────────────────────────

describe('createProduct', () => {
  it('creates a product and returns 201', async () => {
    Product.create.mockResolvedValue(mockProduct);

    const req = { body: { name: 'Draped Silk Blouse', price: 245 } };
    const res = mockRes();

    await createProduct(req, res, jest.fn());

    expect(Product.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  it('forwards errors to next()', async () => {
    Product.create.mockRejectedValue(new Error('Validation error'));

    const next = jest.fn();
    await createProduct({ body: {} }, mockRes(), next);

    expect(next).toHaveBeenCalled();
  });
});

// ─── updateProduct ────────────────────────────────────────────────────────────

describe('updateProduct', () => {
  it('updates and returns the updated product', async () => {
    const updated = { ...mockProduct, price: 280 };
    Product.findByIdAndUpdate.mockResolvedValue(updated);

    const req = { params: { id: 'product-id-123' }, body: { price: 280 } };
    const res = mockRes();

    await updateProduct(req, res, jest.fn());

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      'product-id-123',
      { price: 280 },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 404 when product does not exist', async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'bad-id' }, body: {} };
    const res = mockRes();

    await updateProduct(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── deleteProduct ────────────────────────────────────────────────────────────

describe('deleteProduct', () => {
  it('deletes a product and returns a confirmation message', async () => {
    Product.findByIdAndDelete.mockResolvedValue(mockProduct);

    const req = { params: { id: 'product-id-123' } };
    const res = mockRes();

    await deleteProduct(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted' });
  });

  it('returns 404 when product does not exist', async () => {
    Product.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { id: 'bad-id' } };
    const res = mockRes();

    await deleteProduct(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
