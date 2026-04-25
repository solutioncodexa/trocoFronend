/** Données catalogue peu volatiles (catégories, types, collections, types d’or) */
export const staticCatalogQueryOptions = {
  staleTime: 30 * 60 * 1000,
  gcTime: 45 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;
