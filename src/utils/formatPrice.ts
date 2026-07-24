export const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted} DH`;
};
