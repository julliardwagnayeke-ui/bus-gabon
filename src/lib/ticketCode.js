const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans I/O/0/1 pour éviter confusion

function randomSegment(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return s;
}

// Ex: BG-2025-XYZW-4532
export function generatePublicCode() {
  const year = new Date().getFullYear();
  return `BG-${year}-${randomSegment(4)}-${randomSegment(4)}`;
}

// Payload QR : JSON stringifié contenant ticketId + publicCode + timestamp
export function buildQrPayload(ticketId, publicCode) {
  return JSON.stringify({ tid: ticketId, code: publicCode, ts: Date.now() });
}

export function parseQrPayload(payload) {
  try {
    return JSON.parse(payload);
  } catch {
    // Peut être un code brut saisi manuellement
    return { code: payload };
  }
}
