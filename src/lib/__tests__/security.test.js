import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateEmail, validatePhone, validatePassword, checkRateLimit } from '../security';

describe('sanitizeInput', () => {
  it('supprime les caractères < > { }', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    expect(sanitizeInput('nom{injection}')).toBe('nominjection');
    expect(sanitizeInput('a>b')).toBe('ab');
  });

  it('supprime les espaces en début et fin', () => {
    expect(sanitizeInput('  Jean Mouketou  ')).toBe('Jean Mouketou');
  });

  it('retourne une chaîne vide pour les non-strings', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(42)).toBe('');
    expect(sanitizeInput({})).toBe('');
  });

  it('tronque à 500 caractères', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long)).toHaveLength(500);
  });

  it('laisse intact un input propre', () => {
    expect(sanitizeInput('Jean Mouketou')).toBe('Jean Mouketou');
  });
});

describe('validateEmail', () => {
  it('accepte les emails valides', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user+tag@domain.org')).toBe(true);
    expect(validateEmail('a@b.cd')).toBe(true);
  });

  it('rejette les emails invalides', () => {
    expect(validateEmail('noatsign')).toBe(false);
    expect(validateEmail('@nodomain')).toBe(false);
    expect(validateEmail('no@tld')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('space @domain.com')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepte les numéros gabonais valides', () => {
    // Format local : 0 + 8 chiffres (9 chiffres au total)
    expect(validatePhone('077123456')).toBe(true);
    expect(validatePhone('066123456')).toBe(true);
    expect(validatePhone('074123456')).toBe(true);
    // Avec espaces (nettoyés avant validation)
    expect(validatePhone('077 12 34 56')).toBe(true);
    // Format international : +241 ou 241 + 8 chiffres
    expect(validatePhone('+24177123456')).toBe(true);
    expect(validatePhone('24177123456')).toBe(true);
  });

  it('rejette les numéros invalides', () => {
    expect(validatePhone('12345')).toBe(false);        // trop court
    expect(validatePhone('abcdefghi')).toBe(false);    // lettres
    expect(validatePhone('')).toBe(false);             // vide
    expect(validatePhone(null)).toBe(false);           // non-string
  });
});

describe('validatePassword', () => {
  it('détecte la longueur minimale (8 caractères)', () => {
    expect(validatePassword('abc1234').length).toBe(false);
    expect(validatePassword('abc12345').length).toBe(true);
  });

  it('détecte la présence de majuscule', () => {
    expect(validatePassword('Abcdefgh').hasUpper).toBe(true);
    expect(validatePassword('abcdefgh').hasUpper).toBe(false);
  });

  it('détecte la présence de minuscule', () => {
    expect(validatePassword('abcdefgh').hasLower).toBe(true);
    expect(validatePassword('ABCDEFGH').hasLower).toBe(false);
  });

  it('détecte la présence de chiffre', () => {
    expect(validatePassword('abcdefg1').hasNumber).toBe(true);
    expect(validatePassword('abcdefgh').hasNumber).toBe(false);
  });

  it('isStrong requiert longueur + majuscule + chiffre', () => {
    expect(validatePassword('Abcdefg1').isStrong).toBe(true);
    expect(validatePassword('abcdefg1').isStrong).toBe(false); // pas de majuscule
    expect(validatePassword('Abcdefgh').isStrong).toBe(false); // pas de chiffre
    expect(validatePassword('Ab1').isStrong).toBe(false);      // trop court
  });
});

describe('checkRateLimit', () => {
  it('autorise les tentatives sous la limite', () => {
    const key = `test-${Date.now()}-allow`;
    expect(checkRateLimit(key, 3)).toBe(true);
    expect(checkRateLimit(key, 3)).toBe(true);
    expect(checkRateLimit(key, 3)).toBe(true);
  });

  it('bloque quand la limite est atteinte', () => {
    const key = `test-${Date.now()}-block`;
    checkRateLimit(key, 2);
    checkRateLimit(key, 2);
    expect(checkRateLimit(key, 2)).toBe(false);
  });

  it('utilise 5 tentatives par défaut', () => {
    const key = `test-${Date.now()}-default`;
    for (let i = 0; i < 5; i++) checkRateLimit(key);
    expect(checkRateLimit(key)).toBe(false);
  });
});
