import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChallengeCard from '../../../src/components/challenges/ChallengeCard';

const challenge = {
  _id: 'ch1',
  title: 'SQL Injection 101',
  description: 'Find the flag using SQL injection.',
  category: 'sql-injection',
  difficulty: 'easy',
  points: 100,
  hints: [],
};

describe('ChallengeCard', () => {
  it('renders the challenge title', () => {
    render(<ChallengeCard challenge={challenge} isSolved={false} onSelect={vi.fn()} />);
    expect(screen.getByText('SQL Injection 101')).toBeTruthy();
  });

  it('renders the challenge description', () => {
    render(<ChallengeCard challenge={challenge} isSolved={false} onSelect={vi.fn()} />);
    expect(screen.getByText('Find the flag using SQL injection.')).toBeTruthy();
  });

  it('renders point value', () => {
    render(<ChallengeCard challenge={challenge} isSolved={false} onSelect={vi.fn()} />);
    expect(screen.getByText('100')).toBeTruthy();
  });

  it('calls onSelect with challenge when clicked', () => {
    const onSelect = vi.fn();
    render(<ChallengeCard challenge={challenge} isSolved={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(challenge);
  });

  it('shows solved checkmark when isSolved', () => {
    render(<ChallengeCard challenge={challenge} isSolved={true} onSelect={vi.fn()} />);
    expect(screen.getByText(/✓/)).toBeTruthy();
  });

  it('shows hint count when hints are present', () => {
    const ch = { ...challenge, hints: [{ text: 'hint1', cost: 0 }, { text: 'hint2', cost: 10 }] };
    render(<ChallengeCard challenge={ch} isSolved={false} onSelect={vi.fn()} />);
    expect(screen.getByText(/2 hints available/)).toBeTruthy();
  });

  it('renders category label', () => {
    render(<ChallengeCard challenge={challenge} isSolved={false} onSelect={vi.fn()} />);
    expect(screen.getByText('SQL Injection')).toBeTruthy();
  });
});
