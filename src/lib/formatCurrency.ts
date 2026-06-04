import { formatCurrency } from '@/lib/api';

interface PriceBreakdownProps {
  basePrice: number;
  passengerCount: number;
  serviceFee: number;
}

export function calculateTotal(basePrice: number, passengerCount: number, serviceFee: number = 200) {
  const subtotal = basePrice * passengerCount;
  const totalFees = serviceFee * passengerCount;
  return {
    subtotal,
    fees: totalFees,
    total: subtotal + totalFees,
  };
}

export function PriceBreakdown({ basePrice, passengerCount, serviceFee = 200 }: PriceBreakdownProps) {
  const { subtotal, fees, total } = calculateTotal(basePrice, passengerCount, serviceFee);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Prix du billet × {passengerCount}</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-text-light">
        <span>Frais de service × {passengerCount}</span>
        <span>{formatCurrency(fees)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-2">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}