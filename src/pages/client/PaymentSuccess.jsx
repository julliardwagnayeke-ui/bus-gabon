import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Ticket, Share2, UserPlus } from 'lucide-react';
import { buildWhatsAppLink, buildTicketWhatsAppMessage } from '../../services/notifications';
import { getReservation } from '../../services/reservations';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Spinner from '../../components/ui/Spinner';

export default function PaymentSuccess() {
  const { state } = useLocation();
  const { reservationId, ticketIds = [], departure, agency, route, ticketCount = 1 } = state || {};
  const { user } = useApp();
  const isGuest = !user || user.isAnonymous;

  const [reservation, setReservation] = useState(null);

  // Récupère les infos passager (nom, téléphone) depuis la réservation Firestore
  useEffect(() => {
    if (!reservationId) return;
    getReservation(reservationId)
      .then(setReservation)
      .catch(() => {});
  }, [reservationId]);

  let formattedDate = departure?.departureDate || '';
  try { formattedDate = format(new Date(departure.departureDate), 'd MMMM yyyy', { locale: fr }); }
  catch (err) { console.warn('[PaymentSuccess] date format failed', err); }

  const passengerPhone = reservation?.passengerPhone || '';
  const passengerName  = reservation?.passengerName  || '';

  const whatsappMsg = buildTicketWhatsAppMessage({
    passengerName: passengerName || 'Passager',
    route:         `${route?.originCity} → ${route?.destinationCity}`,
    date:          formattedDate,
    time:          departure?.departureTime || '',
    publicCode:    reservationId || '—',
  });

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="text-center mb-8 animate-scale-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Paiement confirmé !</h1>
        <p className="text-text-light text-sm">
          {passengerName ? `Félicitations ${passengerName} !` : 'Votre billet est prêt.'}{' '}
          Présentez le QR code à l'agence.
        </p>
      </div>

      {/* Code réservation */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-center mb-5">
        <p className="text-xs text-primary font-semibold mb-1">Code de réservation</p>
        <p className="text-2xl font-mono font-bold text-dark tracking-widest">
          {reservationId?.slice(-12)?.toUpperCase() || '—'}
        </p>
        <p className="text-xs text-text-muted mt-1">
          {isGuest ? 'Notez ce code — il vous sera demandé à l\'agence.' : 'Retrouvez-le dans "Mes billets".'}
        </p>
      </div>

      {/* Résumé trajet */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-5 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text-light">Trajet</span>
            <span className="font-semibold">{route?.originCity} → {route?.destinationCity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Agence</span>
            <span className="font-semibold">{agency?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Date</span>
            <span className="font-semibold capitalize">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Départ</span>
            <span className="font-semibold">{departure?.departureTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Billets</span>
            <span className="font-semibold">{ticketCount}</span>
          </div>
          {passengerPhone && (
            <div className="flex justify-between">
              <span className="text-text-light">Téléphone</span>
              <span className="font-semibold">{passengerPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {ticketIds.length > 0 && (
          <Link to={`/mes-billets/${ticketIds[0]}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition">
            <Ticket className="w-5 h-5" /> Voir mon billet
          </Link>
        )}

        {/* WhatsApp : envoi vers le numéro du passager si disponible, sinon bouton désactivé */}
        {passengerPhone ? (
          <a
            href={buildWhatsAppLink(passengerPhone, whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white rounded-full font-semibold text-sm hover:bg-green-600 transition"
          >
            <Share2 className="w-5 h-5" /> Envoyer sur WhatsApp
          </a>
        ) : reservation === null && reservationId ? (
          <div className="flex items-center justify-center gap-2 w-full py-3.5 bg-surface-alt rounded-full text-sm text-text-muted border border-border">
            <Spinner size="sm" /> Chargement...
          </div>
        ) : null}

        {isGuest ? (
          <Link to="/inscription"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-surface-alt text-dark rounded-full font-semibold text-sm hover:bg-border transition border border-border">
            <UserPlus className="w-4 h-4" /> Créer un compte pour retrouver vos billets
          </Link>
        ) : (
          <Link to="/mes-billets"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-surface-alt text-dark rounded-full font-semibold text-sm hover:bg-border transition border border-border">
            Voir tous mes billets
          </Link>
        )}
      </div>

      <p className="text-xs text-center text-text-muted mt-6">
        Présentez-vous à l'agence 15 min avant le départ · Billet non remboursable sauf mention contraire
      </p>
    </div>
  );
}
