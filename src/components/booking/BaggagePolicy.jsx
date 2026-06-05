import { Luggage, Info, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../lib/pricing';

export default function BaggagePolicy({ route, compact = false }) {
  const included    = Number(route?.baggageIncluded ?? 0);
  const maxKg       = Number(route?.baggageMaxKg ?? 0);
  const extraFee    = Number(route?.baggageExtraFee ?? 0);
  const note        = route?.baggageNote || '';

  if (compact) {
    return (
      <div className="flex items-start gap-2 text-xs text-text-light">
        <Luggage className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
        <span>
          {included > 0 ? `${included} bagage${included > 1 ? 's' : ''} inclus` : 'Bagages à confirmer agence'}
          {maxKg > 0 && ` · ${maxKg} kg max`}
          {extraFee > 0 && ` · suppl. ${formatPrice(extraFee)}`}
        </span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
          <Luggage className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-bold text-dark text-sm">Politique bagages</h3>
      </div>

      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
          <span className="text-text-light">
            <strong className="text-dark">{included > 0 ? `${included} bagage${included > 1 ? 's' : ''} inclus` : 'Bagages à confirmer avec l’agence'}</strong>
            {maxKg > 0 && <> · poids max <strong className="text-dark">{maxKg} kg</strong></>}
          </span>
        </li>
        {extraFee > 0 && (
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="text-text-light">
              Bagage supplémentaire : <strong className="text-dark">{formatPrice(extraFee)}</strong> payable directement à l’agence.
            </span>
          </li>
        )}
        {note && (
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
            <span className="text-text-muted text-xs">{note}</span>
          </li>
        )}
        {!included && !maxKg && !extraFee && !note && (
          <li className="text-xs text-text-muted">
            La politique précise est communiquée par l’agence à l’embarquement.
          </li>
        )}
      </ul>
    </div>
  );
}
