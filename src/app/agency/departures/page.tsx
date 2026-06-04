'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Plus, Eye, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_DEPARTURES = [
  {
    id: '1',
    route: 'Libreville → Oyem',
    date: '2026-05-20',
    time: '07h30',
    bus: 'Bus VIP 01',
    price: 12000,
    open: 28,
    sold: 18,
    status: 'published',
  },
  {
    id: '2',
    route: 'Libreville → Franceville',
    date: '2026-05-21',
    time: '09h00',
    bus: 'Bus Classique 02',
    price: 18000,
    open: 30,
    sold: 12,
    status: 'published',
  },
];

export default function DeparturesPage() {
  const [departures, setDepartures] = useState(MOCK_DEPARTURES);

  const getStatusColor = (status: string) => {
    const colors: any = {
      published: 'bg-success/10 text-success',
      draft: 'bg-surface-alt text-text',
      closed: 'bg-warning/10 text-warning',
      departed: 'bg-primary/10 text-primary',
    };
    return colors[status] || 'bg-surface-alt text-text';
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-dark mb-2">Mes départs</h1>
                <p className="text-text-light">Programmez et gérez vos trajets</p>
              </div>
              <Link
                href="/agency/departures/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                <Plus className="w-4 h-4" /> Nouveau départ
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-text-light">Trajet</th>
                      <th className="text-left py-3 font-semibold text-text-light">Date/Heure</th>
                      <th className="text-left py-3 font-semibold text-text-light">Bus</th>
                      <th className="text-left py-3 font-semibold text-text-light">Prix</th>
                      <th className="text-left py-3 font-semibold text-text-light">Places</th>
                      <th className="text-left py-3 font-semibold text-text-light">Statut</th>
                      <th className="text-left py-3 font-semibold text-text-light">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departures.map((dep) => (
                      <tr key={dep.id} className="border-b border-border hover:bg-surface transition">
                        <td className="py-4 font-semibold text-dark">{dep.route}</td>
                        <td className="py-4 text-text">{dep.date} {dep.time}</td>
                        <td className="py-4 text-text">{dep.bus}</td>
                        <td className="py-4 font-semibold text-primary">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(dep.price)}
                        </td>
                        <td className={`py-4 font-semibold ${dep.sold > 20 ? 'text-warning' : 'text-success'}`}>
                          {dep.sold}/{dep.open}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dep.status)}`}>
                            {dep.status}
                          </span>
                        </td>
                        <td className="py-4 flex gap-2">
                          <Link href={`/agency/departures/${dep.id}`} className="p-2 hover:bg-surface rounded-lg transition text-primary">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 hover:bg-surface rounded-lg transition text-text-light">
                            <Zap className="w-4 h-4" />
                          </button>
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
