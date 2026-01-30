import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, CartItem, GoldType } from '@/types/product';
import { cartApi } from '@/services/api';
import { CartItemDTO } from '@/types/api';
import { mapProductDTOToProduct } from '@/utils/productMapper';
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

// Generate unique key for cart item based on product id, size, and gold type
const getCartItemKey = (productId: string, selectedSize?: string, selectedGoldType?: GoldType) => {
  return `${productId}-${selectedSize || 'none'}-${selectedGoldType || 'none'}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Charger le panier depuis l'API
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const cart = await cartApi.getCart();
        // Convertir les CartItemDTO en CartItem
        const items: CartItem[] = (cart.items || []).map((item: CartItemDTO) => ({
          product: mapProductDTOToProduct(item.product),
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedGoldType: item.selectedGoldType as GoldType | undefined,
        }));
        return items;
      } catch (error) {
        // Si erreur, retourner un tableau vide
        return [];
      }
    },
    retry: 1,
  });

  const [items, setItems] = useState<CartItem[]>([]);

  // Synchroniser avec les données de l'API
  useEffect(() => {
    if (cartData) {
      setItems(cartData);
      localStorage.setItem('cart', JSON.stringify(cartData));
    }
  }, [cartData]);

  // Mutation pour ajouter au panier
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      return await cartApi.addItemToCart(productId, quantity);
    },
    onSuccess: (cart) => {
      const items: CartItem[] = (cart.items || []).map((item: CartItemDTO) => ({
        product: mapProductDTOToProduct(item.product),
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedGoldType: item.selectedGoldType as GoldType | undefined,
      }));
      setItems(items);
      localStorage.setItem('cart', JSON.stringify(items));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout au panier');
    },
  });

  // Mutation pour mettre à jour la quantité
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      return await cartApi.updateItemQuantity(itemId, quantity);
    },
    onSuccess: (cart) => {
      const items: CartItem[] = (cart.items || []).map((item: CartItemDTO) => ({
        product: mapProductDTOToProduct(item.product),
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedGoldType: item.selectedGoldType as GoldType | undefined,
      }));
      setItems(items);
      localStorage.setItem('cart', JSON.stringify(items));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du panier');
    },
  });

  // Mutation pour supprimer du panier
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await cartApi.removeItemFromCart(itemId);
    },
    onSuccess: (cart) => {
      const items: CartItem[] = (cart.items || []).map((item: CartItemDTO) => ({
        product: mapProductDTOToProduct(item.product),
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedGoldType: item.selectedGoldType as GoldType | undefined,
      }));
      setItems(items);
      localStorage.setItem('cart', JSON.stringify(items));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du panier');
    },
  });

  // Mutation pour vider le panier
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return await cartApi.clearCart();
    },
    onSuccess: () => {
      setItems([]);
      localStorage.removeItem('cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error('Erreur lors du vidage du panier');
    },
  });

  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedGoldType?: GoldType) => {
    // Pour l'instant, on utilise le localStorage comme fallback
    // Le backend ne gère pas encore les tailles et types d'or dans le panier
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
        return newItems;
      }
      const newItems = [...prev, { product, quantity, selectedSize, selectedGoldType }];
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
    
    // Appeler l'API en arrière-plan
    addToCartMutation.mutate({ productId: product.id, quantity });
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedGoldType?: GoldType) => {
    // Trouver l'item correspondant pour obtenir son ID backend
    const item = items.find(item => 
      item.product.id === productId && 
      item.selectedSize === selectedSize &&
      item.selectedGoldType === selectedGoldType
    );
    
    setItems(prev => {
      const newItems = prev.filter(item => 
        !(item.product.id === productId && 
          item.selectedSize === selectedSize &&
          item.selectedGoldType === selectedGoldType)
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });

    // Si on a un ID backend, appeler l'API
    // Note: Le backend ne gère pas encore les tailles/types d'or, donc on utilise localStorage pour l'instant
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
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    clearCartMutation.mutate();
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
