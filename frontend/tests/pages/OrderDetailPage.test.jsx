import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../src/api/order.api', () => ({
  getOrder: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { getOrder } from '../../src/api/order.api';
import OrderDetailPage from '../../src/pages/OrderDetailPage';

const wrap = () =>
  render(
    <MemoryRouter initialEntries={['/orders/ORD-001']}>
      <Routes>
        <Route path="/orders/:orderNumber" element={<OrderDetailPage />} />
        <Route path="/orders" element={<div>Orders Page</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => vi.clearAllMocks());

describe('OrderDetailPage', () => {
  it('shows loading state', () => {
    getOrder.mockReturnValue(new Promise(() => {}));
    wrap();
    expect(screen.getByText(/loading order/i)).toBeTruthy();
  });

  it('shows not found when order is null', async () => {
    getOrder.mockRejectedValue(new Error('Not found'));
    wrap();
    await waitFor(() => expect(screen.getByText(/order not found/i)).toBeTruthy());
  });

  it('renders order number in heading', async () => {
    const order = {
      _id: 'o1', orderNumber: 'TEST-ORDER-99', status: 'delivered', total: 200,
      createdAt: '2024-01-01', items: [],
      shippingAddress: { fullName: 'Alice', street: '1 Main St', city: 'NYC', postcode: '10001', country: 'US' },
    };
    getOrder.mockResolvedValue({ data: order });
    wrap();
    // Rendered as "#<orderNumber>" inside the h1
    await waitFor(() => expect(screen.getByText(`#${order.orderNumber}`)).toBeTruthy());
  });

  it('renders order status badge', async () => {
    const order = {
      _id: 'o1', orderNumber: 'TEST-ORDER-99', status: 'processing', total: 200,
      createdAt: '2024-01-01', items: [],
      shippingAddress: { fullName: 'Alice', street: '1 Main St', city: 'NYC', postcode: '10001', country: 'US' },
    };
    getOrder.mockResolvedValue({ data: order });
    wrap();
    await waitFor(() => expect(screen.getByText(order.status)).toBeTruthy());
  });
});
