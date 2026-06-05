import { describe, it, expect } from 'vitest';
import { generatePublicCode, buildQrPayload, parseQrPayload } from '../ticketCode';

const CODE_REGEX = /^BG-\d{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
// Caractères ambigus exclus : I, O, 0, 1
const AMBIGUOUS = /[IO01]/;

describe('generatePublicCode', () => {
  it('respecte le format BG-YYYY-XXXX-XXXX', () => {
    for (let i = 0; i < 50; i++) {
      expect(generatePublicCode()).toMatch(CODE_REGEX);
    }
  });

  it('contient l\'année courante', () => {
    const year = String(new Date().getFullYear());
    expect(generatePublicCode()).toContain(`BG-${year}-`);
  });

  it('n\'utilise pas les caractères ambigus (I, O, 0, 1)', () => {
    for (let i = 0; i < 100; i++) {
      const code = generatePublicCode();
      // On extrait uniquement les segments aléatoires (après BG-YYYY-)
      const segments = code.split('-').slice(2).join('');
      expect(AMBIGUOUS.test(segments)).toBe(false);
    }
  });

  it('génère des codes uniques', () => {
    const codes = new Set(Array.from({ length: 200 }, generatePublicCode));
    expect(codes.size).toBe(200);
  });
});

describe('buildQrPayload', () => {
  it('retourne un JSON valide', () => {
    const payload = buildQrPayload('ticket-abc', 'BG-2025-XYZW-4532');
    expect(() => JSON.parse(payload)).not.toThrow();
  });

  it('contient tid, code et ts', () => {
    const payload = JSON.parse(buildQrPayload('ticket-abc', 'BG-2025-XYZW-4532'));
    expect(payload.tid).toBe('ticket-abc');
    expect(payload.code).toBe('BG-2025-XYZW-4532');
    expect(typeof payload.ts).toBe('number');
  });

  it('ts est un timestamp proche du moment présent', () => {
    const before = Date.now();
    const payload = JSON.parse(buildQrPayload('t1', 'c1'));
    const after = Date.now();
    expect(payload.ts).toBeGreaterThanOrEqual(before);
    expect(payload.ts).toBeLessThanOrEqual(after);
  });
});

describe('parseQrPayload', () => {
  it('parse correctement un payload JSON valide', () => {
    const raw = JSON.stringify({ tid: 'abc', code: 'BG-2025-XYZW-4532', ts: 12345 });
    const result = parseQrPayload(raw);
    expect(result.tid).toBe('abc');
    expect(result.code).toBe('BG-2025-XYZW-4532');
    expect(result.ts).toBe(12345);
  });

  it('retourne { code: payload } si le payload n\'est pas du JSON', () => {
    const result = parseQrPayload('BG-2025-XYZW-4532');
    expect(result).toEqual({ code: 'BG-2025-XYZW-4532' });
  });

  it('est l\'inverse de buildQrPayload', () => {
    const code = 'BG-2025-ABCD-EFGH';
    const ticketId = 'ticket-xyz';
    const parsed = parseQrPayload(buildQrPayload(ticketId, code));
    expect(parsed.tid).toBe(ticketId);
    expect(parsed.code).toBe(code);
  });
});
