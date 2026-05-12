import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HelpBot from '../../src/components/HelpBot';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe('HelpBot', () => {
  it('renders the toggle button', () => {
    render(<HelpBot />);
    expect(screen.getByRole('button', { name: /toggle stylebot/i })).toBeTruthy();
  });

  it('chat panel is hidden by default', () => {
    render(<HelpBot />);
    expect(screen.queryByText('StyleBot')).toBeNull();
  });

  it('opens chat panel when toggle button is clicked', () => {
    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle stylebot/i }));
    expect(screen.getByText('StyleBot')).toBeTruthy();
  });

  it('shows initial greeting message', () => {
    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle stylebot/i }));
    expect(screen.getByText(/sizing/i)).toBeTruthy();
  });

  it('closes panel when toggle button is clicked again', () => {
    render(<HelpBot />);
    const toggle = screen.getByRole('button', { name: /toggle stylebot/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.queryByText('StyleBot')).toBeNull();
  });

  it('send button is disabled when input is empty', () => {
    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle stylebot/i }));
    expect(screen.getByRole('button', { name: /send/i }).disabled).toBe(true);
  });

  it('calls fetch and shows reply on message send', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ reply: 'Hello from bot!', sessionId: 42 }) })
    ));

    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle stylebot/i }));

    const textarea = screen.getByPlaceholderText(/ask me anything/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => expect(screen.getByText('Hello from bot!')).toBeTruthy());
    expect(vi.mocked(globalThis.fetch)).toHaveBeenCalledOnce();
  });

  it('shows error message when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network error'))));

    render(<HelpBot />);
    fireEvent.click(screen.getByRole('button', { name: /toggle stylebot/i }));

    const textarea = screen.getByPlaceholderText(/ask me anything/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => expect(screen.getByText(/trouble connecting/i)).toBeTruthy());
  });
});
