import { Link } from 'react-router-dom';
import { Clock, Luggage, Users, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../lib/pricing';
import AgencyBadge from '../agency/AgencyBadge';

export default function DepartureCard({ departure, route, agency, availableSeats }) {
  const isAlmostFull = availableSeats <= 5 && availableSeats > 0;
  const isFull = availableSeats === 0;

  return (
    <div className="bg-white rounded-2xl border border-border p-4 card-hover flex flex-col sm:flex-row gap-4">
      {/* Logo agence */}
      <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-3">
        {agency?.logo ? (
          <img src={agency.logo} alt={agency.name} className="w-12 h-12 rounded-xl object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <span className="text-primary font-bold">{agency?.name?.[0] || '?'}</span>
          </div>
        )}
        <AgencyBadge verified={agency?.verified} />
      </div>

      {/* Infos trajet */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-dark">{agency?.name}</h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-text-light mb-2">
          <span className="font-semibold text-dark text-base">
            {route?.originCity} → {route?.destinationCity}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-text-light">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Départ {departure.departureTime}
            {departure.estimatedArrivalTime && ` — Arrivée ~${departure.estimatedArrivalTime}`}
          </span>
          <span className="flex items-center gap-1">
            <Luggage className="w-3.5 h-3.5" />
            {route?.baggageIncluded > 0 ? `${route.baggageIncluded} bagage${route.baggageIncluded > 1 ? 's' : ''} inclus` : 'Bagage en option'}
          </span>
          <span className={`flex items-center gap-1 font-medium ${isFull ? 'text-danger' : isAlmostFull ? 'text-amber-600' : 'text-success'}`}>
            <Users className="w-3.5 h-3.5" />
            {isFull ? 'Complet' : `${availableSeats} place${availableSeats > 1 ? 's' : ''} restante${availableSeats > 1 ? 's' : ''}`}
          </span>
        </div>
        {agency?.address && (
          <p className="text-xs text-text-muted mt-1">Point de départ : {agency.address}</p>
        )}
      </div>

      {/* Prix + CTA */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="text-xl font-bold text-dark">{formatPrice(route?.basePrice || 0)}</p>
          <p className="text-xs text-text-muted">par voyageur</p>
        </div>
        {isFull ? (
          <span className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 cursor-not-allowed">
            Complet
          </span>
        ) : (
          <Link
            to={`/depart/${departure.id}`}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition"
          >
            Réserver
          </Link>
        )}
      </div>
    </div>
  );
}
