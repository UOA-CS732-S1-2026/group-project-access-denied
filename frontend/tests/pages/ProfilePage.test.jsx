import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/context/CartContext', () => ({
  useCart: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import { useAuth } from '../../src/context/AuthContext';
import { useCart } from '../../src/context/CartContext';
import ProfilePage from '../../src/pages/ProfilePage';

const wrap = () => render(<MemoryRouter><ProfilePage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  useCart.mockReturnValue({ clearCart: vi.fn() });
});

describe('ProfilePage', () => {
  it('renders My Account heading', () => {
    useAuth.mockReturnValue({ user: { username: 'alice', role: 'user', email: 'alice@test.com' }, logout: vi.fn() });
    wrap();
    expect(screen.getByText('My Account')).toBeTruthy();
  });

  it('shows username in welcome message', () => {
    useAuth.mockReturnValue({ user: { username: 'alice', role: 'user', email: 'alice@test.com' }, logout: vi.fn() });
    wrap();
    expect(screen.getByText(/welcome back, alice/i)).toBeTruthy();
  });

  it('renders Sign Out button', () => {
    useAuth.mockReturnValue({ user: { username: 'alice', role: 'user', email: 'alice@test.com' }, logout: vi.fn() });
    wrap();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeTruthy();
  });

  it('renders Profile nav item', () => {
    useAuth.mockReturnValue({ user: { username: 'alice', role: 'user', email: 'alice@test.com' }, logout: vi.fn() });
    wrap();
    expect(screen.getByRole('button', { name: /profile/i })).toBeTruthy();
  });

  it('hides Orders nav item for admin', () => {
    useAuth.mockReturnValue({ user: { username: 'admin', role: 'admin', email: 'admin@test.com' }, logout: vi.fn() });
    wrap();
    expect(screen.queryByRole('button', { name: /^orders$/i })).toBeNull();
  });
});
