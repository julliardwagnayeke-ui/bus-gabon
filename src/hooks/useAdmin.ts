'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardSummary,
  getDashboardData,
  getDashboardAlerts,
  getRecentActivity,
  getAllAgenciesAdmin,
  getAgencyAdmin,
  getPendingAgencies,
  approveAgency,
  rejectAgency,
  suspendAgency,
  reactivateAgency,
  updateAgencyAdmin,
  getAllUsersAdmin,
  getUserAdmin,
  updateUserStatus,
  updateUserRole,
  getCommissionsSummary,
  getCommissionsByAgency,
  getCommissionsByPeriod,
  getPayouts,
  getPayout,
  generatePayouts,
  approvePayout,
  markPayoutAsPaid,
  getSupportTickets,
  getSupportTicket,
  replySupportTicket,
  updateSupportTicketStatus,
  getActivityLogs,
  getLoginHistory,
  getSettings,
  updateFeeSettings,
} from '@/lib/adminApi';

// ====== DASHBOARD ======
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['adminDashboardSummary'],
    queryFn: getDashboardSummary,
  });
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['adminDashboardData'],
    queryFn: getDashboardData,
  });
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['adminDashboardAlerts'],
    queryFn: getDashboardAlerts,
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['adminRecentActivity'],
    queryFn: getRecentActivity,
  });
}

// ====== AGENCES ======
export function useAllAgenciesAdmin() {
  return useQuery({
    queryKey: ['adminAgencies'],
    queryFn: getAllAgenciesAdmin,
  });
}

export function useAgencyAdmin(id: string) {
  return useQuery({
    queryKey: ['adminAgency', id],
    queryFn: () => getAgencyAdmin(id),
    enabled: !!id,
  });
}

export function usePendingAgencies() {
  return useQuery({
    queryKey: ['pendingAgencies'],
    queryFn: getPendingAgencies,
  });
}

export function useApproveAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveAgency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgencies'] });
      queryClient.invalidateQueries({ queryKey: ['pendingAgencies'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
  });
}

export function useRejectAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectAgency(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgencies'] });
      queryClient.invalidateQueries({ queryKey: ['pendingAgencies'] });
    },
  });
}

export function useSuspendAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      suspendAgency(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgencies'] });
    },
  });
}

export function useReactivateAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reactivateAgency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgencies'] });
    },
  });
}

export function useUpdateAgencyAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        logoUrl?: string;
        contactInfo?: string;
      };
    }) => updateAgencyAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAgencies'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
  });
}

// ====== UTILISATEURS ======
export function useAllUsersAdmin() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAllUsersAdmin,
  });
}

export function useUserAdmin(id: string) {
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: () => getUserAdmin(id),
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'active' | 'suspended' | 'blocked';
    }) => updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

// ====== COMMISSIONS ======
export function useCommissionsSummary() {
  return useQuery({
    queryKey: ['adminCommissionsSummary'],
    queryFn: getCommissionsSummary,
  });
}

export function useCommissionsByAgency() {
  return useQuery({
    queryKey: ['adminCommissionsByAgency'],
    queryFn: getCommissionsByAgency,
  });
}

export function useCommissionsByPeriod() {
  return useQuery({
    queryKey: ['adminCommissionsByPeriod'],
    queryFn: getCommissionsByPeriod,
  });
}

// ====== REVERSEMENTS ======
export function usePayouts() {
  return useQuery({
    queryKey: ['adminPayouts'],
    queryFn: getPayouts,
  });
}

export function usePayout(id: string) {
  return useQuery({
    queryKey: ['adminPayout', id],
    queryFn: () => getPayout(id),
    enabled: !!id,
  });
}

export function useGeneratePayouts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generatePayouts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}

export function useApprovePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approvePayout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}

export function useMarkPayoutAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, proof }: { id: string; proof?: string }) =>
      markPayoutAsPaid(id, proof),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPayouts'] });
    },
  });
}

// ====== SUPPORT ======
export function useSupportTickets() {
  return useQuery({
    queryKey: ['adminSupportTickets'],
    queryFn: getSupportTickets,
  });
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: ['adminSupportTicket', id],
    queryFn: () => getSupportTicket(id),
    enabled: !!id,
  });
}

export function useReplySupportTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      replySupportTicket(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSupportTickets'] });
    },
  });
}

export function useUpdateSupportTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'open' | 'in_progress' | 'waiting_customer' | 'waiting_agency' | 'resolved' | 'closed';
    }) => updateSupportTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSupportTickets'] });
    },
  });
}

// ====== LOGS ======
export function useActivityLogs() {
  return useQuery({
    queryKey: ['adminActivityLogs'],
    queryFn: getActivityLogs,
  });
}

export function useLoginHistory() {
  return useQuery({
    queryKey: ['adminLoginHistory'],
    queryFn: getLoginHistory,
  });
}

// ====== PARAMETRES ======
export function useSettings() {
  return useQuery({
    queryKey: ['adminSettings'],
    queryFn: getSettings,
  });
}

export function useUpdateFeeSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commissionPercentage,
      userFee,
      currency,
    }: {
      commissionPercentage: number;
      userFee: number;
      currency: string;
    }) => updateFeeSettings(commissionPercentage, userFee, currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
  });
}
