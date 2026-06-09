import { useState, useEffect } from 'react';
import { getPaidReservations } from '../../services/reservations';
import { formatPrice } from '../../lib/pricing';
import { TrendingUp, Percent, BadgeDollarSign } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Sparkline from '../../components/admin/Sparkline';
import BarChart from '../../components/admin/BarChart';
import { getAllAgencies } from '../../services/agencies';

function tsToDateKey(ts) {
  const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null);
  if (!d || isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function buildLast30DaysSeries(items) {
  const today = new Date();
  const buckets = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  for (const it of items) {
    const key = tsToDateKey(it.createdAt || it.confirmedAt || it.paidAt);
    if (key && key in buckets) {
      const amount = (it.platformAmount ?? 0) + (it.serviceFee ?? 0);
      buckets[key] += amount || it.amount || 0;
    }
  }
  return Object.values(buckets);
}

export default function AdminRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);
  const [topAgencies, setTopAgencies] = useState([]);

  useEffect(() => {
    Promise.all([
      getPaidReservations(),
      getAllAgencies().catch(() => []),
    ])
      .then(([paid, agencies]) => {
        const totalCommissions = paid.reduce((s, r) => s + ((r.platformAmount ?? 0) - (r.serviceFee || 200)), 0);
        const totalFees        = paid.length * 200;
        const totalRevenue     = totalCommissions + totalFees;
        const totalAgencyPayout = paid.reduce((s, r) => s + (r.agencyAmount || 0), 0);
        setData({ totalRevenue, totalCommissions, totalFees, totalAgencyPayout, totalReservations: paid.length });

        setSeries(buildLast30DaysSeries(paid));

        const byAgency = {};
        for (const r of paid) {
          if (!r.agencyId) continue;
          byAgency[r.agencyId] = (byAgency[r.agencyId] || 0) + (r.agencyAmount || 0);
        }
        const nameOf = (id) => agencies.find(a => a.id === id)?.name || 'Agence';
        const top = Object.entries(byAgency)
          .map(([agencyId, value]) => ({ label: nameOf(agencyId), value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        setTopAgencies(top);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data)   return <p className="text-center text-text-muted py-20">Erreur de chargement</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Revenus de la plateforme</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: 'Revenus totaux BusGabon', value: formatPrice(data.totalRevenue), color: 'text-primary', highlight: true },
          { icon: Percent,    label: 'Commissions (5%)',       value: formatPrice(data.totalCommissions), color: 'text-amber-600' },
          { icon: BadgeDollarSign, label: 'Frais de service (200 FCFA×commandes)', value: formatPrice(data.totalFees), color: 'text-success' },
          { icon: TrendingUp, label: 'Reversements agences',  value: formatPrice(data.totalAgencyPayout), color: 'text-purple-600' },
        ].map((k, i) => (
          <div key={i} className={`border rounded-2xl p-5 ${k.highlight ? 'bg-primary-50 border-primary-100' : 'bg-white border-border'}`}>
            <k.icon className={`w-6 h-6 ${k.color} mb-2`} />
            <p className="text-2xl font-bold text-dark">{k.value}</p>
            <p className="text-xs text-text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        {/* Tendance 30j */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-dark text-sm">Tendance revenus · 30 derniers jours</h2>
            <span className="text-xs text-text-muted">{series.reduce((s, v) => s + v, 0) > 0 ? 'Cumul affiché' : 'Période sans données'}</span>
          </div>
          <Sparkline data={series} width={520} height={120} ariaLabel="Revenus 30 derniers jours" />
        </div>

        {/* Top agences */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-dark text-sm mb-4">Top 5 agences (reversements)</h2>
          <BarChart items={topAgencies} />
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 text-sm">
        <h2 className="font-bold text-dark mb-3">Résumé flux financiers</h2>
        <div className="space-y-2 text-text-light">
          <p>• <strong className="text-dark">{data.totalReservations}</strong> commandes payées</p>
          <p>• Commission de 5% prélevée sur chaque billet → {formatPrice(data.totalCommissions)}</p>
          <p>• 200 FCFA de frais par commande → {formatPrice(data.totalFees)}</p>
          <p>• Reversé aux agences → {formatPrice(data.totalAgencyPayout)}</p>
        </div>
      </div>
    </div>
  );
}
