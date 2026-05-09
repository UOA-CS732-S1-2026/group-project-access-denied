import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/api/challenge.api', () => ({
  getChallenges: vi.fn(),
}));

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/challenges/ChallengeCard', () => ({
  default: ({ challenge, onSelect }) => (
    <button onClick={() => onSelect(challenge)} data-testid="challenge-card">
      {challenge.title}
    </button>
  ),
}));
vi.mock('../../src/components/challenges/SubmitModal', () => ({
  default: ({ challenge, onClose }) => (
    <div data-testid="submit-modal">
      {challenge.title}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

import { useAuth } from '../../src/context/AuthContext';
import { getChallenges } from '../../src/api/challenge.api';
import ChallengePage from '../../src/pages/ChallengePage';

const wrap = () => render(<MemoryRouter><ChallengePage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useAuth.mockReturnValue({ user: { id: 'u1', role: 'user', solvedChallenges: [], totalScore: 0 } });
});

describe('ChallengePage', () => {
  it('shows loading state initially', () => {
    getChallenges.mockReturnValue(new Promise(() => {}));
    wrap();
    expect(screen.getByText(/loading challenges/i)).toBeTruthy();
  });

  it('renders challenges after loading', async () => {
    const challenge = { _id: 'ch1', title: 'Test Challenge Alpha', category: 'sql-injection', difficulty: 'easy', points: 100, hints: [] };
    getChallenges.mockResolvedValue({ data: [challenge] });
    wrap();
    await waitFor(() => expect(screen.getByText(challenge.title)).toBeTruthy());
  });

  it('shows error when challenges fail to load', async () => {
    getChallenges.mockRejectedValue(new Error('Network error'));
    wrap();
    await waitFor(() => expect(screen.getByText(/failed to load challenges/i)).toBeTruthy());
  });

  it('sets ctf_unlocked key in localStorage for user', async () => {
    getChallenges.mockResolvedValue({ data: [] });
    wrap();
    await waitFor(() => expect(localStorage.getItem('ctf_unlocked_u1')).toBe('1'));
  });
});
