'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ROUTE_MOCKS: Record<string, any> = {
  '1': { from: 'Libreville', to: 'Oyem', price: 10000, duration: '8h30', baggage: 1, status: 'active' },
  '2': { from: 'Libreville', to: 'Franceville', price: 15000, duration: '12h00', baggage: 2, status: 'active' },
};

export default function EditRoutePage() {
  const { id } = useParams();
  const router = useRouter();
  const [route, setRoute] = useState({
    from: '',
    to: '',
    price: 0,
    duration: '',
    baggage: 1,
    status: 'active',
  });

  useEffect(() => {
    if (id && ROUTE_MOCKS[id]) {
      setRoute(ROUTE_MOCKS[id]);
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Ligne mise à jour avec succès');
    router.push('/agency/routes');
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Modifier la ligne</h1>
              <p className="text-text-light">Ajustez les informations du trajet existant.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Départ</span>
                  <input
                    type="text"
                    value={route.from}
                    onChange={(event) => setRoute({ ...route, from: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Arrivée</span>
                  <input
                    type="text"
                    value={route.to}
                    onChange={(event) => setRoute({ ...route, to: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Prix de base</span>
                  <input
                    type="number"
                    min={0}
                    value={route.price}
                    onChange={(event) => setRoute({ ...route, price: Number(event.target.value) })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Durée estimée</span>
                  <input
                    type="text"
                    value={route.duration}
                    onChange={(event) => setRoute({ ...route, duration: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Bagages inclus</span>
                  <input
                    type="number"
                    min={0}
                    value={route.baggage}
                    onChange={(event) => setRoute({ ...route, baggage: Number(event.target.value) })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Statut</span>
                  <select
                    value={route.status}
                    onChange={(event) => setRoute({ ...route, status: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="active">Actif</option>
                    <option value="draft">Brouillon</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/agency/routes')}
                  className="px-5 py-3 border border-border rounded-lg hover:bg-surface transition font-semibold"
                >
                  Annuler
                </button>
                <button type="submit" className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
