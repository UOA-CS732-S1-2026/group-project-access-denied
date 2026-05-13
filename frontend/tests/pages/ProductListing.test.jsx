import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/api/product.api', () => ({
  getProducts: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { getProducts } from '../../src/api/product.api';
import ProductListing from '../../src/pages/ProductListing';

const wrap = () => render(<MemoryRouter><ProductListing /></MemoryRouter>);

const mockProducts = [
  { _id: 'p1', name: 'Test Product Alpha', price: 199, images: ['img1.jpg'] },
  { _id: 'p2', name: 'Test Product Beta', price: 499, images: ['img2.jpg'] },
];

beforeEach(() => {
  vi.clearAllMocks();
  getProducts.mockResolvedValue({ data: mockProducts });
});

// 250ms debounce + async resolution — use 1s timeout
const DEBOUNCE_WAIT = { timeout: 1000 };

describe('ProductListing', () => {
  it('renders heading immediately', () => {
    wrap();
    expect(screen.getByText(/ready-to-wear/i)).toBeTruthy();
  });

  it('renders search input', () => {
    wrap();
    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it('renders products after debounce resolves', async () => {
    wrap();
    await waitFor(() => expect(screen.getByText(mockProducts[0].name)).toBeTruthy(), DEBOUNCE_WAIT);
    expect(screen.getByText(mockProducts[1].name)).toBeTruthy();
  });

  it('calls getProducts with search term after debounce', async () => {
    wrap();
    // Wait for initial load then type a search
    await waitFor(() => expect(getProducts).toHaveBeenCalledOnce(), DEBOUNCE_WAIT);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'jacket' } });
    await waitFor(() => expect(getProducts).toHaveBeenCalledWith({ search: 'jacket' }), DEBOUNCE_WAIT);
  });

  it('renders product links after loading', async () => {
    wrap();
    await waitFor(() => expect(screen.getAllByRole('link').length).toBeGreaterThan(0), DEBOUNCE_WAIT);
  });
});
