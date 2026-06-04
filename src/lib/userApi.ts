'use client';

import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getCurrentUser() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/me`, { headers });
  if (!res.ok) throw new Error('Failed to fetch current user');
  return res.json();
}

export async function getUserById(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function getUserByEmail(email: string) {
  const res = await fetch(`${API_URL}/users/email?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function getAllUsers(skip: number = 0, take: number = 10) {
  const res = await fetch(`${API_URL}/users?skip=${skip}&take=${take}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(data: {
  email: string;
  name?: string;
  role?: string;
  agencyId?: string;
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create user');
  }

  return res.json();
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
    agencyId?: string;
  }
) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to update user');
  }

  return res.json();
}

export async function deleteUser(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to delete user');
  }

  return res.json();
}

export async function getUsersByRole(role: string) {
  const res = await fetch(`${API_URL}/users/role/${role}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUsersByAgency(agencyId: string) {
  const res = await fetch(`${API_URL}/agency/${agencyId}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}
