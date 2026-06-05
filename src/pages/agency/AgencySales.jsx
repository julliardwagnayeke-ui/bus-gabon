import { useState, useEffect } from 'react';
import { getAgencyReservations } from '../../services/reservations';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../lib/pricing';
import { TrendingUp, Ticket, BadgeDollarSign, Percent } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

export default function AgencySales() {
  const { agencyId } = useApp();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    getAgencyReservations(agencyId).then(setReservations).finally(() => setLoading(false));
  }, [agencyId]);

  const paid = reservations.filter(r => r.status === 'paid');
  const totalTickets  = paid.reduce((s, r) => s + (r.ticketCount || 0), 0);
  const totalGross    = paid.reduce((s, r) => s + ((r.unitPrice || 0) * (r.ticketCount || 0)), 0);
  const totalNet      = paid.reduce((s, r) => s + (r.agencyAmount || 0), 0);
  const totalCommission = totalGross - totalNet;

  const KPIs = [
    { icon: Ticket,           label: 'Billets vendus',  value: totalTickets,             color: 'text-primary' },
    { icon: TrendingUp,       label: 'Montant brut',    value: formatPrice(totalGross),   color: 'text-dark' },
    { icon: Percent,          label: 'Commission (5%)', value: formatPrice(totalCommission), color: 'text-amber-600' },
    { icon: BadgeDollarSign,  label: 'Montant net',     value: formatPrice(totalNet),     color: 'text-success' },
  ];

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Rapport des ventes</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {KPIs.map((k, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-5">
            <k.icon className={`w-6 h-6 ${k.color} mb-2`} />
            <p className="text-xl font-bold text-dark">{k.value}</p>
            <p className="text-xs text-text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Explication des revenus */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-sm">
        <h2 className="font-bold text-dark mb-3">Comment sont calculés vos revenus ?</h2>
        <div className="space-y-1.5 text-text-light">
          <p>• Prix billet fixé par vous → montant brut</p>
          <p>• BusGabon prélève <strong className="text-dark">5%</strong> de commission sur chaque billet</p>
          <p>• Les <strong className="text-dark">200 FCFA</strong> de frais de service restent entièrement à la plateforme</p>
          <p>• Vous recevez : montant brut − 5% = <strong className="text-dark">montant net</strong></p>
        </div>
      </div>
    </div>
  );
}
