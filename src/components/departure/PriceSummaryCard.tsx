import { Calculator } from 'lucide-react';
import { PriceBreakdown } from '@/lib/formatCurrency';

interface PriceSummaryCardProps {
  basePrice: number;
  passengerCount: number;
  serviceFee?: number;
}

export default function PriceSummaryCard({ basePrice, passengerCount, serviceFee = 200 }: PriceSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-bold text-dark">Récapitulatif du prix</h3>
      </div>

      <PriceBreakdown
        basePrice={basePrice}
        passengerCount={passengerCount}
        serviceFee={serviceFee}
      />
    </div>
  );
}