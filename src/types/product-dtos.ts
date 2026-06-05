import type { ProductVariant } from './product-variant';

/**
 * DTOs produit alignés sur le backend (list vs détail).
 * @see ProductListItemDTO / ProductDetailDTO (Java)
 */

export type { ProductVariant };

/** Grille boutique, filtres, pagination publique — sans description longue */
export interface ProductListItemDTO {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  weight: number;
  images: string[];
  category: string;
  type: string;
  goldType?: string;
  collection?: string;
  inStock?: boolean;
  stockQuantity?: number;
  badges?: string[];
  createdAt?: string;
  showWeight?: boolean;
}

/** Fiche produit, panier, commandes, admin — champs complets */
export interface ProductDetailDTO extends ProductListItemDTO {
  description: string;
  availableSizes?: string[];
  marginGain?: number;
  variants?: ProductVariant[];
  deleted?: boolean;
}

/** @deprecated Utiliser ProductDetailDTO */
export type ProductDTO = ProductDetailDTO;
