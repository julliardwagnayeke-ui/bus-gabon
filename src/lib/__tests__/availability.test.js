import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock Firebase avant tout import du module ───────────────────────────────
vi.mock('../../firebase', () => ({ db: {} }));

const mockGetDocs = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'col-ref'),
  query:      vi.fn(() => 'query-ref'),
  where:      vi.fn(() => 'where-clause'),
  getDocs:    (...args) => mockGetDocs(...args),
  Timestamp:  { now: vi.fn(() => ({ seconds: Math.floor(Date.now() / 1000) })) },
}));

// Import après les mocks
import { getAvailableSeats } from '../availability';

// Utilitaire : construit un faux snapshot Firestore
function fakeSnap(docs) {
  return { docs: docs.map(data => ({ data: () => data })) };
}

beforeEach(() => {
  mockGetDocs.mockReset();
});

describe('getAvailableSeats', () => {
  it('retourne totalSeats quand aucun billet ni réservation', async () => {
    mockGetDocs
      .mockResolvedValueOnce(fakeSnap([]))   // billets payés
      .mockResolvedValueOnce(fakeSnap([]));  // réservations pending

    const seats = await getAvailableSeats('dep-1', 28);
    expect(seats).toBe(28);
  });

  it('soustrait les billets payés', async () => {
    mockGetDocs
      .mockResolvedValueOnce(fakeSnap([{ ticketCount: 3 }, { ticketCount: 2 }])) // 5 billets payés
      .mockResolvedValueOnce(fakeSnap([]));  // pas de pending

    const seats = await getAvailableSeats('dep-1', 28);
    expect(seats).toBe(23);
  });

  it('soustrait les réservations pending non expirées', async () => {
    mockGetDocs
      .mockResolvedValueOnce(fakeSnap([]))                        // pas de billets payés
      .mockResolvedValueOnce(fakeSnap([{ ticketCount: 4 }]));    // 4 en attente

    const seats = await getAvailableSeats('dep-1', 28);
    expect(seats).toBe(24);
  });

  it('soustrait billets payés + réservations pending ensemble', async () => {
    mockGetDocs
      .mockResolvedValueOnce(fakeSnap([{ ticketCount: 10 }]))    // 10 payés
      .mockResolvedValueOnce(fakeSnap([{ ticketCount: 5 }]));    // 5 pending

    const seats = await getAvailableSeats('dep-1', 28);
    expect(seats).toBe(13);
  });

  it('ne descend jamais en dessous de 0 (bus complet)', async () => {
    mockGetDocs
      .mockResolvedValueOnce(fakeSnap([{ ticketCount: 20 }]))
      .mockResolvedValueOnce(fakeSnap([{ ticketCount: 15 }]));  // 35 > 28 places

    const seats = await getAvailableSeats('dep-1', 28);
    expect(seats).toBe(0);
  });

  it('compte ticketCount = 1 par défaut si le champ est absent', async () => {
    mockGetDocs
      .mockResolvedValueOnce(fakeSnap([{}, {}]))  // 2 docs sans ticketCount → compte chacun comme 1
      .mockResolvedValueOnce(fakeSnap([]));

    const seats = await getAvailableSeats('dep-1', 10);
    expect(seats).toBe(8);
  });
});
