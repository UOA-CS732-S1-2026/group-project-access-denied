const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const { connect, runGlobalSeed, clearSessionData, disconnect, SEED_CREDENTIALS } = require('../helpers/db');

const testUser = {
  username: 'ordertester',
  email: 'ordertester@example.com',
  password: 'password123',
  securityQuestion: 'Favourite colour?',
  securityAnswer: 'blue',
};

const validOrderBody = {
  items: [{ product: new mongoose.Types.ObjectId(), size: 'M', quantity: 1, priceAtPurchase: 245 }],
  total: 245,
  shippingAddress: {
    fullName: 'Test User',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    postcode: '97403',
    country: 'US',
  },
};

let userToken;
let adminToken;

beforeAll(async () => {
  await connect();
  await runGlobalSeed();
});

beforeEach(async () => {
  const userRes = await request(app).post('/api/auth/register').send(testUser);
  userToken = userRes.body.token;

  const adminRes = await request(app)
    .post('/api/auth/login')
    .send(SEED_CREDENTIALS.admin);
  adminToken = adminRes.body.token;
});

afterEach(async () => { await clearSessionData(); });

afterAll(async () => { await disconnect(); });

// ─── GET /api/orders ──────────────────────────────────────────────────────────

describe('GET /api/orders', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
  });

  it('returns an empty array when the session has no orders', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns only orders belonging to the current session', async () => {
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validOrderBody);

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].total).toBe(245);
  });
});

// ─── POST /api/orders ─────────────────────────────────────────────────────────

describe('POST /api/orders', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).post('/api/orders').send(validOrderBody);
    expect(res.status).toBe(401);
  });

  it('creates an order and returns 201', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validOrderBody);

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(245);
    expect(res.body.status).toBe('pending');
    expect(res.body.orderNumber).toBeDefined();
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ total: 100 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('items and shippingAddress are required');
  });

  it('auto-increments orderNumber for consecutive orders', async () => {
    const first = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validOrderBody);

    const second = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validOrderBody);

    expect(second.body.orderNumber).toBe(first.body.orderNumber + 1);
  });
});

// ─── GET /api/orders/:orderNumber ─────────────────────────────────────────────

describe('GET /api/orders/:orderNumber', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/orders/1');
    expect(res.status).toBe(401);
  });

  it('returns 404 for a non-existent orderNumber', async () => {
    const res = await request(app)
      .get('/api/orders/99999')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Order not found');
  });

  it('allows any authenticated user to fetch any order (IDOR — no ownership check)', async () => {
    const created = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validOrderBody);

    const { orderNumber } = created.body;

    // Admin fetches user's order — should succeed with no ownership check
    const res = await request(app)
      .get(`/api/orders/${orderNumber}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.orderNumber).toBe(orderNumber);
  });
});

// ─── GET /api/orders/admin/all ────────────────────────────────────────────────

describe('GET /api/orders/admin/all', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/orders/admin/all');
    expect(res.status).toBe(401);
  });

  it('returns 403 for a non-admin user', async () => {
    const res = await request(app)
      .get('/api/orders/admin/all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('returns all orders for an admin', async () => {
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validOrderBody);

    const res = await request(app)
      .get('/api/orders/admin/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
