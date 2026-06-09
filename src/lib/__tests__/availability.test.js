import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock du client Supabase avant import du module ──────────────────────────
const mockSingle = vi.fn();
vi.mock('../../supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ single: (...args) => mockSingle(...args) }),
      }),
    }),
  },
}));

// Import après les mocks
import { getAvailableSeats } from '../availability';

beforeEach(() => {
  mockSingle.mockReset();
});

describe('getAvailableSeats', () => {
  it('retourne open_seats quand rien de vendu', async () => {
    mockSingle.mockResolvedValueOnce({ data: { open_seats: 28, sold_seats: 0 }, error: null });
    expect(await getAvailableSeats('dep-1')).toBe(28);
  });

  it('soustrait les places vendues', async () => {
    mockSingle.mockResolvedValueOnce({ data: { open_seats: 28, sold_seats: 5 }, error: null });
    expect(await getAvailableSeats('dep-1')).toBe(23);
  });

  it('ne descend jamais en dessous de 0 (bus complet)', async () => {
    mockSingle.mockResolvedValueOnce({ data: { open_seats: 28, sold_seats: 35 }, error: null });
    expect(await getAvailableSeats('dep-1')).toBe(0);
  });

  it('traite sold_seats absent comme 0', async () => {
    mockSingle.mockResolvedValueOnce({ data: { open_seats: 10 }, error: null });
    expect(await getAvailableSeats('dep-1')).toBe(10);
  });

  it('retourne le fallback en cas d’erreur', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'boom' } });
    expect(await getAvailableSeats('dep-1', 12)).toBe(12);
  });
});
