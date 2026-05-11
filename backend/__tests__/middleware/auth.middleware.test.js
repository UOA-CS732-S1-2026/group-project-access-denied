const jwt = require('jsonwebtoken');
const { protect, adminOnly } = require('../../src/middleware/auth.middleware');

process.env.JWT_SECRET = 'test-secret';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── protect ─────────────────────────────────────────────────────────────────

describe('protect middleware', () => {
  it('attaches decoded user and sessionId then calls next', () => {
    const payload = { id: 'user123', username: 'alice', role: 'user', sessionId: 'sess-abc' };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user.id).toBe('user123');
    expect(req.user.username).toBe('alice');
    expect(req.sessionId).toBe('sess-abc');
  });

  it('returns 401 when Authorization header is absent', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Not authorised, no token provided' })
    );
  });

  it('returns 401 when the Authorization header does not start with Bearer', () => {
    const req = { headers: { authorization: 'Basic sometoken' } };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when the token is malformed', () => {
    const req = { headers: { authorization: 'Bearer notavalidjwt' } };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Not authorised, token invalid or expired' })
    );
  });

  it('returns 401 when the token is signed with the wrong secret', () => {
    const token = jwt.sign({ id: 'user123' }, 'wrong-secret');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when the token has expired', () => {
    const token = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET, { expiresIn: -1 });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

// ─── adminOnly ────────────────────────────────────────────────────────────────

describe('adminOnly middleware', () => {
  it('calls next when the user role is admin', () => {
    const req = { user: { role: 'admin' } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when the user role is user', () => {
    const req = { user: { role: 'user' } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Forbidden — admin access required' })
    );
  });

  it('returns 403 when req.user is undefined', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});