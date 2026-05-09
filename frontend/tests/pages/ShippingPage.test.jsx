import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));

import ShippingPage from '../../src/pages/ShippingPage';

describe('ShippingPage', () => {
  it('renders shipping heading', () => {
    render(<MemoryRouter><ShippingPage /></MemoryRouter>);
    expect(screen.getByText('Shipping Information')).toBeTruthy();
  });

  it('renders navbar and footer', () => {
    render(<MemoryRouter><ShippingPage /></MemoryRouter>);
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  it('renders Order History link using router Link', () => {
    render(<MemoryRouter><ShippingPage /></MemoryRouter>);
    const link = screen.getByRole('link', { name: /order history/i });
    expect(link.getAttribute('href')).toBe('/orders');
  });
});
