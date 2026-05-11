import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../../../src/api/challenge.api', () => ({
  submitFlag: vi.fn(),
  useHint: vi.fn(),
}));

import { submitFlag } from '../../../src/api/challenge.api';
import SubmitModal from '../../../src/components/challenges/SubmitModal';

const challenge = {
  _id: 'ch1',
  title: 'SQL Injection 101',
  description: 'Find the flag.',
  category: 'sql-injection',
  difficulty: 'easy',
  points: 100,
  solveCount: 3,
  hints: [],
};

const defaultProps = {
  challenge,
  solvedIds: [],
  onClose: vi.fn(),
  onSuccess: vi.fn(),
  onHintUsed: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe('SubmitModal', () => {
  it('renders the challenge title', () => {
    render(<SubmitModal {...defaultProps} />);
    expect(screen.getByText('SQL Injection 101')).toBeTruthy();
  });

  it('renders the challenge description', () => {
    render(<SubmitModal {...defaultProps} />);
    expect(screen.getByText('Find the flag.')).toBeTruthy();
  });

  it('renders flag input and submit button', () => {
    render(<SubmitModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('CTF{...}')).toBeTruthy();
    expect(screen.getByRole('button', { name: /submit flag/i })).toBeTruthy();
  });

  it('submit button disabled when input is empty', () => {
    render(<SubmitModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /submit flag/i }).disabled).toBe(true);
  });

  it('calls onClose when × button clicked', () => {
    const onClose = vi.fn();
    render(<SubmitModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows correct feedback and calls onSuccess when flag is correct', async () => {
    const onSuccess = vi.fn();
    submitFlag.mockResolvedValue({
      data: { correct: true, message: 'Flag accepted!', pointsAwarded: 100, totalScore: 100 },
    });
    render(<SubmitModal {...defaultProps} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText('CTF{...}'), { target: { value: 'CTF{test}' } });
    fireEvent.click(screen.getByRole('button', { name: /submit flag/i }));

    await waitFor(() => expect(screen.getByText(/Flag accepted!/)).toBeTruthy());
    expect(onSuccess).toHaveBeenCalledWith('ch1', 100, 100);
  });

  it('shows wrong feedback when flag is incorrect', async () => {
    submitFlag.mockResolvedValue({
      data: { correct: false, message: 'Wrong flag!' },
    });
    render(<SubmitModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('CTF{...}'), { target: { value: 'CTF{wrong}' } });
    fireEvent.click(screen.getByRole('button', { name: /submit flag/i }));

    await waitFor(() => expect(screen.getByText(/Wrong flag!/)).toBeTruthy());
  });

  it('shows already solved banner when challenge is in solvedIds', () => {
    render(<SubmitModal {...defaultProps} solvedIds={['ch1']} />);
    expect(screen.getByText(/already solved/i)).toBeTruthy();
  });

  it('shows solve count', () => {
    render(<SubmitModal {...defaultProps} />);
    expect(screen.getByText(/3 solves/)).toBeTruthy();
  });
});
