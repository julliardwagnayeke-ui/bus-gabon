import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

interface BookingCTAProps {
  departureId: string;
  passengerCount: number;
}

export default function BookingCTA({ departureId, passengerCount }: BookingCTAProps) {
  const router = useRouter();

  const handleBooking = () => {
    router.push(`/checkout/${departureId}?passengers=${passengerCount}`);
  };

  return (
    <div className="bg-primary text-white rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold mb-4">Prêt à réserver ?</h3>
      <p className="text-white/80 mb-6 max-w-md mx-auto">
        Réservez votre place en toute sécurité. Votre billet vous sera envoyé immédiatement après paiement.
      </p>
      <Button
        onClick={handleBooking}
        size="lg"
        className="bg-white text-primary hover:bg-white/90"
      >
        Continuer la réservation
      </Button>
    </div>
  );
}