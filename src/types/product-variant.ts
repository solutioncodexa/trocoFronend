/** Attribut Woo d'une variante (ex. Quantité + Taille) */
export interface VariantAttribute {
  name: string;
  value: string;
}

/** Variante attribut / prix (emballage Troco) */
export interface ProductVariant {
  id?: string;
  attributeName?: string;
  attributeValue?: string;
  /** Attributs complets (plusieurs dimensions) */
  attributes?: VariantAttribute[];
  label?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  safetyStock?: number | null;
  reorderQty?: number | null;
  expiryDate?: string | null;
  sku?: string;
  displayOrder?: number;
  isDefault?: boolean;
  /** Legacy */
  weight?: number;
  marginGain?: number;
}

/** Normalise le libellé d'attribut (Woo / encodage) */
export function normalizeAxisName(name: string): string {
  const n = (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (n.includes('quantit')) return 'Quantité';
  if (n.includes('taille') || n.includes('dimension') || n.includes('format')) return 'Taille';
  return name.trim() || 'Option';
}

/** Normalise la liste d'attributs d'une variante */
export function getVariantAttributes(v: ProductVariant): VariantAttribute[] {
  if (v.attributes && v.attributes.length > 0) {
    return v.attributes
      .filter((a) => a?.name && a?.value)
      .map((a) => ({ name: normalizeAxisName(a.name), value: a.value }));
  }
  if (v.attributeName && v.attributeValue) {
    return [{ name: normalizeAxisName(v.attributeName), value: v.attributeValue }];
  }
  return [];
}

/** Axes d'attributs uniques (ordre : Quantité puis Taille puis autres) */
export function buildAttributeAxes(variants: ProductVariant[]): string[] {
  const seen = new Set<string>();
  const axes: string[] = [];
  for (const v of variants) {
    for (const a of getVariantAttributes(v)) {
      const key = a.name.trim();
      if (!seen.has(key.toLowerCase())) {
        seen.add(key.toLowerCase());
        axes.push(key);
      }
    }
  }
  const rank = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('quantit')) return 0;
    if (n.includes('taille') || n.includes('dimension') || n.includes('format')) return 1;
    return 2;
  };
  return axes.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, 'fr'));
}

export function valuesForAxis(variants: ProductVariant[], axis: string): string[] {
  const vals = new Set<string>();
  for (const v of variants) {
    const hit = getVariantAttributes(v).find(
      (a) => a.name.toLowerCase() === axis.toLowerCase()
    );
    if (hit?.value) vals.add(hit.value);
  }
  return Array.from(vals).sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));
}

export function findVariantByAttributes(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | undefined {
  return variants.find((v) => {
    const attrs = getVariantAttributes(v);
    return Object.entries(selected).every(([name, value]) =>
      attrs.some(
        (a) => a.name.toLowerCase() === name.toLowerCase() && a.value === value
      )
    );
  });
}


export interface ProductVariantFormRow {
  id?: string;
  attributeName: string;
  attributeValue: string;
  label: string;
  price: string;
  originalPrice: string;
  stock: string;
  /** Vide = hériter du seuil défaut global */
  safetyStock: string;
  sku: string;
  isDefault: boolean;
}

export function createEmptyVariantRow(isDefault = false): ProductVariantFormRow {
  return {
    attributeName: 'Capacité',
    attributeValue: '',
    label: '',
    price: '',
    originalPrice: '',
    stock: '100',
    safetyStock: '',
    sku: '',
    isDefault,
  };
}
