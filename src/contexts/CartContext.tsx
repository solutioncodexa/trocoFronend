import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, GoldType } from '@/types/product';
import { toast } from 'sonner';

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedGoldType?: GoldType) => {
    setItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        item.selectedSize === selectedSize &&
        item.selectedGoldType === selectedGoldType
      );
      if (existing) {
        const newItems = prev.map(item =>
          item.product.id === product.id && 
          item.selectedSize === selectedSize &&
          item.selectedGoldType === selectedGoldType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(newItems));
        toast.success('Quantité mise à jour dans le panier');
        return newItems;
      }
      const newItems = [...prev, { product, quantity, selectedSize, selectedGoldType }];
      localStorage.setItem('cart', JSON.stringify(newItems));
      toast.success('Produit ajouté au panier');
      return newItems;
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedGoldType?: GoldType) => {
    setItems(prev => {
      const newItems = prev.filter(item => 
        !(item.product.id === productId && 
          item.selectedSize === selectedSize &&
          item.selectedGoldType === selectedGoldType)
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      toast.success('Produit supprimé du panier');
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string, selectedGoldType?: GoldType) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedGoldType);
      return;
    }
    
    setItems(prev => {
      const newItems = prev.map(item =>
        item.product.id === productId && 
        item.selectedSize === selectedSize &&
        item.selectedGoldType === selectedGoldType
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
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
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
