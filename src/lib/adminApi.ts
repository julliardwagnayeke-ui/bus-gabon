'use client';

import { createClient } from '@/utils/supabase/client';
import {
  AdminDashboardData,
  AdminStats,
  AdminActivityLog,
  AdminCommissionData,
  AdminPayoutData,
  SupportTicketAdmin,
} from '@/types/admin';

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

// ====== DASHBOARD ======
export async function getDashboardSummary(): Promise<AdminStats> {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/dashboard/summary`, { headers });
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function getDashboardData(): Promise<AdminDashboardData> {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/dashboard/data`, { headers });
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function getDashboardAlerts() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/dashboard/alerts`, { headers });
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function getRecentActivity() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/dashboard/recent-activity`, { headers });
  if (!res.ok) throw new Error('Failed to fetch recent activity');
  return res.json();
}

// ====== AGENCES ======
export async function getAllAgenciesAdmin() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies`, { headers });
  if (!res.ok) throw new Error('Failed to fetch agencies');
  return res.json();
}

export async function getAgencyAdmin(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch agency');
  return res.json();
}

export async function getPendingAgencies() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies?status=pending_review`, { headers });
  if (!res.ok) throw new Error('Failed to fetch pending agencies');
  return res.json();
}

export async function approveAgency(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies/${id}/approve`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to approve agency');
  return res.json();
}

export async function rejectAgency(id: string, reason: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies/${id}/reject`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to reject agency');
  return res.json();
}

export async function suspendAgency(id: string, reason: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies/${id}/suspend`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to suspend agency');
  return res.json();
}

export async function reactivateAgency(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies/${id}/reactivate`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to reactivate agency');
  return res.json();
}

export async function updateAgencyAdmin(
  id: string,
  data: {
    name?: string;
    logoUrl?: string;
    contactInfo?: string;
  }
) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/agencies/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update agency');
  return res.json();
}

// ====== UTILISATEURS ======
export async function getAllUsersAdmin() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/users`, { headers });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUserAdmin(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/users/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUserStatus(id: string, status: 'active' | 'suspended' | 'blocked') {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/users/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update user status');
  return res.json();
}

export async function updateUserRole(id: string, role: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return res.json();
}

// ====== COMMISSIONS ======
export async function getCommissionsSummary(): Promise<AdminCommissionData> {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/commissions/summary`, { headers });
  if (!res.ok) throw new Error('Failed to fetch commissions');
  return res.json();
}

export async function getCommissionsByAgency() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/commissions/by-agency`, { headers });
  if (!res.ok) throw new Error('Failed to fetch commissions by agency');
  return res.json();
}

export async function getCommissionsByPeriod() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/commissions/by-period`, { headers });
  if (!res.ok) throw new Error('Failed to fetch commissions by period');
  return res.json();
}

// ====== REVERSEMENTS ======
export async function getPayouts() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/payouts`, { headers });
  if (!res.ok) throw new Error('Failed to fetch payouts');
  return res.json();
}

export async function getPayout(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/payouts/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch payout');
  return res.json();
}

export async function generatePayouts() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/payouts/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to generate payouts');
  return res.json();
}

export async function approvePayout(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/payouts/${id}/approve`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to approve payout');
  return res.json();
}

export async function markPayoutAsPaid(id: string, proof?: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/payouts/${id}/mark-paid`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ proof }),
  });
  if (!res.ok) throw new Error('Failed to mark payout as paid');
  return res.json();
}

// ====== SUPPORT ======
export async function getSupportTickets() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/support/tickets`, { headers });
  if (!res.ok) throw new Error('Failed to fetch support tickets');
  return res.json();
}

export async function getSupportTicket(id: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/support/tickets/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch support ticket');
  return res.json();
}

export async function replySupportTicket(id: string, message: string) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/support/tickets/${id}/reply`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to reply to support ticket');
  return res.json();
}

export async function updateSupportTicketStatus(
  id: string,
  status: 'open' | 'in_progress' | 'waiting_customer' | 'waiting_agency' | 'resolved' | 'closed'
) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/support/tickets/${id}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update support ticket status');
  return res.json();
}

// ====== LOGS ======
export async function getActivityLogs() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/activity-logs`, { headers });
  if (!res.ok) throw new Error('Failed to fetch activity logs');
  return res.json();
}

export async function getLoginHistory() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/login-history`, { headers });
  if (!res.ok) throw new Error('Failed to fetch login history');
  return res.json();
}

// ====== PARAMETRES ======
export async function getSettings() {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/settings`, { headers });
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateFeeSettings(
  commissionPercentage: number,
  userFee: number,
  currency: string
) {
  const headers = await getHeaders();
  const res = await fetch(`${API_URL}/admin/settings/fees`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      commissionPercentage,
      userFee,
      currency,
    }),
  });
  if (!res.ok) throw new Error('Failed to update fee settings');
  return res.json();
}
