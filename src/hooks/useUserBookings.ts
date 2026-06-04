import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUserBookings() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: () => api.get('/api/me/bookings').then(res => res.data),
  });
}

export function useUserTickets() {
  return useQuery({
    queryKey: ['user-tickets'],
    queryFn: () => api.get('/api/me/tickets').then(res => res.data),
  });
}