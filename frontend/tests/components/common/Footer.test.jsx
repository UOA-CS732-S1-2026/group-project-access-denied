import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../../src/components/common/Footer';

const wrap = () => render(<MemoryRouter><Footer /></MemoryRouter>);

describe('Footer', () => {
  it('renders brand name', () => {
    wrap();
    expect(screen.getByText('APAPPAREL')).toBeTruthy();
  });

  it('renders About Us link', () => {
    wrap();
    expect(screen.getByRole('link', { name: /about us/i })).toBeTruthy();
  });

  it('renders Shipping link', () => {
    wrap();
    expect(screen.getByRole('link', { name: /shipping/i })).toBeTruthy();
  });

  it('renders Returns link', () => {
    wrap();
    expect(screen.getByRole('link', { name: /returns/i })).toBeTruthy();
  });

  it('renders Terms of Service link', () => {
    wrap();
    expect(screen.getByRole('link', { name: /terms of service/i })).toBeTruthy();
  });

  it('renders Privacy Policy link', () => {
    wrap();
    expect(screen.getByRole('link', { name: /privacy policy/i })).toBeTruthy();
  });
});
