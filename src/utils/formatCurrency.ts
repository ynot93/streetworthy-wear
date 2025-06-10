export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(undefined, {
    currency: 'KES',
    style: 'currency',
  }).format(amount);
};