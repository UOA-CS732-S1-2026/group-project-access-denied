process.env.JWT_SECRET = 'test-secret';

const crypto = require('crypto');
const { getSecurityQuestion, verifySecurityAnswer } = require('../../src/controllers/forgotPassword.controller');
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

const mockUser = {
  _id: 'user-id-123',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  securityQuestion: "What is your pet's name?",
  securityAnswer: 'fluffy',
};

const mockSession = {
  _id: 'session-doc-id',
  sessionId: 'test-session-uuid',
  userId: 'user-id-123',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(crypto, 'randomUUID').mockReturnValue('test-session-uuid');
});

// ─── getSecurityQuestion ──────────────────────────────────────────────────────

describe('getSecurityQuestion', () => {
  it('returns the security question for a valid email', async () => {
    User.findOne.mockResolvedValue(mockUser);

    const req = { body: { email: 'test@example.com' } };
    const res = mockRes();

    await getSecurityQuestion(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({
      securityQuestion: mockUser.securityQuestion,
      email: mockUser.email,
    });
  });

  it('returns 400 when email is missing', async () => {
    const req = { body: {} };
    const res = mockRes();

    await getSecurityQuestion(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email is required' });
  });

  it('returns 404 when no account matches the email', async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { email: 'nobody@example.com' } };
    const res = mockRes();

    await getSecurityQuestion(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No account found with that email' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    User.findOne.mockRejectedValue(err);

    const next = jest.fn();
    await getSecurityQuestion({ body: { email: 'x@x.com' } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── verifySecurityAnswer ─────────────────────────────────────────────────────

describe('verifySecurityAnswer', () => {
  it('returns 400 when email or securityAnswer is missing', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and security answer are required' });
  });

  it('returns 404 when the account does not exist', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    const req = { body: { email: 'nobody@example.com', securityAnswer: 'fluffy' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 401 when the security answer is wrong', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    const req = { body: { email: 'test@example.com', securityAnswer: 'wronganswer' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect security answer' });
  });

  it('returns a JWT when the correct answer is provided and reuses existing session', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    Session.findOne.mockResolvedValue(mockSession);

    const req = { body: { email: 'test@example.com', securityAnswer: 'fluffy' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    expect(Session.create).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
      sessionId: mockSession.sessionId,
      expiresAt: mockSession.expiresAt.getTime(),
    }));
  });

  it('creates a new session when none exists', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    Session.findOne.mockResolvedValue(null);
    Session.create.mockResolvedValue(mockSession);

    const req = { body: { email: 'test@example.com', securityAnswer: 'fluffy' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    expect(Session.create).toHaveBeenCalled();
    expect(seedSession).toHaveBeenCalledWith(mockSession.sessionId);
  });

  it('returns the CTF flag when the CEO account is accessed', async () => {
    const ceoUser = {
      ...mockUser,
      email: 'ajithpatel@apapparel.com',
      securityAnswer: 'simba',
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(ceoUser) });
    Session.findOne.mockResolvedValue(mockSession);

    const req = { body: { email: 'AjithPatel@APapparel.com', securityAnswer: 'simba' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ flag: 'CTF{social_profile_exposed_answer}' })
    );
  });

  it('does not include the flag for a regular user account', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    Session.findOne.mockResolvedValue(mockSession);

    const req = { body: { email: 'test@example.com', securityAnswer: 'fluffy' } };
    const res = mockRes();

    await verifySecurityAnswer(req, res, jest.fn());

    const response = res.json.mock.calls[0][0];
    expect(response).not.toHaveProperty('flag');
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    User.findOne.mockReturnValue({ select: jest.fn().mockRejectedValue(err) });

    const next = jest.fn();
    await verifySecurityAnswer({ body: { email: 'x@x.com', securityAnswer: 'x' } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});