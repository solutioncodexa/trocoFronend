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
}
