import { useState, useEffect } from 'react';
import { Ticket, TrendingUp, Users, CalendarClock } from 'lucide-react';
import { getAgencyReservations } from '../../services/reservations';
import { getAgencyDepartures } from '../../services/departures';
import { formatPrice } from '../../lib/pricing';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

export default function AgencyDashboard() {
  const { agencyId } = useApp();
  const [reservations, setReservations] = useState([]);
  const [departures,   setDepartures]   = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    Promise.all([
      getAgencyReservations(agencyId),
      getAgencyDepartures(agencyId),
    ]).then(([res, deps]) => {
      setReservations(res);
      setDepartures(deps);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [agencyId]);

  const paidReservations = reservations.filter(r => r.status === 'paid');
  const todayDepartures  = departures.filter(d => d.departureDate === format(new Date(), 'yyyy-MM-dd'));
  const totalRevenue = paidReservations.reduce((sum, r) => sum + (r.agencyAmount || 0), 0);
  const totalTickets = paidReservations.reduce((sum, r) => sum + (r.ticketCount || 0), 0);

  const KPIs = [
    { label: 'Billets vendus',    value: totalTickets,           icon: Ticket,       color: 'text-primary' },
    { label: 'Revenus nets',      value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-success' },
    { label: 'Réservations',      value: paidReservations.length,   icon: Users,      color: 'text-accent' },
    { label: 'Départs aujourd\'hui', value: todayDepartures.length, icon: CalendarClock, color: 'text-purple-600' },
  ];

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIs.map((k, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-4">
            <k.icon className={`w-6 h-6 ${k.color} mb-2`} />
            <p className="text-xl font-bold text-dark">{k.value}</p>
            <p className="text-xs text-text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Départs du jour */}
      <div className="mb-8">
        <h2 className="font-bold text-dark mb-4">Départs d'aujourd'hui ({todayDepartures.length})</h2>
        {todayDepartures.length === 0 ? (
          <p className="text-text-muted text-sm">Aucun départ programmé aujourd'hui.</p>
        ) : (
          <div className="space-y-3">
            {todayDepartures.map(d => (
              <div key={d.id} className="flex items-center justify-between bg-white border border-border rounded-xl p-4 text-sm">
                <div>
                  <p className="font-semibold">{d.originCity} → {d.destinationCity}</p>
                  <p className="text-text-muted text-xs">{d.departureTime}</p>
                </div>
                <Badge color={d.status === 'scheduled' ? 'blue' : 'green'}>{d.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dernières réservations */}
      <div>
        <h2 className="font-bold text-dark mb-4">Dernières réservations</h2>
        {paidReservations.length === 0 ? (
          <p className="text-text-muted text-sm">Aucune réservation pour le moment.</p>
        ) : (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Passager</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Billets</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Montant</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paidReservations.slice(0, 8).map(r => (
                  <tr key={r.id} className="border-t border-border hover:bg-surface-alt">
                    <td className="px-4 py-3 font-medium">{r.passengerName}</td>
                    <td className="px-4 py-3 text-text-light">{r.ticketCount}</td>
                    <td className="px-4 py-3">{formatPrice(r.agencyAmount || 0)}</td>
                    <td className="px-4 py-3"><Badge color="green">Payé</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
