import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/api/auth.api', () => ({
  login: vi.fn(),
}));

vi.mock('../../src/api/forgotPassword.api', () => ({
  getSecurityQuestion: vi.fn(),
  verifySecurityAnswer: vi.fn(),
}));

import { useAuth } from '../../src/context/AuthContext';
import { login as loginService } from '../../src/api/auth.api';
import { getSecurityQuestion, verifySecurityAnswer } from '../../src/api/forgotPassword.api';
import LoginPage from '../../src/pages/LoginPage';

const wrap = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ login: vi.fn() });
});

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    wrap();
    expect(screen.getByLabelText(/email or username/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it('renders Sign In button', () => {
    wrap();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });

  it('renders link to register page', () => {
    wrap();
    expect(screen.getByRole('link', { name: /create one/i })).toBeTruthy();
  });

  it('shows error on failed login', async () => {
    loginService.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
    wrap();
    fireEvent.change(screen.getByLabelText(/email or username/i), { target: { value: 'bad@email.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeTruthy());
  });

  it('shows forgot password form when link clicked', () => {
    wrap();
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    expect(screen.getByText(/forgot password/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
  });

  it('shows security question step after email submission', async () => {
    getSecurityQuestion.mockResolvedValue({ data: { securityQuestion: 'Name of first pet?' } });
    wrap();
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    await waitFor(() => expect(screen.getByText('Name of first pet?')).toBeTruthy());
  });
});
