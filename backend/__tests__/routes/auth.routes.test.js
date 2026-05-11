const request = require('supertest');
const app = require('../../src/app');
const { connect, runGlobalSeed, clearSessionData, disconnect, SEED_CREDENTIALS } = require('../helpers/db');

const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  securityQuestion: "What is your pet's name?",
  securityAnswer: 'fluffy',
};

beforeAll(async () => {
  await connect();
  await runGlobalSeed();
});

afterEach(async () => { await clearSessionData(); });

afterAll(async () => { await disconnect(); });

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('creates a user and returns a JWT with user info', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.role).toBe('user');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All fields are required');
  });

  it('returns 409 when email is already taken', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, username: 'differentuser' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Username or email already taken');
  });

  it('returns 409 when username is already taken', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'other@example.com' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Username or email already taken');
  });

  it('returns 409 when trying to register with a seed username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, username: 'admin' });

    expect(res.status).toBe(409);
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(testUser);
  });

  it('logs in with email and returns a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('sessionId');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('logs in with username in the email field', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.username, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
  });

  it('reuses the existing session on subsequent logins', async () => {
    const first = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    const second = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(second.status).toBe(200);
    expect(second.body.sessionId).toBe(first.body.sessionId);
  });

  it('logs in with the global seed admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(SEED_CREDENTIALS.admin);

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('admin');
  });

  it('returns 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 401 for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    token = res.body.token;
  });

  it('returns the authenticated user without sensitive fields', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body.email).toBe(testUser.email);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('securityAnswer');
  });

  it('returns 401 when no Authorization header is sent', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Not authorised, no token provided');
  });

  it('returns 401 when the token is invalid', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer thisisnotavalidtoken');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Not authorised, token invalid or expired');
  });
});
