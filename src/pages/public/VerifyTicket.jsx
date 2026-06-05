import { useState } from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { verifyTicketPublic } from '../../services/tickets';
import TicketScanner from '../../components/tickets/TicketScanner';

export default function VerifyTicket() {
  const [mode, setMode] = useState('scanner'); // 'scanner' | 'code'

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Vérifier un billet</h1>
        <p className="text-text-light text-sm">
          Scannez le QR code ou saisissez le code de réservation pour vérifier la validité d'un billet.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-alt rounded-xl p-1 mb-6">
        <button onClick={() => setMode('scanner')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === 'scanner' ? 'bg-white shadow-sm text-dark' : 'text-text-light'}`}>
          <QrCode className="w-4 h-4 inline mr-1.5" />Scanner QR
        </button>
        <button onClick={() => setMode('code')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${mode === 'code' ? 'bg-white shadow-sm text-dark' : 'text-text-light'}`}>
          Saisir un code
        </button>
      </div>

      <TicketScanner onVerify={(payload) => verifyTicketPublic(payload)} />

      <p className="text-xs text-center text-text-muted mt-8">
        Cette vérification est publique. Utilisée par les agences pour valider les billets au départ.
      </p>
    </div>
  );
}
