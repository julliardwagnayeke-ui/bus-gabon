import { MapPin, Clock, Users, Calculator } from 'lucide-react';
import { PriceBreakdown } from '@/lib/formatCurrency';
import { Departure } from '@/types/user';

interface BookingSummaryProps {
  departure: Departure;
  passengerCount: number;
  passengerData: any;
}

export default function BookingSummary({ departure, passengerCount, passengerData }: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <h3 className="text-xl font-bold text-dark mb-6">Récapitulatif de réservation</h3>

      <div className="space-y-4">
        {/* Trajet */}
        <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-xl">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-dark">
              {departure.originCity} → {departure.destinationCity}
            </div>
            <div className="text-sm text-text-light">{departure.agency.name}</div>
          </div>
        </div>

        {/* Date et heure */}
        <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-xl">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-dark">
              {new Date(departure.date).toLocaleDateString('fr-FR')} à {departure.time}
            </div>
            <div className="text-sm text-text-light">Durée : {departure.duration}</div>
          </div>
        </div>

        {/* Passagers */}
        <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-xl">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-dark">{passengerCount} voyageur{passengerCount > 1 ? 's' : ''}</div>
            <div className="text-sm text-text-light">Contact : {passengerData.contactName}</div>
          </div>
        </div>

        {/* Prix */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <PriceBreakdown
            basePrice={departure.price}
            passengerCount={passengerCount}
          />
        </div>
      </div>
    </div>
  );
}