import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';
import ProtectedRoute from '../../src/components/ProtectedRoute';

const wrap = (ui, initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  it('renders loading indicator when loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    wrap(
      <ProtectedRoute><div>Protected</div></ProtectedRoute>
    );
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('redirects to /login when no user', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    wrap(
      <ProtectedRoute><div>Protected</div></ProtectedRoute>
    );
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('renders children when user has allowed role', () => {
    useAuth.mockReturnValue({ user: { role: 'user' }, loading: false });
    wrap(
      <ProtectedRoute allowedRoles={['user']}><div>Protected</div></ProtectedRoute>
    );
    expect(screen.getByText('Protected')).toBeTruthy();
  });

  it('redirects admin to /admin when role is not in allowedRoles', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' }, loading: false });
    wrap(
      <ProtectedRoute allowedRoles={['user']}><div>Protected</div></ProtectedRoute>
    );
    expect(screen.getByText('Admin Page')).toBeTruthy();
  });

  it('defaults to allowing both user and admin roles', () => {
    useAuth.mockReturnValue({ user: { role: 'admin' }, loading: false });
    wrap(
      <ProtectedRoute><div>Protected</div></ProtectedRoute>
    );
    expect(screen.getByText('Protected')).toBeTruthy();
  });
});
