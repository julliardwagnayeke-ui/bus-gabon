import { ShieldCheck, Phone, MapPin, Clock } from 'lucide-react';
import Badge from '@/components/common/Badge';
import { Agency } from '@/types/user';

interface AgencyTrustCardProps {
  agency: Agency;
}

export default function AgencyTrustCard({ agency }: AgencyTrustCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary font-bold">
            {agency.name.split(' ').map(word => word[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-dark">{agency.name}</h3>
          <Badge variant="success" size="sm">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Agence vérifiée
          </Badge>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-text-light">
          <Phone className="w-4 h-4" />
          <span>{agency.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-text-light">
          <MapPin className="w-4 h-4" />
          <span>{agency.address}</span>
        </div>
        <div className="flex items-center gap-2 text-text-light">
          <Clock className="w-4 h-4" />
          <span>Ouvert 24h/24</span>
        </div>
      </div>
    </div>
  );
}