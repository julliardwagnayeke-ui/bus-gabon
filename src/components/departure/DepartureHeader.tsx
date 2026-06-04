'use client';

import { useSearchParams } from 'next/navigation';
import { MapPin, Clock, ShieldCheck, Luggage, Phone, Building } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { formatCurrency } from '@/lib/api';
import { useDeparture } from '@/hooks/useSearchDepartures';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface DepartureHeaderProps {
  departureId: string;
}

export default function DepartureHeader({ departureId }: DepartureHeaderProps) {
  const searchParams = useSearchParams();
  const passengers = parseInt(searchParams.get('passengers') || '1');
  const { data: departure, isLoading } = useDeparture(departureId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!departure) {
    return (
      <div className="text-center py-8">
        <p className="text-text-light">Départ non trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="text-primary font-bold">
              {departure.agency.name.split(' ').map(word => word[0]).join('')}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-dark">{departure.agency.name}</h1>
              {departure.agency.isVerified && (
                <Badge variant="success">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Agence vérifiée
                </Badge>
              )}
            </div>
            <p className="text-text-light">
              {departure.originCity} → {departure.destinationCity}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{formatCurrency(departure.price * passengers)}</div>
          <div className="text-sm text-text-light">
            {passengers} voyageur{passengers > 1 ? 's' : ''} × {formatCurrency(departure.price)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-dark">{departure.time}</div>
            <div className="text-sm text-text-light">Départ prévu</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-dark">{departure.duration}</div>
            <div className="text-sm text-text-light">Durée du trajet</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Luggage className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-dark">{departure.baggageIncluded} bagage{departure.baggageIncluded > 1 ? 's' : ''}</div>
            <div className="text-sm text-text-light">Inclus dans le prix</div>
          </div>
        </div>
      </div>
    </div>
  );
}