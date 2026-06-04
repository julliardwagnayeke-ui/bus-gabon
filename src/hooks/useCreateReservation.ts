import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCreateReservation() {
  return useMutation({
    mutationFn: (data: any) => api.post('/api/reservations', data).then(res => res.data),
  });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => api.get(`/api/reservations/${id}`).then(res => res.data),
    enabled: !!id,
  });
}