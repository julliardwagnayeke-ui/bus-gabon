import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Clock, Users, AlertCircle } from 'lucide-react';
import { getDeparture } from '../../services/departures';
import { getAgency } from '../../services/agencies';
import { getAvailableSeats } from '../../lib/availability';
import { calcPricing, formatPrice } from '../../lib/pricing';
import { sanitizeInput, validateEmail, validatePhone } from '../../lib/security';
import { createReservation } from '../../services/reservations';
import AgencyCard from '../../components/agency/AgencyCard';
import BaggagePolicy from '../../components/booking/BaggagePolicy';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { useApp } from '../../context/AppContext';

export default function DepartureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();

  const [departure, setDeparture]   = useState(null);
  const [agency,    setAgency]      = useState(null);
  const [route,     setRoute]       = useState(null);
  const [available, setAvailable]   = useState(null);
  const [loading,   setLoading]     = useState(true);

  const [ticketCount, setTicketCount] = useState(1);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    setLoading(true);
    getDeparture(id)
      .then(async (dep) => {
        if (!dep) { setDeparture(null); setLoading(false); return; }
        const [ag, seats] = await Promise.all([
          getAgency(dep.agencyId),
          getAvailableSeats(dep.id, dep.totalSeats),
        ]);
        // Route enrichie (déjà dans dep si searchDepartures, sinon fetch séparé)
        setDeparture(dep);
        setRoute(dep.route || null);
        setAgency(ag);
        setAvailable(seats);
      })
      .catch(() => setDeparture(null))
      .finally(() => setLoading(false));
  }, [id]);

  const maxTickets = Math.min(
    departure?.maxTicketsPerOrder || 4,
    available || 0,
    4
  );

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function validate() {
    const e = {};
    if (!form.name.trim())        e.name  = 'Nom requis';
    if (!validatePhone(form.phone)) e.phone = 'Numéro invalide (ex: 077123456)';
    if (form.email && !validateEmail(form.email)) e.email = 'Email invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleReserve() {
    if (!user) { navigate('/connexion', { state: { from: `/depart/${id}` } }); return; }
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      const reservationId = await createReservation({
        userId: user.uid,
        departureId: departure.id,
        agencyId: departure.agencyId,
        routeId: departure.routeId,
        unitPrice: route?.basePrice || 0,
        ticketCount,
        passengerName: sanitizeInput(form.name),
        passengerPhone: sanitizeInput(form.phone),
        passengerEmail: sanitizeInput(form.email),
      });
      navigate(`/checkout/${departure.id}`, { state: { reservationId, departure, agency, route, ticketCount } });
    } catch (err) {
      setServerError(err.message || 'Impossible de créer la réservation. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!departure) return (
    <div className="text-center py-20">
      <p className="text-text-light mb-4">Départ introuvable.</p>
      <Link to="/" className="text-primary hover:underline text-sm">Retour à l'accueil</Link>
    </div>
  );

  const pricing = calcPricing(route?.basePrice || 0, ticketCount);
  let formattedDate = departure.departureDate;
  try { formattedDate = format(new Date(departure.departureDate), 'EEEE d MMMM yyyy', { locale: fr }); }
  catch (err) { console.warn('[DepartureDetail] date format failed', err); }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/recherche" className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-dark mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour aux résultats
      </Link>

      <h1 className="text-xl font-bold text-dark mb-6">
        {route?.originCity} → {route?.destinationCity}
      </h1>

      {/* Infos trajet */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <p className="text-text-muted text-xs mb-0.5">Date</p>
            <p className="font-semibold text-dark capitalize">{formattedDate}</p>
          </div>
          <div className="flex items-start gap-1.5">
            <Clock className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-text-muted text-xs mb-0.5">Départ</p>
              <p className="font-semibold text-dark">{departure.departureTime}
                {departure.estimatedArrivalTime && <span className="text-text-light font-normal"> → {departure.estimatedArrivalTime}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <Users className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-text-muted text-xs mb-0.5">Places restantes</p>
              <p className={`font-semibold text-sm ${available <= 5 ? 'text-amber-600' : 'text-success'}`}>
                {available} place{available > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        {route?.cancellationPolicy && (
          <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span><strong>Annulation :</strong> {route.cancellationPolicy}</span>
          </div>
        )}
      </div>

      {/* Politique bagages */}
      <div className="mb-4"><BaggagePolicy route={route} /></div>

      {/* Agence */}
      {agency && <div className="mb-4"><AgencyCard agency={agency} /></div>}

      {/* Formulaire passager */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-dark mb-4">Informations passager</h2>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-medium text-dark mb-1 block">Nom complet *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Prénom Nom"
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`} />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-dark mb-1 block">Téléphone *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="077 12 34 56"
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`} />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-dark mb-1 block">Email (optionnel)</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="votre@email.com"
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`} />
          </div>
          <div>
            <label className="text-xs font-medium text-dark mb-1 block">Nombre de voyageurs</label>
            <select value={ticketCount} onChange={e => setTicketCount(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm bg-white">
              {Array.from({ length: maxTickets }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} voyageur{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Récapitulatif prix */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-5">
        <h2 className="font-bold text-dark mb-3 text-sm">Récapitulatif</h2>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-light">Billet × {ticketCount}</span>
            <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Frais de service</span>
            <span className="font-medium">{formatPrice(pricing.serviceFee)}</span>
          </div>
          <div className="border-t border-primary-100 my-2" />
          <div className="flex justify-between font-bold text-dark text-base">
            <span>Total</span>
            <span>{formatPrice(pricing.totalClient)}</span>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-4">{serverError}</div>
      )}

      <Button onClick={handleReserve} loading={submitting} className="w-full" size="xl">
        Continuer vers le paiement
      </Button>

      {!user && (
        <p className="text-xs text-center text-text-muted mt-3">
          Vous devrez vous connecter ou créer un compte pour finaliser la réservation.
        </p>
      )}
    </div>
  );
}
