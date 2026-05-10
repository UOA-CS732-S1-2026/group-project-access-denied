import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';

vi.mock('../../src/api/auth.api', () => ({
  getMe: vi.fn(),
}));

import { getMe } from '../../src/api/auth.api';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

const Consumer = () => {
  const { user, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.username : 'null'}</span>
      <button onClick={() => login('tok', { username: 'alice' })}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('AuthContext', () => {
  it('starts with loading=true then resolves to loading=false when no token', async () => {
    getMe.mockResolvedValue({ data: { username: 'alice' } });
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('calls getMe and sets user when token exists in localStorage', async () => {
    localStorage.setItem('token', 'mytoken');
    getMe.mockResolvedValue({ data: { username: 'alice' } });
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('alice'));
  });

  it('clears token from localStorage when getMe fails', async () => {
    localStorage.setItem('token', 'badtoken');
    getMe.mockRejectedValue(new Error('401'));
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('login stores token and sets user', async () => {
    getMe.mockResolvedValue({ data: {} });
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    act(() => screen.getByText('login').click());
    expect(localStorage.getItem('token')).toBe('tok');
    expect(screen.getByTestId('user').textContent).toBe('alice');
  });

  it('logout removes token and clears user', async () => {
    localStorage.setItem('token', 'tok');
    getMe.mockResolvedValue({ data: { username: 'alice' } });
    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('alice'));

    act(() => screen.getByText('logout').click());
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('user').textContent).toBe('null');
  });
});
