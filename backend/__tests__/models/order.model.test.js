const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Order = require('../../src/models/order.model');

let mongod;

const validShippingAddress = {
  fullName: 'Test User',
  street: '742 Evergreen Terrace',
  city: 'Springfield',
  postcode: '97403',
  country: 'US',
};

const validOrder = {
  user: new mongoose.Types.ObjectId(),
  items: [
    {
      product: new mongoose.Types.ObjectId(),
      size: 'M',
      quantity: 1,
      priceAtPurchase: 245,
    },
  ],
  total: 245,
  shippingAddress: validShippingAddress,
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  await Order.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
});

// ─── Schema defaults ──────────────────────────────────────────────────────────

describe('defaults', () => {
  it('sets status to "pending" by default', async () => {
    const order = await Order.create(validOrder);
    expect(order.status).toBe('pending');
  });

  it('sets discountApplied to 0 by default', async () => {
    const order = await Order.create(validOrder);
    expect(order.discountApplied).toBe(0);
  });

  it('sets sessionId to null by default', async () => {
    const order = await Order.create(validOrder);
    expect(order.sessionId).toBeNull();
  });

  it('sets internalNote to an empty string by default', async () => {
    const order = await Order.create(validOrder);
    expect(order.internalNote).toBe('');
  });
});

// ─── Required field validation ────────────────────────────────────────────────

describe('required field validation', () => {
  it('throws when user is missing', async () => {
    const { user, ...data } = validOrder;
    await expect(Order.create(data)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('throws when total is missing', async () => {
    const { total, ...data } = validOrder;
    await expect(Order.create(data)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('throws when shippingAddress.fullName is missing', async () => {
    const { fullName, ...address } = validShippingAddress;
    await expect(
      Order.create({ ...validOrder, shippingAddress: address })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('throws when shippingAddress.street is missing', async () => {
    const { street, ...address } = validShippingAddress;
    await expect(
      Order.create({ ...validOrder, shippingAddress: address })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('throws when shippingAddress.city is missing', async () => {
    const { city, ...address } = validShippingAddress;
    await expect(
      Order.create({ ...validOrder, shippingAddress: address })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });
});

// ─── Status enum ──────────────────────────────────────────────────────────────

describe('status enum', () => {
  it.each(['pending', 'processing', 'delivered', 'cancelled'])(
    'accepts "%s" as a valid status',
    async (status) => {
      const order = await Order.create({ ...validOrder, status });
      expect(order.status).toBe(status);
    }
  );

  it('rejects an invalid status value', async () => {
    await expect(
      Order.create({ ...validOrder, status: 'shipped' })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });
});

// ─── Item subdocument validation ──────────────────────────────────────────────

describe('item subdocument', () => {
  it('throws when item quantity is less than 1', async () => {
    const order = {
      ...validOrder,
      items: [{ product: new mongoose.Types.ObjectId(), size: 'M', quantity: 0, priceAtPurchase: 100 }],
    };
    await expect(Order.create(order)).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('throws when item size is missing', async () => {
    const order = {
      ...validOrder,
      items: [{ product: new mongoose.Types.ObjectId(), quantity: 1, priceAtPurchase: 100 }],
    };
    await expect(Order.create(order)).rejects.toThrow(mongoose.Error.ValidationError);
  });
});

// ─── orderNumber unique constraint ───────────────────────────────────────────

describe('orderNumber unique constraint', () => {
  it('rejects duplicate orderNumbers', async () => {
    await Order.create({ ...validOrder, orderNumber: 5 });
    await expect(
      Order.create({ ...validOrder, orderNumber: 5 })
    ).rejects.toThrow();
  });

  it('allows multiple orders without an orderNumber (null is not unique-constrained)', async () => {
    await Order.create(validOrder);
    await expect(Order.create(validOrder)).resolves.toBeDefined();
  });
});
