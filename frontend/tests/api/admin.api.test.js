import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getAllProducts } from '../../src/api/admin.api.js';

beforeEach(() => vi.clearAllMocks());

describe('admin.api', () => {
  it('getAllProducts calls GET /admin/products', () => {
    getAllProducts();
    expect(api.get).toHaveBeenCalledWith('/admin/products');
  });
});
