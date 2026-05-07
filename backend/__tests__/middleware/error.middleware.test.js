const { notFound, errorHandler } = require('../../src/middleware/error.middleware');

jest.mock('../../src/utils/logger', () => ({
  error: jest.fn(),
  http: jest.fn(),
  info: jest.fn(),
}));

const mockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─── notFound ─────────────────────────────────────────────────────────────────

describe('notFound', () => {
  it('creates a 404 error and passes it to next', () => {
    const req = { originalUrl: '/api/unknown' };
    const res = mockRes();
    const next = jest.fn();

    notFound(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(404);
    expect(err.message).toContain('/api/unknown');
  });
});

// ─── errorHandler ─────────────────────────────────────────────────────────────

describe('errorHandler', () => {
  it('uses err.status as the status code', () => {
    const err = Object.assign(new Error('Not found'), { status: 404 });
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not found' }));
  });

  it('falls back to res.statusCode when err.status is not set', () => {
    const err = new Error('Bad request');
    const res = mockRes();
    res.statusCode = 400;

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('defaults to 500 when err.status is absent and res.statusCode is 200', () => {
    const err = new Error('Unexpected error');
    const res = mockRes();
    res.statusCode = 200;

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('includes the stack trace outside of production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    const err = new Error('Oops');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body.stack).toBeDefined();

    process.env.NODE_ENV = originalEnv;
  });

  it('omits the stack trace in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new Error('Oops');
    const res = mockRes();

    errorHandler(err, {}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});