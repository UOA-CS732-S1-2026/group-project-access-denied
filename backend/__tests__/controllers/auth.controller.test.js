process.env.JWT_SECRET = 'test-secret';

const crypto = require('crypto');
const { register, login, getMe } = require('../../src/controllers/auth.controller');
const User = require('../../src/models/user.model');
const Session = require('../../src/models/session.model');
const { seedSession } = require('../../src/config/seed.session');

jest.mock('../../src/models/user.model');
jest.mock('../../src/models/session.model');
jest.mock('../../src/config/seed.session', () => ({
  seedSession: jest.fn().mockResolvedValue(undefined),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const validBody = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  securityQuestion: "What is your pet's name?",
  securityAnswer: 'fluffy',
};

const mockUser = {
  _id: 'user-id-123',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  password: 'hashed-password',
  comparePassword: jest.fn(),
};

const mockSession = {
  _id: 'session-doc-id',
  sessionId: 'test-session-uuid',
  userId: 'user-id-123',
  createdAt: new Date(),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(crypto, 'randomUUID').mockReturnValue('test-session-uuid');
});

// ─── register ─────────────────────────────────────────────────────────────────

describe('register', () => {
  it('returns 400 when any required field is missing', async () => {
    const req = { body: { username: 'foo', password: 'bar' } };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 409 when username or email is already taken', async () => {
    User.findOne.mockResolvedValue(mockUser);

    const req = { body: validBody };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Username or email already taken' });
  });

  it('creates user and session, calls seedSession, returns 201 with token', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockUser);
    Session.create.mockResolvedValue(mockSession);

    const req = { body: validBody };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      username: validBody.username,
      email: validBody.email,
    }));
    expect(Session.create).toHaveBeenCalledWith(expect.objectContaining({
      sessionId: 'test-session-uuid',
    }));
    expect(seedSession).toHaveBeenCalledWith('test-session-uuid');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      sessionId: 'test-session-uuid',
      user: expect.objectContaining({ username: 'testuser' }),
    }));
  });

  it('embeds the CTF flag inside the JWT payload', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockUser);
    Session.create.mockResolvedValue(mockSession);

    const req = { body: validBody };
    const res = mockRes();

    await register(req, res, jest.fn());

    const { token } = res.json.mock.calls[0][0];
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.flag).toBe('CTF{m1_b0mba_y0u_f0und_me}');
  });

  it('forwards unexpected errors to next()', async () => {
    User.findOne.mockResolvedValue(null);
    const dbError = new Error('DB connection lost');
    User.create.mockRejectedValue(dbError);

    const req = { body: validBody };
    const res = mockRes();
    const next = jest.fn();

    await register(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
    expect(res.status).not.toHaveBeenCalled();
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

describe('login', () => {
  it('returns 400 when email or password is missing', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when no user is found for the given email', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    const req = { body: { email: 'nobody@example.com', password: 'pass' } };
    const res = mockRes();

    await login(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('returns 401 when the password does not match', async () => {
    mockUser.comparePassword.mockResolvedValue(false);
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
    const res = mockRes();

    await login(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('reuses an existing session and returns 200 with token', async () => {
    mockUser.comparePassword.mockResolvedValue(true);
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    Session.findOne.mockResolvedValue(mockSession);

    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = mockRes();

    await login(req, res, jest.fn());

    expect(Session.create).not.toHaveBeenCalled();
    expect(seedSession).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      sessionId: mockSession.sessionId,
    }));
  });

  it('creates a new session when none exists', async () => {
    mockUser.comparePassword.mockResolvedValue(true);
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    Session.findOne.mockResolvedValue(null);
    Session.create.mockResolvedValue(mockSession);

    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = mockRes();

    await login(req, res, jest.fn());

    expect(Session.create).toHaveBeenCalled();
    expect(seedSession).toHaveBeenCalledWith(mockSession.sessionId);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
  });

  it('forwards unexpected errors to next()', async () => {
    const dbError = new Error('timeout');
    User.findOne.mockReturnValue({ select: jest.fn().mockRejectedValue(dbError) });

    const req = { body: { email: 'test@example.com', password: 'pass' } };
    const res = mockRes();
    const next = jest.fn();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });
});

// ─── getMe ────────────────────────────────────────────────────────────────────

describe('getMe', () => {
  it('returns the authenticated user with populated solvedChallenges', async () => {
    const populatedUser = { ...mockUser, solvedChallenges: [] };
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(populatedUser),
    });

    const req = { user: { id: 'user-id-123' } };
    const res = mockRes();

    await getMe(req, res, jest.fn());

    expect(User.findById).toHaveBeenCalledWith('user-id-123');
    expect(res.json).toHaveBeenCalledWith(populatedUser);
  });

  it('returns 404 when the user no longer exists in the database', async () => {
    User.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const req = { user: { id: 'deleted-user-id' } };
    const res = mockRes();

    await getMe(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('forwards unexpected errors to next()', async () => {
    const dbError = new Error('DB error');
    User.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(dbError),
    });

    const req = { user: { id: 'user-id-123' } };
    const res = mockRes();
    const next = jest.fn();

    await getMe(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });
});
