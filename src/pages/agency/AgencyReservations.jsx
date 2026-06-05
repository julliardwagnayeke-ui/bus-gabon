import { useState, useEffect } from 'react';
import { getAgencyReservations } from '../../services/reservations';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../lib/pricing';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLOR = { paid: 'green', pending_payment: 'blue', cancelled: 'red', expired: 'gray', checked_in: 'purple' };

export default function AgencyReservations() {
  const { agencyId } = useApp();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    getAgencyReservations(agencyId).then(setReservations).finally(() => setLoading(false));
  }, [agencyId]);

  const displayed = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Réservations</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all','paid','pending_payment','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${filter === f ? 'bg-primary text-white' : 'bg-surface-alt text-text-light'}`}>
            {f === 'all' ? 'Toutes' : f === 'paid' ? 'Payées' : f === 'pending_payment' ? 'En attente' : 'Annulées'}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : displayed.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-16">Aucune réservation.</p>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Passager</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Téléphone</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Billets</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Montant</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-surface-alt">
                  <td className="px-4 py-3 font-medium">{r.passengerName}</td>
                  <td className="px-4 py-3 text-text-light">{r.passengerPhone}</td>
                  <td className="px-4 py-3 text-text-light">{r.ticketCount}</td>
                  <td className="px-4 py-3">{formatPrice(r.agencyAmount || 0)}</td>
                  <td className="px-4 py-3"><Badge color={STATUS_COLOR[r.status] || 'gray'}>{r.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
