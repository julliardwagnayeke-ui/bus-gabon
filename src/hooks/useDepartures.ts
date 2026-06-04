import { useQuery } from '@tanstack/react-query';
import { fetchDepartures } from '@/lib/api';

export function useDepartures(from: string | null, to: string | null, date: string | null) {
  return useQuery({
    queryKey: ['departures', from, to, date],
    queryFn: () => fetchDepartures(from!, to!, date!),
    enabled: !!from && !!to && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
