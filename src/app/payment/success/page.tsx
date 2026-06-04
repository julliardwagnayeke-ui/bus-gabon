'use client';
export const dynamic = 'force-dynamic';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Share2, Eye } from 'lucide-react';
import Button from '@/components/common/Button';
import QRCodeDisplay from '@/components/ticket/QRCodeDisplay';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('reservationId');

  const handleViewTicket = () => {
    if (reservationId) {
      router.push(`/ticket/${reservationId}`);
    }
  };

  const handleDownloadTicket = () => {
    // TODO: Implement PDF download
    console.log('Download ticket');
  };

  const handleShareWhatsApp = () => {
    const message = `Mon paiement a été confirmé ! Voici mon code de réservation: ${reservationId}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-dark mb-4">
            Paiement confirmé !
          </h1>

          <p className="text-text-light mb-8">
            Votre réservation a été validée. Votre billet est maintenant disponible.
          </p>

          {reservationId && (
            <div className="mb-8">
              <div className="bg-surface-alt rounded-xl p-4 mb-4">
                <QRCodeDisplay value={reservationId} size={120} />
              </div>
              <p className="text-sm text-text-light">
                Code de réservation: <strong>{reservationId}</strong>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Button onClick={handleViewTicket} size="lg" className="w-full">
              <Eye className="w-5 h-5 mr-2" />
              Voir mon billet
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleDownloadTicket} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>

              <Button onClick={handleShareWhatsApp} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            <Button
              onClick={() => router.push('/my-bookings')}
              variant="outline"
              className="w-full"
            >
              Voir mes réservations
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> Présentez ce QR code ou votre code de réservation à l'agence le jour du départ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}