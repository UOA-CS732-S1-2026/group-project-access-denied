import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../src/api/auth.api.js', () => ({
  register: vi.fn(),
}));

vi.mock('../../src/assets/images', () => ({
  heroImage: '',
}));

import { useAuth } from '../../src/context/AuthContext';
import { register as registerService } from '../../src/api/auth.api.js';
import RegisterPage from '../../src/pages/RegisterPage';

const wrap = () => render(<MemoryRouter><RegisterPage /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ login: vi.fn() });
});

describe('RegisterPage', () => {
  it('renders username, email, and password fields', () => {
    wrap();
    expect(screen.getByLabelText(/username/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it('renders Create Account button', () => {
    wrap();
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy();
  });

  it('renders link back to login', () => {
    wrap();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeTruthy();
  });

  it('shows validation error for short username on blur', async () => {
    wrap();
    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.blur(usernameInput);
    await waitFor(() => expect(screen.getByText(/at least 3 characters/i)).toBeTruthy());
  });

  it('shows validation error for invalid email on blur', async () => {
    wrap();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.blur(emailInput);
    await waitFor(() => expect(screen.getByText(/valid email/i)).toBeTruthy());
  });

  it('shows server error on failed registration', async () => {
    registerService.mockRejectedValue({ response: { data: { message: 'Email already taken' } } });
    wrap();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'alice123' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText(/^answer$/i), { target: { value: 'fluffy' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(screen.getByText('Email already taken')).toBeTruthy());
  });
});
