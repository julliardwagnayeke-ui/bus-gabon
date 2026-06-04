import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

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
