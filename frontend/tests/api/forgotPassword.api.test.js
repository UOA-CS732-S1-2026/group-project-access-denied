import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getSecurityQuestion, verifySecurityAnswer } from '../../src/api/forgotPassword.api.js';

beforeEach(() => vi.clearAllMocks());

describe('forgotPassword.api', () => {
  it('getSecurityQuestion calls POST /auth/forgot-password', () => {
    getSecurityQuestion({ email: 'a@b.com' });
    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'a@b.com' });
  });

  it('verifySecurityAnswer calls POST /auth/forgot-password/verify', () => {
    const data = { email: 'a@b.com', securityAnswer: 'fluffy' };
    verifySecurityAnswer(data);
    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password/verify', data);
  });
});
