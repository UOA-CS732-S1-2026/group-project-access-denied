import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HelpBot from '../../src/components/Helpbot';

beforeEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe('HelpBot', () => {
  it('renders the toggle button', () => {
    render(<HelpBot />);
    expect(screen.getByRole('button', { name: /toggle helpbot/i })).toBeTruthy();
  });

  it('chat panel is hidden by default', () => {
    render(<HelpBot />);
    expect(screen.queryByText('HelpBot')).toBeNull();
  });

  it('opens chat panel when toggle button is clicked', () => {
    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle helpbot/i }));
    expect(screen.getByText('HelpBot')).toBeTruthy();
  });

  it('shows initial greeting message', () => {
    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle helpbot/i }));
    expect(screen.getByText(/ask me anything/i)).toBeTruthy();
  });

  it('closes panel when toggle button is clicked again', () => {
    render(<HelpBot />);
    const toggle = screen.getByRole('button', { name: /toggle helpbot/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.queryByText('HelpBot')).toBeNull();
  });

  it('send button is disabled when input is empty', () => {
    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle helpbot/i }));
    expect(screen.getByRole('button', { name: /send/i }).disabled).toBe(true);
  });

  it('calls fetch and shows reply on message send', async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ reply: 'Hello from bot!', sessionId: 42 }) })
    );

    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle helpbot/i }));

    const textarea = screen.getByPlaceholderText(/ask me anything/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => expect(screen.getByText('Hello from bot!')).toBeTruthy());
    expect(window.fetch).toHaveBeenCalledOnce();
  });

  it('shows error message when fetch fails', async () => {
    window.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle helpbot/i }));

    const textarea = screen.getByPlaceholderText(/ask me anything/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => expect(screen.getByText(/trouble connecting/i)).toBeTruthy());
  });
});
