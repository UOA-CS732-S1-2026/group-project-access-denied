import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/api/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

import api from '../../src/api/api.js';
import { getOrders, getOrder, createOrder } from '../../src/api/order.api.js';

beforeEach(() => vi.clearAllMocks());

describe('order.api', () => {
  it('getOrders calls GET /orders', () => {
    getOrders();
    expect(api.get).toHaveBeenCalledWith('/orders');
  });

  it('getOrder calls GET /orders/:orderNumber', () => {
    getOrder('ORD-001');
    expect(api.get).toHaveBeenCalledWith('/orders/ORD-001');
  });

  it('createOrder calls POST /orders with data', () => {
    const data = { items: [], total: 100 };
    createOrder(data);
    expect(api.post).toHaveBeenCalledWith('/orders', data);
  });
});
