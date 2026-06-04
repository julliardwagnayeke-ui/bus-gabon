'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import TicketCard from '@/components/ticket/TicketCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { api } from '@/lib/api';

export default function TicketPage() {
  const params = useParams<{ ticketCode: string }>();
  const router = useRouter();

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', params.ticketCode],
    queryFn: () => api.get(`/api/tickets/${params.ticketCode}`).then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Billet non trouvé</h1>
          <p className="text-text-light mb-8">
            Ce billet n'existe pas ou le code est incorrect.
          </p>
          <button
            onClick={() => router.push('/verify-ticket')}
            className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Vérifier un billet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-dark mb-2">Votre billet</h1>
          <p className="text-text-light">
            Présentez ce billet à l'agence le jour du départ
          </p>
        </div>

        <TicketCard ticket={ticket} />
      </div>
    </div>
  );
}