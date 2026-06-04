'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import PassengerForm from '@/components/checkout/PassengerForm';
import BookingSummary from '@/components/checkout/BookingSummary';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import TermsCheckbox from '@/components/checkout/TermsCheckbox';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDeparture } from '@/hooks/useSearchDepartures';
import { useCreateReservation } from '@/hooks/useCreateReservation';

export default function CheckoutPage() {
  const params = useParams<{ departureId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const { data: departure, isLoading: departureLoading } = useDeparture(params.departureId);
  const createReservation = useCreateReservation();

  const [passengerData, setPassengerData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'airtel' | 'moov' | 'card'>('airtel');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handlePassengerSubmit = (data: any) => {
    setPassengerData(data);
  };

  const handlePayment = async () => {
    if (!passengerData || !departure || !termsAccepted) return;

    try {
      const reservationData = {
        departureId: params.departureId,
        passengers: passengerData.passengers || [{
          name: passengerData.contactName,
          phone: passengerData.contactPhone,
        }],
        contactName: passengerData.contactName,
        contactPhone: passengerData.contactPhone,
        contactEmail: passengerData.contactEmail,
        paymentMethod,
      };

      const reservation = await createReservation.mutateAsync(reservationData);
      router.push(`/payment/${reservation.id}`);
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  if (departureLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!departure) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Départ non trouvé</h1>
          <p className="text-text-light">Ce départ n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Finaliser votre réservation</h1>
          <p className="text-text-light">
            Remplissez vos informations et choisissez votre moyen de paiement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Forms */}
          <div className="space-y-8">
            <PassengerForm
              passengerCount={passengers}
              onSubmit={handlePassengerSubmit}
            />

            {passengerData && (
              <>
                <PaymentMethodSelector
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                />

                <TermsCheckbox
                  accepted={termsAccepted}
                  onAccept={setTermsAccepted}
                />
              </>
            )}
          </div>

          {/* Right column - Summary */}
          <div className="space-y-8">
            {passengerData && (
              <BookingSummary
                departure={departure}
                passengerCount={passengers}
                passengerData={passengerData}
              />
            )}

            {passengerData && termsAccepted && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <button
                  onClick={handlePayment}
                  disabled={createReservation.isPending}
                  className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createReservation.isPending ? 'Traitement...' : `Payer ${((departure.price * passengers) + (200 * passengers)).toLocaleString()} FCFA`}
                </button>
                <p className="text-xs text-text-light text-center mt-2">
                  Paiement sécurisé via {paymentMethod === 'airtel' ? 'Airtel Money' : paymentMethod === 'moov' ? 'Moov Money' : 'Carte bancaire'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}