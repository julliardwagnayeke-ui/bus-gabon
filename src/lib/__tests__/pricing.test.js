import { describe, it, expect } from 'vitest';
import { calcPricing, formatPrice, formatDuration, SERVICE_FEE, COMMISSION_RATE } from '../pricing';

describe('calcPricing', () => {
  it('calcule correctement pour 1 billet à 10 000 FCFA', () => {
    const r = calcPricing(10_000, 1);
    expect(r.unitPrice).toBe(10_000);
    expect(r.ticketCount).toBe(1);
    expect(r.subtotal).toBe(10_000);
    expect(r.commission).toBe(500);           // 5%
    expect(r.serviceFee).toBe(200);           // frais fixe
    expect(r.totalClient).toBe(10_200);       // subtotal + frais
    expect(r.agencyAmount).toBe(9_500);       // subtotal - commission
    expect(r.platformRevenue).toBe(700);      // commission + frais
  });

  it('calcule correctement pour 4 billets à 8 000 FCFA', () => {
    const r = calcPricing(8_000, 4);
    expect(r.subtotal).toBe(32_000);
    expect(r.commission).toBe(1_600);         // 5% de 32 000
    expect(r.totalClient).toBe(32_200);       // 32 000 + 200
    expect(r.agencyAmount).toBe(30_400);      // 32 000 - 1 600
    expect(r.platformRevenue).toBe(1_800);    // 1 600 + 200
  });

  it('arrondit la commission à l\'entier le plus proche', () => {
    // 5% de 10 001 = 500.05 → arrondi à 500
    const r = calcPricing(10_001, 1);
    expect(r.commission).toBe(500);
  });

  it('fonctionne avec un prix de 0 FCFA', () => {
    const r = calcPricing(0, 1);
    expect(r.subtotal).toBe(0);
    expect(r.commission).toBe(0);
    expect(r.totalClient).toBe(SERVICE_FEE);
    expect(r.agencyAmount).toBe(0);
    expect(r.platformRevenue).toBe(SERVICE_FEE);
  });

  it('frais de service est toujours 200 FCFA', () => {
    [1, 2, 3, 4].forEach(n => {
      expect(calcPricing(5_000, n).serviceFee).toBe(200);
    });
  });

  it('conservation du total : totalClient = agencyAmount + platformRevenue', () => {
    const r = calcPricing(7_500, 3);
    expect(r.agencyAmount + r.platformRevenue).toBe(r.totalClient);
  });

  it('taux de commission est bien 5%', () => {
    expect(COMMISSION_RATE).toBe(0.05);
  });
});

describe('formatPrice', () => {
  it('formate avec séparateur de milliers et suffixe FCFA', () => {
    expect(formatPrice(10_200)).toMatch(/10.200.*FCFA/);
  });

  it('formate 0 FCFA', () => {
    expect(formatPrice(0)).toMatch(/0.*FCFA/);
  });
});

describe('formatDuration', () => {
  it('affiche uniquement les heures quand minutes = 0', () => {
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(60)).toBe('1h');
  });

  it('affiche heures et minutes', () => {
    expect(formatDuration(90)).toBe('1h30');
    expect(formatDuration(65)).toBe('1h05');
  });

  it('formate les minutes avec zéro devant si < 10', () => {
    expect(formatDuration(61)).toBe('1h01');
  });
});
