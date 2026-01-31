import { useState, useCallback, useEffect } from 'react';

export const OZ_TO_GRAM = 28.3495;
const STORAGE_KEY = 'goldPriceUnit';

export type GoldPriceUnit = 'oz' | 'gram';

export function useGoldPriceUnit() {
  const [unit, setUnitState] = useState<GoldPriceUnit>(() => {
    if (typeof window === 'undefined') return 'gram';
    return (localStorage.getItem(STORAGE_KEY) as GoldPriceUnit) || 'gram';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const setUnit = useCallback((u: GoldPriceUnit) => setUnitState(u), []);

  const toDisplayPrice = useCallback(
    (priceOz: number) => (unit === 'gram' ? priceOz / OZ_TO_GRAM : priceOz),
    [unit],
  );

  const unitLabel = unit === 'gram' ? 'MAD/g' : 'MAD/oz';

  return { unit, setUnit, toDisplayPrice, unitLabel };
}
