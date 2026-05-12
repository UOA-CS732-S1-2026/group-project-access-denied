import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getProducts, getProduct } from '../../src/api/product.api.js';

beforeEach(() => vi.clearAllMocks());

describe('product.api', () => {
  it('getProducts calls GET /products with params', () => {
    getProducts({ search: 'jacket' });
    expect(api.get).toHaveBeenCalledWith('/products', { params: { search: 'jacket' } });
  });

  it('getProducts works with no params', () => {
    getProducts();
    expect(api.get).toHaveBeenCalledWith('/products', { params: undefined });
  });

  it('getProduct calls GET /products/:id', () => {
    getProduct('p1');
    expect(api.get).toHaveBeenCalledWith('/products/p1');
  });
});
