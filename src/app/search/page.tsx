'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SearchForm from '@/components/search/SearchForm';
import DepartureCard from '@/components/search/DepartureCard';
import SearchFilters from '@/components/search/SearchFilters';
import EmptyResults from '@/components/search/EmptyResults';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSearchDepartures } from '@/hooks/useSearchDepartures';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const { data: departures, isLoading, error } = useSearchDepartures(from, to, date, passengers);
  const [sortBy, setSortBy] = useState('price-asc');

  const sortedDepartures = departures?.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'time-asc':
        return a.time.localeCompare(b.time);
      case 'time-desc':
        return b.time.localeCompare(a.time);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Header with search */}
      <div className="bg-primary pt-6 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            {from && to ? `${from} → ${to}` : 'Rechercher un trajet'}
            {date && <span className="text-white/60 font-normal text-sm">({new Date(date).toLocaleDateString('fr-FR')})</span>}
          </h1>
          <SearchForm compact />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-20">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-medium text-text-light">
            {isLoading ? 'Recherche en cours...' : `${sortedDepartures?.length || 0} trajet${(sortedDepartures?.length || 0) > 1 ? 's' : ''} trouvé${(sortedDepartures?.length || 0) > 1 ? 's' : ''}`}
          </p>
          {sortedDepartures && sortedDepartures.length > 0 && (
            <SearchFilters onSortChange={setSortBy} />
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm">
            <LoadingSpinner size="lg" />
            <p className="text-text-light mt-4">Recherche de départs disponibles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-red-600">Erreur lors de la recherche. Veuillez réessayer.</p>
          </div>
        ) : !sortedDepartures || sortedDepartures.length === 0 ? (
          <EmptyResults onModifySearch={() => window.location.reload()} />
        ) : (
          <div className="space-y-4">
            {sortedDepartures.map((departure) => (
              <DepartureCard
                key={departure.id}
                departure={departure}
                passengers={passengers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}