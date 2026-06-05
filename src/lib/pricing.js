export const SERVICE_FEE = 200; // FCFA par commande
export const COMMISSION_RATE = 0.05; // 5%

export function calcPricing(unitPrice, ticketCount) {
  const subtotal = unitPrice * ticketCount;
  const commission = Math.round(subtotal * COMMISSION_RATE);
  const totalClient = subtotal + SERVICE_FEE;
  const agencyAmount = subtotal - commission;
  const platformRevenue = commission + SERVICE_FEE;
  return { unitPrice, ticketCount, subtotal, commission, serviceFee: SERVICE_FEE, totalClient, agencyAmount, platformRevenue };
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}
