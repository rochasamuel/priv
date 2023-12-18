export const toCurrency = (value?: number) => {
  let BRLReal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return BRLReal.format(value || 0);
}