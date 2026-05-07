export interface FeaturedProduct {
  id: string;
  productId: string;
  section: 'heritage' | 'sur-mesure';
  title?: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedProductDTO {
  id: string;
  productId: string;
  section: 'heritage' | 'sur-mesure';
  title?: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Product information
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    productType: string;
    goldType?: string;
    weight: number;
    isActive: boolean;
  };
}

export interface CreateFeaturedProductRequest {
  productId: string;
  section: 'heritage' | 'sur-mesure';
  title?: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateFeaturedProductRequest {
  productId?: string;
  section?: 'heritage' | 'sur-mesure';
  title?: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface FeaturedProductSection {
  section: 'heritage' | 'sur-mesure';
  title: string;
  subtitle: string;
  products: FeaturedProductDTO[];
}
