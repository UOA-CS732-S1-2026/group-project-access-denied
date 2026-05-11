import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../../src/api/product.api', () => ({
  getProduct: vi.fn(),
}));

vi.mock('../../src/context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { getProduct } from '../../src/api/product.api';
import { useCart } from '../../src/context/CartContext';
import ProductDetailsPage from '../../src/pages/ProductDetailsPage';

const wrap = () =>
  render(
    <MemoryRouter initialEntries={['/products/p1']}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<div>Cart Page</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  useCart.mockReturnValue({ addToCart: vi.fn() });
});

describe('ProductDetailsPage', () => {
  it('shows loading state', () => {
    getProduct.mockReturnValue(new Promise(() => {}));
    wrap();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('shows not found when product is null', async () => {
    getProduct.mockRejectedValue(new Error('Not found'));
    wrap();
    await waitFor(() => expect(screen.getByText(/product not found/i)).toBeTruthy());
  });

  it('renders product name and price', async () => {
    const product = { _id: 'p1', name: 'Test Jacket', price: 299, images: ['img.jpg'], sizes: ['S', 'M'], isActive: true, description: 'A jacket' };
    getProduct.mockResolvedValue({ data: product });
    wrap();
    await waitFor(() => expect(screen.getAllByText(product.name).length).toBeGreaterThan(0));
    expect(screen.getByText(new RegExp('\\$' + product.price))).toBeTruthy();
  });

  it('renders size options', async () => {
    const sizes = ['S', 'M', 'L'];
    getProduct.mockResolvedValue({
      data: { _id: 'p1', name: 'Test Jacket', price: 299, images: ['img.jpg'], sizes, isActive: true, description: '' },
    });
    wrap();
    await waitFor(() => {
      sizes.forEach((s) => expect(screen.getByText(s)).toBeTruthy());
    });
  });
});
