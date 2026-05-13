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
  useAuth.mockReturnValue({ user: { id: 'u1', role: 'user' } });
});

describe('ChallengesButton', () => {
  it('renders button for a logged-in user', () => {
    wrap();
    expect(screen.getByRole('button', { name: /challenges/i })).toBeTruthy();
  });

  it('renders nothing for admin', () => {
    useAuth.mockReturnValue({ user: { id: 'u1', role: 'admin' } });
    const { container } = wrap();
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing on /challenges route', () => {
    const { container } = wrap('/challenges');
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing on /login route', () => {
    const { container } = wrap('/login');
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no user is logged in', () => {
    useAuth.mockReturnValue({ user: null });
    const { container } = wrap();
    expect(container.firstChild).toBeNull();
  });
});
