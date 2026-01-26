import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, GoldType } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedGoldType?: GoldType) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedGoldType?: GoldType) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedGoldType?: GoldType) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate unique key for cart item based on product id, size, and gold type
const getCartItemKey = (productId: string, selectedSize?: string, selectedGoldType?: GoldType) => {
  return `${productId}-${selectedSize || 'none'}-${selectedGoldType || 'none'}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedGoldType?: GoldType) => {
    setItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.selectedSize === selectedSize &&
        item.selectedGoldType === selectedGoldType
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === selectedSize &&
          item.selectedGoldType === selectedGoldType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedSize, selectedGoldType }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedGoldType?: GoldType) => {
    setItems(prev => prev.filter(item => 
      !(item.product.id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedGoldType === selectedGoldType)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedGoldType?: GoldType) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedGoldType);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedGoldType === selectedGoldType
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
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
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
