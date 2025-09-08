import i18n from 'i18next';

export function formatNumber(number, decimals = 2) {
  if (typeof number !== 'number') return '';

  const locale = i18n.language || 'es-CO';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
}