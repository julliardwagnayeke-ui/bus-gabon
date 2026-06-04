'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { api } from '@/lib/api';

export default function VerifyTicketPage() {
  const router = useRouter();
  const [ticketCode, setTicketCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!ticketCode.trim()) return;

    setIsVerifying(true);
    try {
      const response = await api.post('/api/tickets/verify', { code: ticketCode });
      setVerificationResult(response.data);
    } catch (error: any) {
      setVerificationResult({
        found: false,
        error: error.response?.data?.message || 'Erreur lors de la vérification',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewTicket = () => {
    if (verificationResult?.ticket) {
      router.push(`/ticket/${verificationResult.ticket.id}`);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'valid':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Billet valide',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'used':
        return {
          icon: <XCircle className="w-8 h-8 text-orange-500" />,
          title: 'Billet déjà utilisé',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Billet annulé',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'expired':
        return {
          icon: <XCircle className="w-8 h-8 text-gray-500" />,
          title: 'Billet expiré',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
      default:
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Billet non trouvé',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Vérifier un billet</h1>
            <p className="text-text-light">
              Entrez le code de réservation ou scannez le QR code
            </p>
          </div>

          <div className="space-y-6">
            <Input
              label="Code de réservation"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              placeholder="Ex: BUSGAB-ABC123"
              className="text-center text-lg font-mono"
            />

            <Button
              onClick={handleVerify}
              disabled={!ticketCode.trim() || isVerifying}
              size="lg"
              className="w-full"
            >
              {isVerifying ? <LoadingSpinner size="sm" /> : <Search className="w-5 h-5 mr-2" />}
              {isVerifying ? 'Vérification...' : 'Vérifier'}
            </Button>
          </div>

          {verificationResult && (
            <div className={`mt-8 p-6 rounded-xl border ${
              verificationResult.found
                ? getStatusDisplay(verificationResult.status).bgColor + ' ' + getStatusDisplay(verificationResult.status).borderColor
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-center">
                {verificationResult.found ? (
                  <>
                    {getStatusDisplay(verificationResult.status).icon}
                    <h3 className={`text-lg font-bold mt-4 ${getStatusDisplay(verificationResult.status).color}`}>
                      {getStatusDisplay(verificationResult.status).title}
                    </h3>

                    <div className="mt-4 space-y-2 text-sm">
                      <p><strong>Agence:</strong> {verificationResult.agencyName}</p>
                      <p><strong>Trajet:</strong> {verificationResult.route}</p>
                      <p><strong>Date:</strong> {new Date(verificationResult.date).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Heure:</strong> {verificationResult.time}</p>
                    </div>

                    {verificationResult.status === 'valid' && (
                      <Button onClick={handleViewTicket} className="mt-6">
                        Voir le billet complet
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-500 mx-auto" />
                    <h3 className="text-lg font-bold text-red-600 mt-4">
                      Billet non trouvé
                    </h3>
                    <p className="text-red-700 mt-2">
                      {verificationResult.error || 'Ce code de réservation n\'existe pas.'}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}