import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getProducts, getProduct, getReviews, createReview } from '../../src/api/product.api.js';

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

  it('getReviews calls GET /products/:id/reviews', () => {
    getReviews('p1');
    expect(api.get).toHaveBeenCalledWith('/products/p1/reviews');
  });

  it('createReview calls POST /products/:id/reviews', () => {
    createReview('p1', { rating: 5, body: 'Great' });
    expect(api.post).toHaveBeenCalledWith('/products/p1/reviews', { rating: 5, body: 'Great' });
  });
});
