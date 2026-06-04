import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getHeaders() {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  const token = session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Client HTTP minimal façon axios ({ data }), avec token Supabase.
// TRANSITION : pointe encore vers l'API REST (NEXT_PUBLIC_API_URL). Il sera
// rebranché sur les Server Actions / routes Next à l'étape data-layer.
// ──────────────────────────────────────────────────────────────────────────
type Json = Record<string, unknown> | unknown[] | null;

async function request<T = unknown>(
  method: string,
  path: string,
  body?: Json,
): Promise<{ data: T }> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: await getHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const err = await res.json();
      message = err.error || message;
    } catch {
      /* corps non-JSON */
    }
    throw new Error(message);
  }
  const data = res.status === 204 ? null : await res.json();
  return { data: data as T };
}

export const api = {
  get: <T = unknown>(path: string) => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: Json) => request<T>('POST', path, body),
  put: <T = unknown>(path: string, body?: Json) => request<T>('PUT', path, body),
  patch: <T = unknown>(path: string, body?: Json) => request<T>('PATCH', path, body),
  delete: <T = unknown>(path: string) => request<T>('DELETE', path),
};

// ──────────────────────────────── Formateurs ───────────────────────────────

/** Montant en francs CFA (XAF), sans décimales. Ex : 15000 → "15 000 FCFA". */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Date au format français court. Ex : "2026-06-05" → "05 juin 2026". */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return String(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Heure "HH:mm". Accepte une chaîne déjà au format, ou une Date. */
export function formatTime(time: string | Date): string {
  if (typeof time === 'string') {
    if (/^\d{1,2}:\d{2}/.test(time)) return time;
    const d = new Date(time);
    if (Number.isNaN(d.getTime())) return time;
    time = d;
  }
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(time);
}

// ─────────────────────── Helpers fetch existants (legacy) ───────────────────

export async function fetchDepartures(from: string, to: string, date: string) {
  const params = new URLSearchParams({ from, to, date });
  const res = await fetch(`${API_URL}/departures/search?${params}`);
  if (!res.ok) throw new Error('Failed to fetch departures');
  return res.json();
}

export async function fetchDeparture(id: string) {
  const res = await fetch(`${API_URL}/departures/${id}`);
  if (!res.ok) throw new Error('Failed to fetch departure');
  return res.json();
}

export async function createTicket(data: { departureId: string; seatNumber: number; price: number }) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create ticket');
  }
  return res.json();
}

export async function fetchMyTickets() {
  const res = await fetch(`${API_URL}/my-tickets`, {
    headers: await getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch tickets');
  return res.json();
}
