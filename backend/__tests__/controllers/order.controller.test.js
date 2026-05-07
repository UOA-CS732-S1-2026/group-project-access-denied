const { getOrders, getOrder, createOrder, getAllOrders } = require('../../src/controllers/order.controller');
const Order = require('../../src/models/order.model');

jest.mock('../../src/models/order.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockOrder = {
  _id: 'order-id-123',
  orderNumber: 2,
  sessionId: 'sess-abc',
  user: 'user-id-123',
  items: [],
  total: 150,
  shippingAddress: { fullName: 'Test User', street: '1 Main St', city: 'NYC', postcode: '10001', country: 'US' },
  discountApplied: 0,
};

beforeEach(() => jest.clearAllMocks());

// ─── getOrders ────────────────────────────────────────────────────────────────

describe('getOrders', () => {
  it('returns all orders for the current session', async () => {
    const orders = [mockOrder];
    Order.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(orders),
      }),
    });

    const req = { sessionId: 'sess-abc' };
    const res = mockRes();

    await getOrders(req, res, jest.fn());

    expect(Order.find).toHaveBeenCalledWith({ sessionId: 'sess-abc' });
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Order.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockRejectedValue(err) }) });

    const next = jest.fn();
    await getOrders({ sessionId: 'sess-abc' }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── getOrder ─────────────────────────────────────────────────────────────────

describe('getOrder', () => {
  it('returns a single order by orderNumber (no session check — IDOR vulnerability)', async () => {
    Order.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(mockOrder) });

    const req = { params: { orderNumber: '2' }, sessionId: 'different-session' };
    const res = mockRes();

    await getOrder(req, res, jest.fn());

    expect(Order.findOne).toHaveBeenCalledWith({ orderNumber: 2 });
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

  it('returns 404 when the order does not exist', async () => {
    Order.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });

    const req = { params: { orderNumber: '999' }, sessionId: 'sess-abc' };
    const res = mockRes();

    await getOrder(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Order.findOne.mockReturnValue({ populate: jest.fn().mockRejectedValue(err) });

    const next = jest.fn();
    await getOrder({ params: { orderNumber: '1' }, sessionId: 'x' }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── createOrder ──────────────────────────────────────────────────────────────

describe('createOrder', () => {
  it('returns 400 when required fields are missing', async () => {
    const req = { body: { items: [], total: 100 }, user: { id: 'user-id-123' }, sessionId: 'sess-abc' };
    const res = mockRes();

    await createOrder(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'items, total and shippingAddress are required' });
  });

  it('returns 400 when items array is empty', async () => {
    const req = {
      body: { items: [], total: 100, shippingAddress: mockOrder.shippingAddress },
      user: { id: 'user-id-123' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createOrder(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates an order with auto-incremented orderNumber and returns 201', async () => {
    Order.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ orderNumber: 5 }),
      }),
    });
    Order.create.mockResolvedValue({ ...mockOrder, orderNumber: 6 });

    const req = {
      body: { items: [{ product: 'prod-1', qty: 1 }], total: 150, shippingAddress: mockOrder.shippingAddress },
      user: { id: 'user-id-123' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createOrder(req, res, jest.fn());

    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({ orderNumber: 6 }));
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('starts orderNumber at 2 when no prior orders exist', async () => {
    Order.findOne.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      }),
    });
    Order.create.mockResolvedValue({ ...mockOrder, orderNumber: 2 });

    const req = {
      body: { items: [{ product: 'prod-1', qty: 1 }], total: 150, shippingAddress: mockOrder.shippingAddress },
      user: { id: 'user-id-123' },
      sessionId: 'sess-abc',
    };
    const res = mockRes();

    await createOrder(req, res, jest.fn());

    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({ orderNumber: 2 }));
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Order.findOne.mockReturnValue({ sort: jest.fn().mockReturnValue({ select: jest.fn().mockRejectedValue(err) }) });

    const req = {
      body: { items: [{}], total: 100, shippingAddress: mockOrder.shippingAddress },
      user: { id: 'x' },
      sessionId: 'x',
    };
    const next = jest.fn();

    await createOrder(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── getAllOrders ─────────────────────────────────────────────────────────────

describe('getAllOrders', () => {
  it('returns all orders with user and product populated', async () => {
    const orders = [mockOrder];
    Order.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(orders),
        }),
      }),
    });

    const req = {};
    const res = mockRes();

    await getAllOrders(req, res, jest.fn());

    expect(Order.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(orders);
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Order.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ sort: jest.fn().mockRejectedValue(err) }),
      }),
    });

    const next = jest.fn();
    await getAllOrders({}, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});