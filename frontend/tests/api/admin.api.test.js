import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getAllProducts, importProductImage } from '../../src/api/admin.api.js';

beforeEach(() => vi.clearAllMocks());

describe('admin.api', () => {
  it('getAllProducts calls GET /admin/products', () => {
    getAllProducts();
    expect(api.get).toHaveBeenCalledWith('/admin/products');
  });

  it('importProductImage calls POST /admin/products/:id/import-image', () => {
    importProductImage('abc123', 'http://img.com/photo.jpg');
    expect(api.post).toHaveBeenCalledWith(
      '/admin/products/abc123/import-image',
      { imageUrl: 'http://img.com/photo.jpg' }
    );
  });
});
