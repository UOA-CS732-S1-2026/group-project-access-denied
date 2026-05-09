import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../src/context/CartContext';

const product = { _id: 'p1', id: 'p1', name: 'Jacket', price: 100, images: ['img.jpg'], isActive: true };

const Consumer = () => {
  const { cart, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart } = useCart();
  return (
    <div>
      <span data-testid="count">{cartCount}</span>
      <span data-testid="total">{cartTotal}</span>
      <span data-testid="items">{cart.length}</span>
      <button onClick={() => addToCart(product, { size: 'M', color: 'Black', qty: 1 })}>add</button>
      <button onClick={() => removeFromCart('p1-M-Black')}>remove</button>
      <button onClick={() => updateQty('p1-M-Black', 1)}>inc</button>
      <button onClick={() => updateQty('p1-M-Black', -10)}>dec-to-zero</button>
      <button onClick={clearCart}>clear</button>
    </div>
  );
};

beforeEach(() => localStorage.clear());

describe('CartContext', () => {
  it('starts empty', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('total').textContent).toBe('0');
  });

  it('addToCart increments count and total', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('total').textContent).toBe('100');
  });

  it('addToCart twice stacks quantity on same key', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    act(() => screen.getByText('add').click());
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('items').textContent).toBe('1');
  });

  it('removeFromCart removes the item', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    act(() => screen.getByText('remove').click());
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('items').textContent).toBe('0');
  });

  it('updateQty increments quantity', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    act(() => screen.getByText('inc').click());
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('updateQty removes item when qty drops to zero', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    act(() => screen.getByText('dec-to-zero').click());
    expect(screen.getByTestId('items').textContent).toBe('0');
  });

  it('clearCart empties the cart', () => {
    render(<CartProvider><Consumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    act(() => screen.getByText('clear').click());
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('does not add inactive products', () => {
    const inactiveProduct = { ...product, isActive: false };
    const InactiveConsumer = () => {
      const { cartCount, addToCart } = useCart();
      return (
        <div>
          <span data-testid="count">{cartCount}</span>
          <button onClick={() => addToCart(inactiveProduct)}>add</button>
        </div>
      );
    };
    render(<CartProvider><InactiveConsumer /></CartProvider>);
    act(() => screen.getByText('add').click());
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
