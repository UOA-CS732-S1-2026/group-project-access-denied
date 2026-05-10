import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import PrivacyPolicyPage from '../../src/pages/PrivacyPolicyPage';

describe('PrivacyPolicyPage', () => {
  it('renders a page heading', () => {
    render(<MemoryRouter><PrivacyPolicyPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
  });

  it('renders navbar and footer', () => {
    render(<MemoryRouter><PrivacyPolicyPage /></MemoryRouter>);
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });
});
