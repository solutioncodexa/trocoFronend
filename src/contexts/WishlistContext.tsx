import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { wishlistApi } from '@/services/api';
import { mapProductDTOListToProducts } from '@/utils/productMapper';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  getWishlistProducts: () => Product[];
  wishlistCount: number;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Charger la wishlist depuis l'API
  const { data: wishlistProductsData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      try {
        const products = await wishlistApi.getWishlist();
        return mapProductDTOListToProducts(products);
      } catch (error) {
        // Si erreur, retourner un tableau vide
        return [];
      }
    },
    retry: 1,
  });

  const [wishlist, setWishlist] = useState<string[]>([]);

  // Synchroniser avec les données de l'API
  useEffect(() => {
    if (wishlistProductsData) {
      const productIds = wishlistProductsData.map(p => p.id);
      setWishlist(productIds);
      localStorage.setItem('wishlist', JSON.stringify(productIds));
    }
  }, [wishlistProductsData]);

  // Mutation pour ajouter à la wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await wishlistApi.addToWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Produit ajouté aux favoris');
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout aux favoris');
    },
  });

  // Mutation pour supprimer de la wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await wishlistApi.removeFromWishlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Produit retiré des favoris');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression des favoris');
    },
  });

  const addToWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      const newWishlist = [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
    addToWishlistMutation.mutate(productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(id => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
    removeFromWishlistMutation.mutate(productId);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const getWishlistProducts = () => {
    return wishlistProductsData || [];
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
    // Clear all items from wishlist via API
    wishlist.forEach(productId => {
      removeFromWishlistMutation.mutate(productId);
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        getWishlistProducts,
        wishlistCount: wishlist.length,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
