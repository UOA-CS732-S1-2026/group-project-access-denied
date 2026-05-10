import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../../src/api/order.api', () => ({
  createOrder: vi.fn(),
}));

vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { useCart } from '../../src/context/CartContext';
import CheckoutPage from '../../src/pages/CheckoutPage';

const mockCartItem = {
  key: 'p1-M-Default',
  product: { _id: 'p1', name: 'Silk Blouse', price: 199, images: ['img.jpg'] },
  size: 'M',
  color: 'Default',
  qty: 1,
};

const wrap = () => render(<MemoryRouter><CheckoutPage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  useCart.mockReturnValue({
    cart: [mockCartItem],
    cartTotal: 199,
    cartCount: 1,
    clearCart: vi.fn(),
  });
});

describe('CheckoutPage', () => {
  it('renders Shipping step in heading', () => {
    const { container } = wrap();
    expect(container.querySelector('h1')).toBeTruthy();
  });

  it('renders first name and last name inputs', () => {
    const { container } = wrap();
    expect(container.querySelector('[name="firstName"]')).toBeTruthy();
    expect(container.querySelector('[name="lastName"]')).toBeTruthy();
  });

  it('renders order summary with cart items', () => {
    wrap();
    expect(screen.getByText('Silk Blouse')).toBeTruthy();
  });

  it('shows validation error when continuing with empty fields', async () => {
    wrap();
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));
    await waitFor(() => expect(screen.getByText(/first name is required/i)).toBeTruthy());
  });

  it('renders empty bag notice when cart is empty', () => {
    useCart.mockReturnValue({ cart: [], cartTotal: 0, cartCount: 0, clearCart: vi.fn() });
    wrap();
    expect(screen.getByText(/your bag is empty/i)).toBeTruthy();
  });
});
