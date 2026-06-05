import { ScanQrCode } from 'lucide-react';
import { verifyTicket } from '../../services/tickets';
import { useApp } from '../../context/AppContext';
import TicketScanner from '../../components/tickets/TicketScanner';

export default function AgencyScanner() {
  const { agencyId } = useApp();

  async function handleVerify(payload) {
    return verifyTicket(payload, agencyId, true);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <ScanQrCode className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dark">Scanner un billet</h1>
          <p className="text-text-muted text-xs">Validation au départ</p>
        </div>
      </div>

      <TicketScanner onVerify={handleVerify} />

      <div className="mt-6 bg-surface-alt rounded-xl p-4 text-xs text-text-light">
        <p className="font-semibold mb-1">Comment valider un billet</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Cliquez sur "Ouvrir la caméra" et scannez le QR code du passager</li>
          <li>Ou saisissez le code manuellement (format BG-XXXX-XXXX-XXXX)</li>
          <li>Un billet déjà utilisé affichera une alerte</li>
        </ul>
      </div>
    </div>
  );
}
