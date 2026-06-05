export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>{}]/g, '').trim().slice(0, 500);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Numéro mobile gabonais : 9 chiffres après préfixe optionnel (+241 ou 0)
// Ex valides : 077123456, 077 12 34 56, +24177123456, 24177123456
export function validatePhone(phone) {
  if (typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s.-]/g, '');
  return /^(?:\+?241|0)?[0-9]{9}$/.test(clean);
}

export function validatePassword(pwd) {
  return {
    length: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    isStrong: pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
  };
}

const attempts = {};
export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  if (!attempts[key]) attempts[key] = [];
  attempts[key] = attempts[key].filter((t) => now - t < windowMs);
  if (attempts[key].length >= maxAttempts) return false;
  attempts[key].push(now);
  return true;
}
