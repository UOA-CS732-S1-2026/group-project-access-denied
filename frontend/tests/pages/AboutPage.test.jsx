import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import AboutPage from '../../src/pages/AboutPage';

describe('AboutPage', () => {
  it('renders navbar and footer', () => {
    render(<MemoryRouter><AboutPage /></MemoryRouter>);
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  it('renders Meet the Founder heading', () => {
    render(<MemoryRouter><AboutPage /></MemoryRouter>);
    expect(screen.getByText(/meet the founder/i)).toBeTruthy();
  });

  it('renders Who We Are label', () => {
    render(<MemoryRouter><AboutPage /></MemoryRouter>);
    expect(screen.getByText(/who we are/i)).toBeTruthy();
  });
});
