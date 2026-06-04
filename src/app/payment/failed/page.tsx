'use client';

import { useRouter } from 'next/navigation';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';
import Button from '@/components/common/Button';

export default function PaymentFailedPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.back();
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-dark mb-4">
            Paiement échoué
          </h1>

          <p className="text-text-light mb-8">
            Votre paiement n'a pas pu être traité. Plusieurs raisons peuvent expliquer cela :
          </p>

          <div className="text-left bg-red-50 rounded-xl p-4 mb-8">
            <ul className="text-sm text-red-800 space-y-2">
              <li>• Solde insuffisant sur votre mobile money</li>
              <li>• Problème de réseau lors de la transaction</li>
              <li>• Timeout de la transaction</li>
              <li>• Erreur technique temporaire</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button onClick={handleRetry} size="lg" className="w-full">
              <RefreshCw className="w-5 h-5 mr-2" />
              Réessayer le paiement
            </Button>

            <Button onClick={handleContactSupport} variant="outline" className="w-full">
              <MessageCircle className="w-5 h-5 mr-2" />
              Contacter le support
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Conseil:</strong> Vérifiez votre solde et votre connexion réseau avant de réessayer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}