import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';
import ChallengesButton from '../../src/components/ChallengesButton';

const wrap = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ChallengesButton />
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
  useAuth.mockReturnValue({ user: { id: 'u1', role: 'user' } });
});

describe('ChallengesButton', () => {
  it('renders nothing when localStorage key is not set', () => {
    const { container } = wrap();
    expect(container.firstChild).toBeNull();
  });

  it('renders button when ctf_unlocked key is set for user', () => {
    localStorage.setItem('ctf_unlocked_u1', '1');
    wrap();
    expect(screen.getByRole('button', { name: /challenges/i })).toBeTruthy();
  });

  it('renders nothing for admin even when unlocked', () => {
    localStorage.setItem('ctf_unlocked_u1', '1');
    useAuth.mockReturnValue({ user: { id: 'u1', role: 'admin' } });
    const { container } = wrap();
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing on /challenges route', () => {
    localStorage.setItem('ctf_unlocked_u1', '1');
    const { container } = wrap('/challenges');
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing on /login route', () => {
    localStorage.setItem('ctf_unlocked_u1', '1');
    const { container } = wrap('/login');
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no user is logged in', () => {
    localStorage.setItem('ctf_unlocked_u1', '1');
    useAuth.mockReturnValue({ user: null });
    const { container } = wrap();
    expect(container.firstChild).toBeNull();
  });
});
