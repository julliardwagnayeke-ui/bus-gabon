'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import StatCard from '@/components/agency/common/StatCard';
import { BarChart3, Download, Calendar } from 'lucide-react';

export default function SalesPage() {
  const stats = {
    today: { tickets: 34, gross: 340000, commission: 17000, net: 323000 },
    week: { tickets: 210, gross: 2100000, commission: 105000, net: 1995000 },
    month: { tickets: 850, gross: 8500000, commission: 425000, net: 8075000 },
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Ventes</h1>
              <p className="text-text-light">Suivi de votre chiffre d'affaires</p>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-2 border-b border-border">
              {['Aujourd\'hui', 'Cette semaine', 'Ce mois'].map((period, i) => (
                <button
                  key={i}
                  className={`px-4 py-3 border-b-2 font-semibold transition ${
                    i === 0 ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-dark'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Billets vendus"
                value={stats.today.tickets}
                color="primary"
              />
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Chiffre brut"
                value={`${(stats.today.gross / 1000000).toFixed(1)}M`}
                color="primary"
              />
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Commission"
                value={`${(stats.today.commission / 1000).toFixed(0)}K`}
                color="warning"
              />
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Net agence"
                value={`${(stats.today.net / 1000000).toFixed(1)}M`}
                color="success"
              />
            </div>

            {/* Sales by Departure */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dark">Ventes par départ</h2>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-surface transition">
                  <Download className="w-4 h-4" /> Exporter
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { route: 'Libreville → Oyem', tickets: 24, amount: 240000 },
                  { route: 'Libreville → Franceville', tickets: 10, amount: 100000 },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-surface rounded-lg">
                    <div>
                      <p className="font-semibold text-dark">{item.route}</p>
                      <p className="text-sm text-text-light">{item.tickets} billets</p>
                    </div>
                    <p className="font-bold text-primary">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(item.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
