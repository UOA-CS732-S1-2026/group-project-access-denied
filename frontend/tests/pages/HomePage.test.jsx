import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/components/common/Navbar', () => ({ default: () => <nav data-testid="navbar" /> }));
vi.mock('../../src/components/common/Footer', () => ({ default: () => <footer data-testid="footer" /> }));
vi.mock('../../src/assets/images', () => ({
  categoryWomen: '',
  categoryMen: '',
  categoryAccessories: '',
  brandStory: '',
}));

import HomePage from '../../src/pages/HomePage';

const wrap = () => render(<MemoryRouter><HomePage /></MemoryRouter>);

describe('HomePage', () => {
  it('renders navbar and footer', () => {
    wrap();
    expect(screen.getByTestId('navbar')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  it('renders hero heading', () => {
    wrap();
    expect(screen.getByText(/ESTHÉTIQUE/i)).toBeTruthy();
  });

  it('renders Shop New Arrivals CTA', () => {
    wrap();
    expect(screen.getByText(/shop new arrivals/i)).toBeTruthy();
  });

  it('renders category section heading', () => {
    wrap();
    expect(screen.getByText(/curated picks/i)).toBeTruthy();
  });

  it('renders brand story section', () => {
    wrap();
    expect(screen.getByText(/crafting the future of wardrobes/i)).toBeTruthy();
  });

  it('renders View Product links', () => {
    wrap();
    const links = screen.getAllByText(/view product/i);
    expect(links.length).toBeGreaterThan(0);
  });
});
