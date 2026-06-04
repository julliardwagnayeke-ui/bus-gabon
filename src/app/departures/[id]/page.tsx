'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useParams } from 'next/navigation';
import DepartureHeader from '@/components/departure/DepartureHeader';
import AgencyTrustCard from '@/components/departure/AgencyTrustCard';
import BaggagePolicyCard from '@/components/departure/BaggagePolicyCard';
import PriceSummaryCard from '@/components/departure/PriceSummaryCard';
import BookingCTA from '@/components/departure/BookingCTA';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDeparture } from '@/hooks/useSearchDepartures';

export default function DeparturePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const { data: departure, isLoading } = useDeparture(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!departure) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Départ non trouvé</h1>
          <p className="text-text-light">Ce départ n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <DepartureHeader departureId={params.id} />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            <AgencyTrustCard agency={departure.agency} />
            <BaggagePolicyCard
              baggageIncluded={departure.baggageIncluded}
              maxWeight={20}
            />
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <PriceSummaryCard
              basePrice={departure.price}
              passengerCount={passengers}
            />
            <BookingCTA
              departureId={params.id}
              passengerCount={passengers}
            />
          </div>
        </div>

        {/* Important information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-dark mb-4">Informations importantes</h3>
          <ul className="space-y-2 text-sm text-text">
            <li>• La place assise est attribuée sur place par l'agence</li>
            <li>• Présentez-vous 30 minutes avant le départ</li>
            <li>• Une pièce d'identité peut être demandée</li>
            <li>• Les conditions météorologiques peuvent affecter les horaires</li>
          </ul>
        </div>
      </div>
    </div>
  );
}