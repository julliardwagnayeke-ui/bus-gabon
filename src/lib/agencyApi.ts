'use client';

import { createClient } from '@/utils/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getHeaders() {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  const token = session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getAllAgencies() {
  const res = await fetch(`${API_URL}/agencies`);
  if (!res.ok) throw new Error('Failed to fetch agencies');
  return res.json();
}

export async function getAgencyById(id: string) {
  const res = await fetch(`${API_URL}/agencies/${id}`);
  if (!res.ok) throw new Error('Failed to fetch agency');
  return res.json();
}

export async function getAgencyStats(id: string) {
  const res = await fetch(`${API_URL}/agencies/${id}/stats`);
  if (!res.ok) throw new Error('Failed to fetch agency stats');
  return res.json();
}

export async function createAgency(data: {
  name: string;
  logoUrl?: string;
  contactInfo?: string;
}) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/agencies`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create agency');
  }

  return res.json();
}

export async function updateAgency(
  id: string,
  data: {
    name?: string;
    logoUrl?: string;
    contactInfo?: string;
  }
) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/agencies/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to update agency');
  }

  return res.json();
}

export async function deleteAgency(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/agencies/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to delete agency');
  }

  return res.json();
}
