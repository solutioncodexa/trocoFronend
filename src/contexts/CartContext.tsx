import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types/product';
import { toast } from 'sonner';
import { lineTotal } from '@/utils/rental';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedVariantId?: string,
    customLogoUrl?: string,
    variant?: { key: string; label?: string },
    rental?: { start: string; end: string; unit: 'DAY' | 'WEEK'; deposit?: number | null }
  ) => void;
  /** Le 3e argument est la clé de ligne : `item.variantKey ?? item.selectedVariantId`. */
  removeFromCart: (productId: string, selectedSize?: string, lineVariantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, lineVariantKey?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function stripLegacyGoldFromItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: unknown) => {
    if (!item || typeof item !== 'object') return item as CartItem;
    const o = item as Record<string, unknown>;
    const { selectedGoldType: _g, ...rest } = o;
    return rest as unknown as CartItem;
  });
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const normalizeId = (value: unknown) => String(value ?? '');
  const normalizeVariant = (value: unknown) => String(value ?? '');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as unknown;
        const normalized = stripLegacyGoldFromItems(parsed);
        setItems(normalized);
        localStorage.setItem('cart', JSON.stringify(normalized));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const sameLine = (
    item: CartItem,
    productId: string,
    selectedSize?: string,
    lineVariantKey?: string
  ) =>
    normalizeId(item.product.id) === normalizeId(productId) &&
    normalizeVariant(item.selectedSize) === normalizeVariant(selectedSize) &&
    normalizeVariant(item.variantKey ?? item.selectedVariantId) === normalizeVariant(lineVariantKey);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedVariantId?: string,
    customLogoUrl?: string,
    variant?: { key: string; label?: string },
    rental?: { start: string; end: string; unit: 'DAY' | 'WEEK'; deposit?: number | null }
  ) => {
    const lineKey = variant?.key ?? selectedVariantId;
    setItems((prev) => {
      const existing = prev.find((item) => sameLine(item, product.id, selectedSize, lineKey));
      if (existing) {
        const newItems = prev.map((item) =>
          sameLine(item, product.id, selectedSize, lineKey)
            ? {
                ...item,
                quantity: item.quantity + quantity,
                customLogoUrl: customLogoUrl || item.customLogoUrl,
                product,
              }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(newItems));
        toast.success('Quantité mise à jour dans le panier');
        return newItems;
      }
      const newItems = [
        ...prev,
        {
          product,
          quantity,
          selectedSize,
          selectedVariantId,
          customLogoUrl,
          variantKey: variant?.key,
          variantLabel: variant?.label,
          ...(rental
            ? { rentalStart: rental.start, rentalEnd: rental.end, rentalUnit: rental.unit, rentalDeposit: rental.deposit ?? null }
            : {}),
        },
      ];
      localStorage.setItem('cart', JSON.stringify(newItems));
      toast.success('Produit ajouté au panier');
      return newItems;
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string, lineVariantKey?: string) => {
    setItems((prev) => {
      const newItems = prev.filter(
        (item) => !sameLine(item, productId, selectedSize, lineVariantKey)
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      toast.success('Produit supprimé du panier');
      return newItems;
    });
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string,
    lineVariantKey?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, lineVariantKey);
      return;
    }

    setItems((prev) => {
      const newItems = prev.map((item) =>
        sameLine(item, productId, selectedSize, lineVariantKey)
          ? { ...item, quantity }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      toast.success('Quantité mise à jour');
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    toast.success('Panier vidé');
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + lineTotal(item), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
