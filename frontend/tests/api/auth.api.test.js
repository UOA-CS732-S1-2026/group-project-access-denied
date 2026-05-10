import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { register, login, getMe } from '../../src/api/auth.api.js';

beforeEach(() => vi.clearAllMocks());

describe('auth.api', () => {
  it('register calls POST /auth/register with data', () => {
    const data = { email: 'a@b.com', password: 'pass' };
    register(data);
    expect(api.post).toHaveBeenCalledWith('/auth/register', data);
  });

  it('login calls POST /auth/login with data', () => {
    const data = { email: 'a@b.com', password: 'pass' };
    login(data);
    expect(api.post).toHaveBeenCalledWith('/auth/login', data);
  });

  it('getMe calls GET /auth/me', () => {
    getMe();
    expect(api.get).toHaveBeenCalledWith('/auth/me');
  });
});
