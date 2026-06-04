import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function usePayment() {
  return useMutation({
    mutationFn: (data: any) => api.post('/api/payments/initiate', data).then(res => res.data),
  });
}

export function usePaymentStatus(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => api.get(`/api/payments/${id}/status`).then(res => res.data),
    enabled: !!id,
    refetchInterval: 2000, // Poll every 2 seconds
  });
}