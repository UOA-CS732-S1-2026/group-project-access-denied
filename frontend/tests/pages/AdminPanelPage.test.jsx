import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/api/admin.api', () => ({
  getAllProducts: vi.fn(),
  importProductImage: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { useAuth } from '../../src/context/AuthContext';
import { getAllProducts } from '../../src/api/admin.api';
import AdminPanelPage from '../../src/pages/AdminPanelPage';

const wrap = () => render(<MemoryRouter><AdminPanelPage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ user: { role: 'admin', username: 'admin' } });
  getAllProducts.mockResolvedValue({ data: [] });
});

describe('AdminPanelPage', () => {
  it('redirects to /login when no user', () => {
    useAuth.mockReturnValue({ user: null });
    const { container } = wrap();
    expect(container.innerHTML).not.toContain('Manage Products');
  });

  it('redirects non-admin to /', () => {
    useAuth.mockReturnValue({ user: { role: 'user' } });
    const { container } = wrap();
    expect(container.innerHTML).not.toContain('Manage Products');
  });

  it('renders admin panel for admin user', async () => {
    wrap();
    await waitFor(() => expect(screen.getByText('Manage Products')).toBeTruthy());
  });

  it('renders stat cards', async () => {
    wrap();
    await waitFor(() => expect(screen.getByText('Total Revenue')).toBeTruthy());
  });

  it('renders empty product table when no products', async () => {
    wrap();
    await waitFor(() => expect(screen.getByText(/no products match/i)).toBeTruthy());
  });

  it('renders error message when products fetch fails', async () => {
    getAllProducts.mockRejectedValue({ response: { data: { message: 'Unauthorized' } } });
    wrap();
    await waitFor(() => expect(screen.getByText('Unauthorized')).toBeTruthy());
  });

  it('renders product rows when products are loaded', async () => {
    const product = { _id: '1', name: 'Test Product Alpha', category: 'Clothes', price: 200, stock: 10, images: [''], description: '' };
    getAllProducts.mockResolvedValue({ data: [product] });
    wrap();
    await waitFor(() => expect(screen.getByText(product.name)).toBeTruthy());
  });
});
