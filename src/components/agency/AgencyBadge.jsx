import { ShieldCheck } from 'lucide-react';

export default function AgencyBadge({ verified = false, className = '' }) {
  if (!verified) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold badge-verified ${className}`}>
      <ShieldCheck className="w-3 h-3" /> Agence vérifiée
    </span>
  );
}
