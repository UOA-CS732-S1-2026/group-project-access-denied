import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/api/order.api', () => ({
  getOrders: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { getOrders } from '../../src/api/order.api';
import OrderHistoryPage from '../../src/pages/OrderHistoryPage';

const wrap = () => render(<MemoryRouter><OrderHistoryPage /></MemoryRouter>);

beforeEach(() => vi.clearAllMocks());

describe('OrderHistoryPage', () => {
  it('renders Order History heading', async () => {
    getOrders.mockResolvedValue({ data: [] });
    wrap();
    await waitFor(() => expect(screen.getByText('Order History')).toBeTruthy());
  });

  it('renders tab filters', async () => {
    getOrders.mockResolvedValue({ data: [] });
    wrap();
    await waitFor(() => {
      expect(screen.getByText('All Orders')).toBeTruthy();
      expect(screen.getByText('In Transit')).toBeTruthy();
      expect(screen.getByText('Completed')).toBeTruthy();
    });
  });

  it('renders orders returned by API', async () => {
    const order = { _id: 'o1', orderNumber: 'ORD-TEST-1', status: 'delivered', total: 150, createdAt: '2024-01-01', items: [] };
    getOrders.mockResolvedValue({ data: [order] });
    wrap();
    // Order number rendered as "Order #<orderNumber>"
    await waitFor(() => expect(screen.getByText(new RegExp(`Order #${order.orderNumber}`))).toBeTruthy());
  });

  it('shows empty state when no orders', async () => {
    getOrders.mockResolvedValue({ data: [] });
    wrap();
    await waitFor(() => expect(screen.getByText(/no orders/i)).toBeTruthy());
  });

  it('filters to In Transit tab', async () => {
    const transit = { _id: 'o1', orderNumber: 'TRANSIT-1', status: 'processing', total: 100, createdAt: '2024-01-01', items: [] };
    const delivered = { _id: 'o2', orderNumber: 'DELIVERED-1', status: 'delivered', total: 200, createdAt: '2024-01-02', items: [] };
    getOrders.mockResolvedValue({ data: [transit, delivered] });
    wrap();
    await waitFor(() => expect(screen.getByText(new RegExp(`Order #${transit.orderNumber}`))).toBeTruthy());
    fireEvent.click(screen.getByText('In Transit'));
    expect(screen.getByText(new RegExp(`Order #${transit.orderNumber}`))).toBeTruthy();
    expect(screen.queryByText(new RegExp(`Order #${delivered.orderNumber}`))).toBeNull();
  });
});
