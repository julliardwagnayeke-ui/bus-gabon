import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getUserReservations } from '../../services/reservations';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../lib/pricing';

const STATUS_INFO = {
  paid:            { label: 'Payé',        color: 'green' },
  pending_payment: { label: 'En attente',  color: 'blue' },
  cancelled:       { label: 'Annulé',      color: 'red' },
  expired:         { label: 'Expiré',      color: 'gray' },
  completed:       { label: 'Terminé',     color: 'gray' },
  checked_in:      { label: 'Validé',      color: 'purple' },
};

export default function MyTickets() {
  const { user } = useApp();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserReservations(user.uid)
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Mes billets</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <Ticket className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h2 className="font-bold text-dark mb-2">Aucun billet</h2>
          <p className="text-text-light text-sm mb-6">Vous n'avez encore réservé aucun voyage.</p>
          <Link to="/" className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark">
            Rechercher un trajet
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map(r => {
            const info = STATUS_INFO[r.status] || { label: r.status, color: 'gray' };
            let formattedDate = r.departureDate || '—';
            try {
              if (r.departureDate) formattedDate = format(new Date(r.departureDate), 'd MMM yyyy', { locale: fr });
            } catch (err) { console.warn('[MyTickets] date format failed', err); }

            return (
              <Link key={r.id} to={`/mes-billets/${r.id}`}
                className="flex items-center gap-4 bg-white border border-border rounded-2xl p-4 hover:border-primary transition group">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-dark text-sm truncate">
                      {r.originCity || '?'} → {r.destinationCity || '?'}
                    </p>
                    <Badge color={info.color}>{info.label}</Badge>
                  </div>
                  <p className="text-xs text-text-light">{r.agencyName || 'Agence'} · {formattedDate} · {r.departureTime || ''}</p>
                  <p className="text-xs text-text-muted">{r.ticketCount} billet{r.ticketCount > 1 ? 's' : ''} · {formatPrice(r.totalAmount)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
