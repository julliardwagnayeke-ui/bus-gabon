import { Luggage, AlertCircle } from 'lucide-react';
import Alert from '@/components/common/Alert';

interface BaggagePolicyCardProps {
  baggageIncluded: number;
  maxWeight?: number;
}

export default function BaggagePolicyCard({ baggageIncluded, maxWeight = 20 }: BaggagePolicyCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Luggage className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-bold text-dark">Politique de bagages</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
          <div>
            <p className="font-medium text-dark">{baggageIncluded} bagage{baggageIncluded > 1 ? 's' : ''} inclus{baggageIncluded > 1 ? '' : ''}</p>
            <p className="text-sm text-text-light">Poids maximum : {maxWeight}kg par bagage</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
          <div>
            <p className="font-medium text-dark">Bagages supplémentaires</p>
            <p className="text-sm text-text-light">Payés directement à l'agence selon les tarifs en vigueur</p>
          </div>
        </div>

        <Alert variant="info">
          <AlertCircle className="w-4 h-4" />
          <div>
            <p className="font-medium">Important</p>
            <p className="text-sm">Les dimensions maximales sont de 80cm x 50cm x 30cm. Les objets de valeur doivent être gardés avec vous.</p>
          </div>
        </Alert>
      </div>
    </div>
  );
}