import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getScoreboard } from '../../src/api/scoreboard.api.js';

beforeEach(() => vi.clearAllMocks());

describe('scoreboard.api', () => {
  it('getScoreboard calls GET /scoreboard', () => {
    getScoreboard();
    expect(api.get).toHaveBeenCalledWith('/scoreboard');
  });
});
