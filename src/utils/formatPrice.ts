export type PriceDisplayOptions = {
  currency?: string | null;
  currencyRatesJson?: string | null;
};

export function convertFromMad(mad: number, options?: PriceDisplayOptions): number {
  const currency = options?.currency?.trim() || 'MAD';
  if (currency === 'MAD') return mad;
  if (!options?.currencyRatesJson?.trim()) return mad;
  try {
    const rates = JSON.parse(options.currencyRatesJson) as Record<string, unknown>;
    const rate = Number(rates[currency]);
    if (!Number.isFinite(rate) || rate <= 0) return mad;
    return mad * rate;
  } catch {
    return mad;
  }
}

export const formatPrice = (price: number, options?: PriceDisplayOptions): string => {
  const currency = options?.currency?.trim() || 'MAD';
  const amount = convertFromMad(price, options);
  const localeTag = currency === 'MAD' ? 'fr-MA' : 'fr-FR';
  const formatted = new Intl.NumberFormat(localeTag, {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'MAD' ? 0 : 2,
  }).format(amount);
  if (currency === 'MAD') return `${formatted} DH`;
  return `${formatted} ${currency}`;
};
