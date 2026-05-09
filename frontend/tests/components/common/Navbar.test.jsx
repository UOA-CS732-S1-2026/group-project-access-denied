import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../src/context/CartContext', () => ({
  useCart: vi.fn(),
}));

import { useAuth } from '../../../src/context/AuthContext';
import { useCart } from '../../../src/context/CartContext';
import Navbar from '../../../src/components/common/Navbar';

const wrap = (props = {}) =>
  render(
    <MemoryRouter>
      <Navbar {...props} />
    </MemoryRouter>
  );

describe('Navbar', () => {
  beforeEach(() => {
    useCart.mockReturnValue({ cartCount: 0 });
    useAuth.mockReturnValue({ user: null });
  });

  it('renders logo link', () => {
    wrap();
    expect(screen.getByText('APAPPAREL')).toBeTruthy();
  });

  it('renders Home and Products links for regular user', () => {
    useAuth.mockReturnValue({ user: { role: 'user' } });
    wrap();
    expect(screen.getByRole('link', { name: /home/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /products/i })).toBeTruthy();
  });

  it('renders Admin link instead of Home/Products for admin user', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' } });
    wrap();
    expect(screen.getByRole('link', { name: /admin/i })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /^home$/i })).toBeNull();
  });

  it('shows cart badge when cartCount > 0', () => {
    useAuth.mockReturnValue({ user: { role: 'user' } });
    useCart.mockReturnValue({ cartCount: 3 });
    wrap();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('does not show cart icon for admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' } });
    useCart.mockReturnValue({ cartCount: 5 });
    wrap();
    expect(screen.queryByText('5')).toBeNull();
  });

  it('logo links to /admin for admin user', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' } });
    wrap();
    const logo = screen.getByText('APAPPAREL').closest('a');
    expect(logo.getAttribute('href')).toBe('/admin');
  });
});
