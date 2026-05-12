import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getChallenges, submitFlag, useHint } from '../../src/api/challenge.api.js';

beforeEach(() => vi.clearAllMocks());

describe('challenge.api', () => {
  it('getChallenges calls GET /challenges', () => {
    getChallenges();
    expect(api.get).toHaveBeenCalledWith('/challenges');
  });

  it('submitFlag calls POST /flags/submit', () => {
    const data = { challengeId: 'ch1', flag: 'CTF{test}' };
    submitFlag(data);
    expect(api.post).toHaveBeenCalledWith('/flags/submit', data);
  });

  it('useHint calls POST /challenges/:id/hint/:idx', () => {
    useHint('ch1', 0);
    expect(api.post).toHaveBeenCalledWith('/challenges/ch1/hint/0');
  });
});
