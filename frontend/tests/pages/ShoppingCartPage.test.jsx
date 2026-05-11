import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { useCart } from '../../src/context/CartContext';
import ShoppingCartPage from '../../src/pages/ShoppingCartPage';

const wrap = () => render(<MemoryRouter><ShoppingCartPage /></MemoryRouter>);

beforeEach(() => vi.clearAllMocks());

describe('ShoppingCartPage', () => {
  it('renders Shopping Bag heading', () => {
    useCart.mockReturnValue({ cart: [], cartCount: 0, cartTotal: 0, removeFromCart: vi.fn(), updateQty: vi.fn() });
    wrap();
    expect(screen.getByText('Shopping Bag')).toBeTruthy();
  });

  it('shows empty cart message when cart is empty', () => {
    useCart.mockReturnValue({ cart: [], cartCount: 0, cartTotal: 0, removeFromCart: vi.fn(), updateQty: vi.fn() });
    wrap();
    expect(screen.getByText(/currently empty/i)).toBeTruthy();
  });

  it('renders Continue Shopping link when empty', () => {
    useCart.mockReturnValue({ cart: [], cartCount: 0, cartTotal: 0, removeFromCart: vi.fn(), updateQty: vi.fn() });
    wrap();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeTruthy();
  });

  it('renders cart items when cart has products', () => {
    useCart.mockReturnValue({
      cart: [
        {
          key: 'p1-M-Default',
          product: { _id: 'p1', name: 'Silk Blouse', price: 199, images: ['img.jpg'] },
          size: 'M',
          color: 'Default',
          qty: 2,
        },
      ],
      cartCount: 2,
      cartTotal: 398,
      removeFromCart: vi.fn(),
      updateQty: vi.fn(),
    });
    wrap();
    expect(screen.getByText('Silk Blouse')).toBeTruthy();
  });

  it('shows checkout link when cart is not empty', () => {
    useCart.mockReturnValue({
      cart: [
        {
          key: 'p1-M-Default',
          product: { _id: 'p1', name: 'Silk Blouse', price: 199, images: ['img.jpg'] },
          size: 'M',
          color: 'Default',
          qty: 1,
        },
      ],
      cartCount: 1,
      cartTotal: 199,
      removeFromCart: vi.fn(),
      updateQty: vi.fn(),
    });
    wrap();
    expect(screen.getByRole('link', { name: /proceed to checkout/i })).toBeTruthy();
  });
});
