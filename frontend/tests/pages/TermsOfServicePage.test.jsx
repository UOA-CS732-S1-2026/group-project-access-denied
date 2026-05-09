import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import TermsOfServicePage from '../../src/pages/TermsOfServicePage';

describe('TermsOfServicePage', () => {
  it('renders Terms of Service heading', () => {
    render(<MemoryRouter><TermsOfServicePage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  });

  it('renders navbar and footer', () => {
    render(<MemoryRouter><TermsOfServicePage /></MemoryRouter>);
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });
});
