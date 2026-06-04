'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllAgencies,
  getAgencyById,
  getAgencyStats,
  createAgency,
  updateAgency,
  deleteAgency,
} from '@/lib/agencyApi';

export function useAgencies() {
  return useQuery({
    queryKey: ['agencies'],
    queryFn: getAllAgencies,
  });
}

export function useAgency(agencyId: string) {
  return useQuery({
    queryKey: ['agency', agencyId],
    queryFn: () => getAgencyById(agencyId),
    enabled: !!agencyId,
  });
}

export function useAgencyStats(agencyId: string) {
  return useQuery({
    queryKey: ['agencyStats', agencyId],
    queryFn: () => getAgencyStats(agencyId),
    enabled: !!agencyId,
  });
}

export function useCreateAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      logoUrl?: string;
      contactInfo?: string;
    }) => createAgency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
    },
  });
}

export function useUpdateAgency() {
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
    }) => updateAgency(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
      queryClient.invalidateQueries({ queryKey: ['agency', data.id] });
      queryClient.invalidateQueries({ queryKey: ['agencyStats', data.id] });
    },
  });
}

export function useDeleteAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agencyId: string) => deleteAgency(agencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencies'] });
    },
  });
}


  // Routes
  getRoutes: async (agencyId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/routes`);
    if (!res.ok) throw new Error('Failed to fetch routes');
    return res.json();
  },
  getRoute: async (agencyId: string, routeId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/routes/${routeId}`);
    if (!res.ok) throw new Error('Failed to fetch route');
    return res.json();
  },
  createRoute: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create route');
    return res.json();
  },
  updateRoute: async (agencyId: string, routeId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/routes/${routeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update route');
    return res.json();
  },

  // Departures
  getDepartures: async (agencyId: string, filters?: any) => {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures?${params}`);
    if (!res.ok) throw new Error('Failed to fetch departures');
    return res.json();
  },
  getDeparture: async (agencyId: string, departureId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures/${departureId}`);
    if (!res.ok) throw new Error('Failed to fetch departure');
    return res.json();
  },
  createDeparture: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create departure');
    return res.json();
  },
  updateDeparture: async (agencyId: string, departureId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures/${departureId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update departure');
    return res.json();
  },
  cancelDeparture: async (agencyId: string, departureId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures/${departureId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to cancel departure');
    return res.json();
  },
  delayDeparture: async (agencyId: string, departureId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures/${departureId}/delay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to delay departure');
    return res.json();
  },
  getDeparturePassengers: async (agencyId: string, departureId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/departures/${departureId}/passengers`);
    if (!res.ok) throw new Error('Failed to fetch passengers');
    return res.json();
  },

  // Bookings
  getBookings: async (agencyId: string, filters?: any) => {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${API_URL}/agency/${agencyId}/bookings?${params}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },
  getBooking: async (agencyId: string, bookingId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/bookings/${bookingId}`);
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  },
  cancelBooking: async (agencyId: string, bookingId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to cancel booking');
    return res.json();
  },
  resendTicket: async (agencyId: string, bookingId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/bookings/${bookingId}/resend-ticket`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to resend ticket');
    return res.json();
  },

  // Tickets
  getTickets: async (agencyId: string, filters?: any) => {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${API_URL}/agency/${agencyId}/tickets?${params}`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    return res.json();
  },
  getTicket: async (agencyId: string, ticketId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/tickets/${ticketId}`);
    if (!res.ok) throw new Error('Failed to fetch ticket');
    return res.json();
  },
  verifyTicket: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/tickets/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to verify ticket');
    return res.json();
  },
  checkInTicket: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/tickets/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to check in ticket');
    return res.json();
  },

  // Sales
  getSalesSummary: async (agencyId: string, period?: string) => {
    const params = period ? `?period=${period}` : '';
    const res = await fetch(`${API_URL}/agency/${agencyId}/sales/summary${params}`);
    if (!res.ok) throw new Error('Failed to fetch sales summary');
    return res.json();
  },
  getSalesByDeparture: async (agencyId: string, filters?: any) => {
    const params = new URLSearchParams(filters || {});
    const res = await fetch(`${API_URL}/agency/${agencyId}/sales/by-departure?${params}`);
    if (!res.ok) throw new Error('Failed to fetch sales by departure');
    return res.json();
  },
  exportSalesReport: async (agencyId: string, format: 'pdf' | 'excel' | 'csv') => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/sales/export?format=${format}`);
    if (!res.ok) throw new Error('Failed to export sales report');
    return res.blob();
  },

  // Payouts
  getPayouts: async (agencyId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/payouts`);
    if (!res.ok) throw new Error('Failed to fetch payouts');
    return res.json();
  },
  getPayout: async (agencyId: string, payoutId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/payouts/${payoutId}`);
    if (!res.ok) throw new Error('Failed to fetch payout');
    return res.json();
  },
  updatePayoutSettings: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/payout-settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update payout settings');
    return res.json();
  },

  // Profile
  getProfile: async (agencyId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/profile`);
    if (!res.ok) throw new Error('Failed to fetch agency profile');
    return res.json();
  },
  updateProfile: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },
  uploadLogo: async (agencyId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/agency/${agencyId}/profile/logo`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload logo');
    return res.json();
  },

  // Users
  getAgencyUsers: async (agencyId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/users`);
    if (!res.ok) throw new Error('Failed to fetch agency users');
    return res.json();
  },
  inviteUser: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/users/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to invite user');
    return res.json();
  },
  updateUserRole: async (agencyId: string, userId: string, role: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error('Failed to update user role');
    return res.json();
  },

  // Support
  getSupportTickets: async (agencyId: string) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/support/tickets`);
    if (!res.ok) throw new Error('Failed to fetch support tickets');
    return res.json();
  },
  createSupportTicket: async (agencyId: string, data: any) => {
    const res = await fetch(`${API_URL}/agency/${agencyId}/support/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create support ticket');
    return res.json();
  },
};

// Hooks
export function useDashboardStats(agencyId: string) {
  return useQuery({
    queryKey: ['dashboard-stats', agencyId],
    queryFn: () => agencyAPI.getDashboardStats(agencyId),
    enabled: !!agencyId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAgencyBuses(agencyId: string) {
  return useQuery({
    queryKey: ['buses', agencyId],
    queryFn: () => agencyAPI.getBuses(agencyId),
    enabled: !!agencyId,
  });
}

export function useCreateBus(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.createBus(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buses', agencyId] });
    },
  });
}

export function useUpdateBus(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ busId, data }: { busId: string; data: any }) =>
      agencyAPI.updateBus(agencyId, busId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buses', agencyId] });
    },
  });
}

export function useDeleteBus(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (busId: string) => agencyAPI.deleteBus(agencyId, busId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buses', agencyId] });
    },
  });
}

export function useAgencyRoutes(agencyId: string) {
  return useQuery({
    queryKey: ['routes', agencyId],
    queryFn: () => agencyAPI.getRoutes(agencyId),
    enabled: !!agencyId,
  });
}

export function useCreateRoute(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.createRoute(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes', agencyId] });
    },
  });
}

export function useUpdateRoute(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, data }: { routeId: string; data: any }) =>
      agencyAPI.updateRoute(agencyId, routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes', agencyId] });
    },
  });
}

export function useAgencyDepartures(agencyId: string, filters?: any) {
  return useQuery({
    queryKey: ['departures', agencyId, filters],
    queryFn: () => agencyAPI.getDepartures(agencyId, filters),
    enabled: !!agencyId,
  });
}

export function useCreateDeparture(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.createDeparture(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departures', agencyId] });
    },
  });
}

export function useUpdateDeparture(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ departureId, data }: { departureId: string; data: any }) =>
      agencyAPI.updateDeparture(agencyId, departureId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departures', agencyId] });
    },
  });
}

export function useAgencyBookings(agencyId: string, filters?: any) {
  return useQuery({
    queryKey: ['bookings', agencyId, filters],
    queryFn: () => agencyAPI.getBookings(agencyId, filters),
    enabled: !!agencyId,
  });
}

export function useAgencyTickets(agencyId: string, filters?: any) {
  return useQuery({
    queryKey: ['tickets', agencyId, filters],
    queryFn: () => agencyAPI.getTickets(agencyId, filters),
    enabled: !!agencyId,
  });
}

export function useCheckInTicket(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.checkInTicket(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', agencyId] });
    },
  });
}

export function useAgencySalesSummary(agencyId: string, period?: string) {
  return useQuery({
    queryKey: ['sales-summary', agencyId, period],
    queryFn: () => agencyAPI.getSalesSummary(agencyId, period),
    enabled: !!agencyId,
  });
}

export function useAgencyPayouts(agencyId: string) {
  return useQuery({
    queryKey: ['payouts', agencyId],
    queryFn: () => agencyAPI.getPayouts(agencyId),
    enabled: !!agencyId,
  });
}

export function useAgencyProfile(agencyId: string) {
  return useQuery({
    queryKey: ['agency-profile', agencyId],
    queryFn: () => agencyAPI.getProfile(agencyId),
    enabled: !!agencyId,
  });
}

export function useUpdateAgencyProfile(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.updateProfile(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-profile', agencyId] });
    },
  });
}

export function useAgencyUsers(agencyId: string) {
  return useQuery({
    queryKey: ['agency-users', agencyId],
    queryFn: () => agencyAPI.getAgencyUsers(agencyId),
    enabled: !!agencyId,
  });
}

export function useInviteAgencyUser(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.inviteUser(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-users', agencyId] });
    },
  });
}

export function useSupportTickets(agencyId: string) {
  return useQuery({
    queryKey: ['support-tickets', agencyId],
    queryFn: () => agencyAPI.getSupportTickets(agencyId),
    enabled: !!agencyId,
  });
}

export function useCreateSupportTicket(agencyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => agencyAPI.createSupportTicket(agencyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets', agencyId] });
    },
  });
}
