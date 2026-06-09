import { useState, useEffect } from 'react';
import { getAllPayments } from '../../services/payments';
import { formatPrice } from '../../lib/pricing';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { format } from 'date-fns';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getAllPayments()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Paiements ({payments.length})</h1>
      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : payments.length === 0 ? <p className="text-text-muted text-sm py-10 text-center">Aucun paiement.</p>
      : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Réservation</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Méthode</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Montant</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Statut</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-t border-border hover:bg-surface-alt">
                    <td className="px-4 py-3 font-mono text-xs">{p.reservationId?.slice(-8) || '—'}</td>
                    <td className="px-4 py-3 capitalize">{p.method}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(p.amount || 0)}</td>
                    <td className="px-4 py-3">
                      <Badge color={p.status === 'paid' ? 'green' : p.status === 'pending' || p.status === 'processing' ? 'blue' : 'red'}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {p.createdAt ? format(new Date(p.createdAt), 'dd/MM/yyyy HH:mm') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
