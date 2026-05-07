const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../../src/models/product.model');

let mongod;

const validProduct = {
  name: 'Draped Silk Blouse',
  description: 'A luxuriously light silk blouse.',
  price: 245,
  category: 'clothing',
};

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongod.stop();
});

// ─── Schema defaults ──────────────────────────────────────────────────────────

describe('defaults', () => {
  it('sets isActive to true by default', async () => {
    const product = await Product.create(validProduct);
    expect(product.isActive).toBe(true);
  });

  it('sets featured to false by default', async () => {
    const product = await Product.create(validProduct);
    expect(product.featured).toBe(false);
  });

  it('sets stock to 0 by default', async () => {
    const product = await Product.create(validProduct);
    expect(product.stock).toBe(0);
  });

  it('sets sizes to an empty array by default', async () => {
    const product = await Product.create(validProduct);
    expect(product.sizes).toEqual([]);
  });

  it('sets images to an empty array by default', async () => {
    const product = await Product.create(validProduct);
    expect(product.images).toEqual([]);
  });
});

// ─── Required field validation ────────────────────────────────────────────────

describe('required field validation', () => {
  it.each(['name', 'description', 'price', 'category'])(
    'throws a validation error when %s is missing',
    async (field) => {
      const data = { ...validProduct };
      delete data[field];
      await expect(Product.create(data)).rejects.toThrow(mongoose.Error.ValidationError);
    }
  );
});

// ─── Category enum ────────────────────────────────────────────────────────────

describe('category enum', () => {
  it.each(['clothing', 'shoes'])('accepts "%s" as a valid category', async (category) => {
    const product = await Product.create({ ...validProduct, category });
    expect(product.category).toBe(category);
  });

  it('rejects an invalid category', async () => {
    await expect(
      Product.create({ ...validProduct, category: 'accessories' })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });
});

// ─── Numeric constraints ──────────────────────────────────────────────────────

describe('numeric constraints', () => {
  it('rejects a negative price', async () => {
    await expect(
      Product.create({ ...validProduct, price: -1 })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('accepts a price of 0', async () => {
    const product = await Product.create({ ...validProduct, price: 0 });
    expect(product.price).toBe(0);
  });

  it('rejects a negative stock value', async () => {
    await expect(
      Product.create({ ...validProduct, stock: -5 })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('accepts a stock of 0', async () => {
    const product = await Product.create({ ...validProduct, stock: 0 });
    expect(product.stock).toBe(0);
  });
});

// ─── Optional fields ──────────────────────────────────────────────────────────

describe('optional fields', () => {
  it('stores sizes when provided', async () => {
    const product = await Product.create({ ...validProduct, sizes: ['XS', 'S', 'M'] });
    expect(product.sizes).toEqual(['XS', 'S', 'M']);
  });

  it('stores images when provided', async () => {
    const product = await Product.create({ ...validProduct, images: ['https://example.com/img.png'] });
    expect(product.images).toEqual(['https://example.com/img.png']);
  });

  it('can mark a product as inactive', async () => {
    const product = await Product.create({ ...validProduct, isActive: false });
    expect(product.isActive).toBe(false);
  });
});
