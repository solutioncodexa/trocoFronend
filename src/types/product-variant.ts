/** Variante poids / prix d'un produit */
export interface ProductVariant {
  id?: string;
  label: string;
  weight: number;
  price: number;
  originalPrice?: number;
  marginGain?: number;
  displayOrder?: number;
  isDefault?: boolean;
}

export interface ProductVariantFormRow {
  id?: string;
  label: string;
  weight: string;
  marginGain: string;
  price: string;
  originalPrice: string;
  isDefault: boolean;
}

export function createEmptyVariantRow(marginGain = '500', isDefault = false): ProductVariantFormRow {
  return {
    label: '',
    weight: '',
    marginGain,
    price: '',
    originalPrice: '',
    isDefault,
  };
}
