'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Smartphone } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useReservation } from '@/hooks/useCreateReservation';
import { usePayment, usePaymentStatus } from '@/hooks/usePayment';
import { formatCurrency } from '@/lib/api';

interface PaymentPageProps {
  params: {
    reservationId: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const { data: reservation, isLoading: reservationLoading } = useReservation(params.reservationId);
  const initiatePayment = usePayment();
  const { data: paymentStatus, isLoading: statusLoading } = usePaymentStatus(params.reservationId);

  const [paymentInitiated, setPaymentInitiated] = useState(false);

  useEffect(() => {
    if (reservation && !paymentInitiated) {
      initiatePayment.mutate({
        reservationId: params.reservationId,
        amount: reservation.totalAmount,
        method: 'airtel', // Default to Airtel Money
      });
      setPaymentInitiated(true);
    }
  }, [reservation, paymentInitiated]);

  useEffect(() => {
    if (paymentStatus?.status === 'completed') {
      router.push('/payment/success');
    } else if (paymentStatus?.status === 'failed') {
      router.push('/payment/failed');
    }
  }, [paymentStatus, router]);

  if (reservationLoading || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusDisplay = () => {
    if (statusLoading) {
      return {
        icon: <Clock className="w-8 h-8 text-blue-500" />,
        title: 'Paiement en cours',
        message: 'Veuillez patienter pendant que nous traitons votre paiement...',
        color: 'text-blue-600',
      };
    }

    switch (paymentStatus?.status) {
      case 'pending':
        return {
          icon: <Clock className="w-8 h-8 text-blue-500" />,
          title: 'Paiement en attente',
          message: 'Votre paiement est en cours de traitement.',
          color: 'text-blue-600',
        };
      case 'processing':
        return {
          icon: <Clock className="w-8 h-8 text-orange-500" />,
          title: 'Paiement en cours',
          message: 'Veuillez compléter le paiement sur votre téléphone.',
          color: 'text-orange-600',
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Paiement réussi',
          message: 'Votre paiement a été confirmé.',
          color: 'text-green-600',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Paiement échoué',
          message: 'Votre paiement n\'a pas pu être traité.',
          color: 'text-red-600',
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-gray-500" />,
          title: 'Initialisation du paiement',
          message: 'Préparation de votre paiement...',
          color: 'text-gray-600',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            {statusDisplay.icon}
          </div>

          <h1 className={`text-2xl font-bold mb-4 ${statusDisplay.color}`}>
            {statusDisplay.title}
          </h1>

          <p className="text-text-light mb-8">
            {statusDisplay.message}
          </p>

          {paymentStatus?.status === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-blue-800">Airtel Money</span>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                Composez #150# sur votre téléphone Airtel
              </p>
              <p className="text-xs text-blue-600">
                Montant: {formatCurrency(reservation.totalAmount)}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-sm text-text-light">
              <strong>Réservation:</strong> {params.reservationId}
            </div>
            <div className="text-sm text-text-light">
              <strong>Montant:</strong> {formatCurrency(reservation.totalAmount)}
            </div>
          </div>

          {paymentStatus?.status === 'failed' && (
            <div className="mt-8 space-y-4">
              <Button onClick={() => router.back()}>
                Réessayer le paiement
              </Button>
              <Button variant="outline" onClick={() => router.push('/contact')}>
                Contacter le support
              </Button>
            </div>
          )}

          {paymentStatus?.status === 'pending' && (
            <div className="mt-8">
              <LoadingSpinner size="md" />
              <p className="text-xs text-text-light mt-2">
                Ne fermez pas cette page
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}