import { Phone, MapPin } from 'lucide-react';
import AgencyBadge from './AgencyBadge';

export default function AgencyCard({ agency }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-surface-alt rounded-2xl border border-border">
      {agency.logo ? (
        <img src={agency.logo} alt={agency.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-bold text-lg">{agency.name?.[0]}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-bold text-dark text-sm">{agency.name}</h3>
          <AgencyBadge verified={agency.verified} />
        </div>
        {agency.address && (
          <p className="text-xs text-text-light flex items-center gap-1 mb-0.5">
            <MapPin className="w-3 h-3" /> {agency.address}
          </p>
        )}
        {agency.phone && (
          <a href={`tel:${agency.phone}`} className="text-xs text-primary flex items-center gap-1 hover:underline">
            <Phone className="w-3 h-3" /> {agency.phone}
          </a>
        )}
        {agency.description && (
          <p className="text-xs text-text-muted mt-1 line-clamp-2">{agency.description}</p>
        )}
      </div>
    </div>
  );
}
