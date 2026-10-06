import { describe, expect, it, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CartProvider, useCart } from '@/contexts/CartContext';
import type { Product } from '@/types/product';

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

const product = (price: number): Product =>
  ({ id: '7', name: 'Sachet', price, images: [], category: '', inStock: true }) as unknown as Product;

describe('CartContext — variantes d’un même produit', () => {
  beforeEach(() => localStorage.clear());

  it('garde deux lignes pour deux variantes sans id (10 et 20)', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(product(10), 1, undefined, undefined, undefined, { key: 'q-10', label: 'Quantité : 10' });
      result.current.addToCart(product(20), 1, undefined, undefined, undefined, { key: 'q-20', label: 'Quantité : 20' });
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.getTotal()).toBe(30);
  });

  it('fusionne seulement quand la variante est identique', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(product(10), 1, undefined, undefined, undefined, { key: 'q-10' });
      result.current.addToCart(product(10), 2, undefined, undefined, undefined, { key: 'q-10' });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('met à jour / supprime la bonne ligne via la clé de variante', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(product(10), 1, undefined, undefined, undefined, { key: 'q-10' });
      result.current.addToCart(product(20), 1, undefined, undefined, undefined, { key: 'q-20' });
    });
    act(() => result.current.updateQuantity('7', 5, undefined, 'q-20'));
    expect(result.current.items.find((i) => i.variantKey === 'q-20')?.quantity).toBe(5);
    expect(result.current.items.find((i) => i.variantKey === 'q-10')?.quantity).toBe(1);
    act(() => result.current.removeFromCart('7', undefined, 'q-10'));
    expect(result.current.items.map((i) => i.variantKey)).toEqual(['q-20']);
  });
});
