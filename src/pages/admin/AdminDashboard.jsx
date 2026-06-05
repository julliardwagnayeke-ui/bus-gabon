import { useState, useEffect } from 'react';
import { Building2, Ticket, TrendingUp, Users } from 'lucide-react';
import { getAllAgencies } from '../../services/agencies';
import { formatPrice } from '../../lib/pricing';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminDashboard() {
  const [agencies, setAgencies] = useState([]);
  const [stats,    setStats]    = useState({ totalTickets: 0, totalCommissions: 0, totalFees: 0 });
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getAllAgencies(),
      getDocs(query(collection(db, 'reservations'), where('status', '==', 'paid'))),
    ]).then(([ags, resSnap]) => {
      setAgencies(ags);
      const paid = resSnap.docs.map(d => d.data());
      setStats({
        totalTickets:    paid.reduce((s, r) => s + (r.ticketCount || 0), 0),
        totalCommissions: paid.reduce((s, r) => s + (r.platformAmount - (r.serviceFee || 200)), 0),
        totalFees:        paid.length * 200,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const activeAgencies = agencies.filter(a => a.status === 'active').length;
  const pendingAgencies = agencies.filter(a => a.status === 'pending_review').length;

  const KPIs = [
    { icon: Building2, label: 'Agences actives',  value: activeAgencies,                  color: 'text-primary' },
    { icon: Ticket,    label: 'Billets vendus',    value: stats.totalTickets,              color: 'text-success' },
    { icon: TrendingUp,label: 'Commissions',       value: formatPrice(stats.totalCommissions), color: 'text-accent' },
    { icon: Users,     label: 'Frais de service',  value: formatPrice(stats.totalFees),    color: 'text-purple-600' },
  ];

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Vue générale</h1>

      {pendingAgencies > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6 flex items-center gap-2">
          ⚠️ <strong>{pendingAgencies} agence{pendingAgencies > 1 ? 's' : ''}</strong> en attente d'approbation.
          <a href="/admin/agences" className="underline ml-1">Voir</a>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPIs.map((k, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-4">
            <k.icon className={`w-6 h-6 ${k.color} mb-2`} />
            <p className="text-xl font-bold text-dark">{k.value}</p>
            <p className="text-xs text-text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-dark mb-4">Agences récentes</h2>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Nom</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Email</th>
              <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {agencies.slice(0, 8).map(a => (
              <tr key={a.id} className="border-t border-border hover:bg-surface-alt">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-text-light">{a.email}</td>
                <td className="px-4 py-3">
                  <Badge color={a.status === 'active' ? 'green' : a.status === 'pending_review' ? 'amber' : 'red'}>{a.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
