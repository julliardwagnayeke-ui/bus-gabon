'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_ROUTES = [
  {
    id: '1',
    from: 'Libreville',
    to: 'Oyem',
    price: 10000,
    duration: '8h30',
    baggage: 1,
    status: 'active',
  },
  {
    id: '2',
    from: 'Libreville',
    to: 'Franceville',
    price: 15000,
    duration: '12h',
    baggage: 2,
    status: 'active',
  },
];

export default function RoutesPage() {
  const [routes, setRoutes] = useState(MOCK_ROUTES);

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-dark mb-2">Mes lignes</h1>
                <p className="text-text-light">Créez et gérez vos destinations</p>
              </div>
              <Link
                href="/agency/routes/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                <Plus className="w-4 h-4" /> Nouvelle ligne
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-text-light">Trajet</th>
                      <th className="text-left py-3 font-semibold text-text-light">Prix de base</th>
                      <th className="text-left py-3 font-semibold text-text-light">Durée</th>
                      <th className="text-left py-3 font-semibold text-text-light">Bagages</th>
                      <th className="text-left py-3 font-semibold text-text-light">Statut</th>
                      <th className="text-left py-3 font-semibold text-text-light">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route) => (
                      <tr key={route.id} className="border-b border-border hover:bg-surface transition">
                        <td className="py-4 font-semibold text-dark">
                          {route.from} → {route.to}
                        </td>
                        <td className="py-4 font-semibold text-primary">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(route.price)}
                        </td>
                        <td className="py-4 text-text">{route.duration}</td>
                        <td className="py-4 text-text">{route.baggage} inclus</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            Actif
                          </span>
                        </td>
                        <td className="py-4 flex gap-2">
                          <Link
                            href={`/agency/routes/${route.id}/edit`}
                            className="p-2 hover:bg-surface rounded-lg transition text-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2 hover:bg-danger/10 rounded-lg transition text-danger">
                            <Trash2 className="w-4 h-4" />
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
