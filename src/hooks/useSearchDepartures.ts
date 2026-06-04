import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSearchDepartures(originCityId: string, destinationCityId: string, date: string, passengers = 1) {
  return useQuery({
    queryKey: ['departures', originCityId, destinationCityId, date, passengers],
    queryFn: () => api.get('/api/public/departures/search', {
      params: { originCityId, destinationCityId, date, passengers }
    }).then(res => res.data),
    enabled: !!(originCityId && destinationCityId && date),
  });
}

export function useDeparture(id: string) {
  return useQuery({
    queryKey: ['departure', id],
    queryFn: () => api.get(`/api/public/departures/${id}`).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  return useMutation({
    mutationFn: (data: any) => api.post('/api/reservations', data).then(res => res.data),
  });
}

export function usePayment() {
  return useMutation({
    mutationFn: (data: any) => api.post('/api/payments/initiate', data).then(res => res.data),
  });
}

export function useUserBookings() {
  return useQuery({
    queryKey: ['user-bookings'],
    queryFn: () => api.get('/api/me/bookings').then(res => res.data),
  });
}