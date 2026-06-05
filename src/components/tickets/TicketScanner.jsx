import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function TicketScanner({ onVerify }) {
  const [scanning, setScanning]       = useState(false);
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [manualCode, setManualCode]   = useState('');
  const scannerRef = useRef(null);

  async function startScanner() {
    setResult(null);
    setScanning(true);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('bg-qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decoded) => {
          await scanner.stop();
          setScanning(false);
          await handleVerify(decoded);
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      setResult({ valid: false, message: `Erreur caméra : ${err.message || 'Accès refusé'}` });
    }
  }

  async function handleVerify(payload) {
    if (!payload?.trim()) return;
    setLoading(true);
    try {
      const res = await onVerify(payload.trim());
      setResult(res);
    } catch (err) {
      setResult({ valid: false, message: err.message || 'Erreur de vérification' });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setManualCode('');
  }

  useEffect(() => {
    return () => { scannerRef.current?.stop().catch(() => {}); };
  }, []);

  return (
    <div className="max-w-md mx-auto">
      {!result && (
        <>
          {scanning ? (
            <div id="bg-qr-reader" className="rounded-2xl overflow-hidden mb-4" />
          ) : (
            <Button onClick={startScanner} className="w-full mb-4" size="lg">
              <Camera className="w-5 h-5" /> Ouvrir la caméra
            </Button>
          )}
          {!scanning && (
            <div>
              <p className="text-sm text-text-light mb-2 text-center">— ou saisir le code manuellement —</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify(manualCode)}
                  placeholder="BG-2025-XXXX-XXXX"
                  className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none text-sm"
                />
                <Button onClick={() => handleVerify(manualCode)} loading={loading} size="md">
                  Vérifier
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-text-light">Vérification en cours…</p>
        </div>
      )}

      {result && !loading && (
        <div className={`rounded-2xl p-6 text-center ${result.valid ? 'bg-green-50' : result.alreadyUsed ? 'bg-amber-50' : 'bg-red-50'}`}>
          {result.valid
            ? <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
            : result.alreadyUsed
              ? <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-3" />
              : <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
          }
          <h2 className={`text-xl font-bold mb-2 ${result.valid ? 'text-green-700' : result.alreadyUsed ? 'text-amber-700' : 'text-red-700'}`}>
            {result.valid ? 'Billet valide ✓' : result.alreadyUsed ? 'Déjà utilisé' : 'Billet invalide'}
          </h2>
          <p className="text-text-light mb-4 text-sm">{result.message}</p>
          {result.ticket && (
            <div className="text-left bg-white rounded-xl p-4 mt-3 text-sm space-y-1.5 border border-border">
              <p><span className="font-semibold">Passager :</span> {result.ticket.passengerName}</p>
              <p><span className="font-semibold">Trajet :</span> {result.ticket.route}</p>
              <p><span className="font-semibold">Date :</span> {result.ticket.departureDate}</p>
              <p><span className="font-semibold">Heure :</span> {result.ticket.departureTime}</p>
            </div>
          )}
          <button onClick={reset} className="mt-5 flex items-center gap-2 mx-auto text-primary font-semibold text-sm">
            <RotateCcw className="w-4 h-4" /> Scanner un autre billet
          </button>
        </div>
      )}
    </div>
  );
}
