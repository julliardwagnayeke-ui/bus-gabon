import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { formatPrice, calcPricing } from '../../lib/pricing';
import { initiatePayment, processPayment, subscribeToPayment } from '../../services/payments';
import { getDeparture } from '../../services/departures';
import { getAgency } from '../../services/agencies';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useApp } from '../../context/AppContext';

const PAYMENT_METHODS = [
  { id: 'airtel',     label: 'Airtel Money',        icon: '📱', color: 'bg-red-50 border-red-200' },
  { id: 'moov',       label: 'Moov Money',           icon: '📱', color: 'bg-blue-50 border-blue-200' },
  { id: 'simulation', label: 'Simulation (démo)',    icon: '🔧', color: 'bg-gray-50 border-gray-200' },
];

export default function Checkout() {
  const { departureId } = useParams();
  const location        = useLocation();
  const navigate        = useNavigate();
  const { user, platformSettings } = useApp();

  const state = location.state || {};
  const [reservationId]               = useState(state.reservationId);
  const [departure, setDeparture]     = useState(state.departure || null);
  const [agency,    setAgency]        = useState(state.agency    || null);
  const [route,     setRoute]         = useState(state.route     || null);
  const [ticketCount]                 = useState(state.ticketCount || 1);

  const [loading,   setLoading]   = useState(!state.departure);
  const [method,    setMethod]    = useState('airtel');
  const [phone,     setPhone]     = useState(user?.phone || '');
  const [paying,    setPaying]    = useState(false);
  const [error,     setError]     = useState('');
  const [countdown, setCountdown] = useState(600); // 10 min en secondes

  // 'form' → formulaire paiement | 'waiting' → en attente approbation téléphone
  const [step,      setStep]      = useState('form');
  const [paymentId, setPaymentId] = useState(null);
  const unsubRef = useRef(null);

  // Fetch data si non fourni via router state
  useEffect(() => {
    if (state.departure) return;
    setLoading(true);
    getDeparture(departureId)
      .then((dep) => {
        if (!dep) { navigate('/'); return; }
        setDeparture(dep);
        setRoute(dep.route || null);
        return getAgency(dep.agencyId);
      })
      .then(ag => setAgency(ag))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown 10 min
  useEffect(() => {
    if (countdown <= 0) { navigate('/paiement/echec'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  // Écoute temps réel du statut paiement (mobile money réel)
  useEffect(() => {
    if (step !== 'waiting' || !paymentId) return;

    unsubRef.current = subscribeToPayment(paymentId, (payment) => {
      if (payment.status === 'success') {
        unsubRef.current?.();
        navigate('/paiement/succes', {
          state: { reservationId, ticketIds: payment.ticketIds, departure, agency, route, ticketCount },
        });
      } else if (payment.status === 'failed' || payment.status === 'payment_failed') {
        unsubRef.current?.();
        setStep('form');
        setError('Paiement refusé par l\'opérateur. Vérifiez votre solde et réessayez.');
        setPaying(false);
      }
    });

    return () => unsubRef.current?.();
  }, [step, paymentId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePay() {
    if (!reservationId) { setError('Réservation introuvable. Recommencez.'); return; }
    if (method !== 'simulation' && !phone.trim()) {
      setError('Numéro de téléphone requis pour le paiement mobile.');
      return;
    }
    setPaying(true);
    setError('');

    try {
      const pricing = calcPricing(route?.basePrice || 0, ticketCount, platformSettings);

      // 1. Crée la ligne payment (Supabase)
      const uid = user?.uid || null;

      const pId = await initiatePayment({
        reservationId,
        userId:    uid,
        agencyId:  departure?.agencyId,
        amount:    pricing.totalClient,
        method,
        phone:     phone.trim(),
      });
      setPaymentId(pId);

      // 2. Déclenche le paiement (Cloud Function)
      const ticketIds = await processPayment({
        paymentId:     pId,
        reservationId,
        amount:        pricing.totalClient,
        method,
        phone:         phone.trim(),
      });

      if (ticketIds) {
        // Simulation → succès immédiat
        navigate('/paiement/succes', {
          state: { reservationId, ticketIds, departure, agency, route, ticketCount },
        });
      } else {
        // Airtel / Moov → passer en mode "en attente approbation"
        setStep('waiting');
        setPaying(false);
      }
    } catch (err) {
      setError(err.message || 'Paiement échoué. Réessayez.');
      setPaying(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!departure || !reservationId) return (
    <div className="text-center py-20">
      <p className="text-text-light mb-4">Réservation introuvable. Veuillez recommencer.</p>
      <button onClick={() => navigate('/')} className="text-primary hover:underline text-sm">Retour à l'accueil</button>
    </div>
  );

  const pricing = calcPricing(route?.basePrice || 0, ticketCount, platformSettings);
  const mm = Math.floor(countdown / 60);
  const ss = String(countdown % 60).padStart(2, '0');

  // ── Écran "en attente approbation téléphone" ──────────────────────────────
  if (step === 'waiting') {
    const methodLabel = method === 'airtel' ? 'Airtel Money' : 'Moov Money';
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-xl font-bold text-dark mb-2">Confirmez sur votre téléphone</h2>
          <p className="text-text-light text-sm mb-6">
            Une demande de paiement de{' '}
            <strong className="text-dark">{formatPrice(pricing.totalClient)}</strong> a été envoyée
            au numéro <strong className="text-dark">{phone}</strong> via {methodLabel}.
          </p>

          <div className="space-y-3 text-sm text-left mb-6">
            <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-text-light">Ouvrez votre application <strong className="text-dark">{methodLabel}</strong></span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-text-light">Validez la demande de paiement ou composez le code USSD reçu</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-surface-alt rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-text-light">Cette page se met à jour automatiquement une fois le paiement confirmé</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Temps restant : <strong>{mm}:{ss}</strong></span>
          </div>

          <button
            onClick={() => { setStep('form'); setError(''); }}
            className="mt-4 text-sm text-text-muted hover:text-dark underline"
          >
            ← Changer de méthode de paiement
          </button>
        </div>
      </div>
    );
  }

  // ── Formulaire de paiement ─────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-dark mb-6">Paiement</h1>

      {/* Chrono */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm text-amber-800">
        <Clock className="w-4 h-4" />
        Vos places sont réservées pendant <strong className="ml-1">{mm}:{ss}</strong>
      </div>

      {/* Récapitulatif */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-dark text-sm mb-3">Récapitulatif</h2>
        <div className="text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-text-light">{route?.originCity} → {route?.destinationCity}</span>
            <span className="font-medium">{departure.departureDate} · {departure.departureTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Agence</span>
            <span className="font-medium">{agency?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Billet × {ticketCount}</span>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Frais de service</span>
            <span>{formatPrice(pricing.serviceFee)}</span>
          </div>
          <div className="border-t border-border my-2" />
          <div className="flex justify-between font-bold text-dark text-base">
            <span>Total à payer</span>
            <span className="text-primary">{formatPrice(pricing.totalClient)}</span>
          </div>
        </div>
      </div>

      {/* Méthodes de paiement */}
      <div className="mb-4">
        <h2 className="font-bold text-dark text-sm mb-3">Mode de paiement</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map(m => (
            <label key={m.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${method === m.id ? 'border-primary bg-primary-50' : 'border-border bg-white'}`}>
              <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
              <span className="text-xl">{m.icon}</span>
              <span className="font-medium text-sm text-dark">{m.label}</span>
              {method === m.id && <span className="ml-auto text-primary">✓</span>}
            </label>
          ))}
        </div>
      </div>

      {/* Numéro de téléphone */}
      {method !== 'simulation' && (
        <div className="mb-5">
          <label className="text-sm font-medium text-dark mb-1 block">
            Numéro {method === 'airtel' ? 'Airtel' : 'Moov'} Money
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="077 12 34 56"
            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm"
          />
          <p className="text-xs text-text-muted mt-1">
            Vous recevrez une demande d'approbation sur ce numéro.
          </p>
        </div>
      )}

      {error && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

      <Button onClick={handlePay} loading={paying} className="w-full" size="xl">
        Payer {formatPrice(pricing.totalClient)}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-muted">
        <Shield className="w-3.5 h-3.5" /> Paiement sécurisé · Votre argent est protégé
      </div>
    </div>
  );
}
