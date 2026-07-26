export interface PromoModalDTO {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  autoCloseSeconds: number;
  isActive: boolean;
  displayOrder: number;
  targetPaths?: string | null;
}

export interface CreatePromoModalRequest {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  autoCloseSeconds: number;
  isActive: boolean;
  displayOrder: number;
  targetPaths?: string | null;
}

export interface UpdatePromoModalRequest {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
  autoCloseSeconds: number;
  isActive: boolean;
  displayOrder: number;
  targetPaths?: string | null;
}
