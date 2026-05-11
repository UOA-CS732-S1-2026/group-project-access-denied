import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import ReturnsPage from '../../src/pages/ReturnsPage';

describe('ReturnsPage', () => {
  it('renders a page heading', () => {
    render(<MemoryRouter><ReturnsPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  });

  it('renders navbar and footer', () => {
    render(<MemoryRouter><ReturnsPage /></MemoryRouter>);
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });
});
