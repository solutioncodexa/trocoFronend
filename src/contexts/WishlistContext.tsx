import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product';
import { productsApi } from '@/services/api';
import { mapProductDetailToProduct } from '@/utils/productMapper';

const WISHLIST_STORAGE_KEY = 'wishlist';

function readStoredWishlistIds(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

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
  const [wishlist, setWishlist] = useState<string[]>(() => readStoredWishlistIds());

  const wishlistQueryKey = wishlist.slice().sort().join(',');

  const { data: wishlistProductsData = [] } = useQuery({
    queryKey: ['wishlist-products', wishlistQueryKey],
    queryFn: async () => {
      const results = await Promise.all(
        wishlist.map((id) =>
          productsApi.getProductById(id).catch(() => null)
        )
      );
      return results
        .filter((dto): dto is NonNullable<typeof dto> => dto !== null)
        .map(mapProductDetailToProduct);
    },
    enabled: wishlist.length > 0,
    staleTime: 60 * 1000,
  });

  const persistIds = (ids: string[]) => {
    if (ids.length === 0) {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } else {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    }
  };

  const addToWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev;
      const next = [...prev, productId];
      persistIds(next);
      return next;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.filter((id) => id !== productId);
      persistIds(next);
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const getWishlistProducts = () => wishlistProductsData;

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
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
