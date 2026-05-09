import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';
import PublicRoute from '../../src/components/PublicRoute';

const wrap = (ui) =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={ui} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('PublicRoute', () => {
  it('renders loading when loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    wrap(<PublicRoute><div>Login Form</div></PublicRoute>);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('renders children when no user', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    wrap(<PublicRoute><div>Login Form</div></PublicRoute>);
    expect(screen.getByText('Login Form')).toBeTruthy();
  });

  it('redirects regular user to /', () => {
    useAuth.mockReturnValue({ user: { role: 'user' }, loading: false });
    wrap(<PublicRoute><div>Login Form</div></PublicRoute>);
    expect(screen.getByText('Home Page')).toBeTruthy();
  });

  it('redirects admin to /admin', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' }, loading: false });
    wrap(<PublicRoute><div>Login Form</div></PublicRoute>);
    expect(screen.getByText('Admin Page')).toBeTruthy();
  });
});
