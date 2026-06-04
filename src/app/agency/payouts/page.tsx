'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import StatCard from '@/components/agency/common/StatCard';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

const MOCK_PAYOUTS = [
  {
    period: '01-07 juin',
    gross: 1000000,
    commission: 50000,
    net: 950000,
    status: 'paid',
    date: '2026-06-10',
  },
];

export default function PayoutsPage() {
  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Reversements</h1>
              <p className="text-text-light">Suivi des paiements de la plateforme</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                label="Montant en attente"
                value="215 000 FCFA"
                color="warning"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6" />}
                label="Déjà reversé"
                value="9.5M FCFA"
                color="success"
              />
              <StatCard
                icon={<DollarSign className="w-6 h-6" />}
                label="Prochain reversement"
                value="15 Juillet"
                color="primary"
              />
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-xl font-bold text-dark mb-6">Historique des versements</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-text-light">Période</th>
                      <th className="text-left py-3 font-semibold text-text-light">Ventes brutes</th>
                      <th className="text-left py-3 font-semibold text-text-light">Commission</th>
                      <th className="text-left py-3 font-semibold text-text-light">Net agence</th>
                      <th className="text-left py-3 font-semibold text-text-light">Date</th>
                      <th className="text-left py-3 font-semibold text-text-light">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PAYOUTS.map((payout, i) => (
                      <tr key={i} className="border-b border-border hover:bg-surface transition">
                        <td className="py-4 font-semibold text-dark">{payout.period}</td>
                        <td className="py-4 text-text">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(payout.gross)}
                        </td>
                        <td className="py-4 text-danger font-semibold">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(payout.commission)}
                        </td>
                        <td className="py-4 font-semibold text-primary">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(payout.net)}
                        </td>
                        <td className="py-4 text-text">{payout.date}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            ✓ Payé
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
