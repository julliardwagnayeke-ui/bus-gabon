'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEPARTURE_MOCKS: Record<string, any> = {
  '1': { route: 'Libreville → Oyem', date: '2026-05-20', time: '07:30', bus: 'Bus VIP 01', price: 12000, seats: 40, status: 'published' },
  '2': { route: 'Libreville → Franceville', date: '2026-05-21', time: '09:00', bus: 'Bus Classique 02', price: 18000, seats: 40, status: 'published' },
};

export default function EditDeparturePage() {
  const { id } = useParams();
  const router = useRouter();
  const [departure, setDeparture] = useState({
    route: '',
    date: '',
    time: '',
    bus: '',
    price: 0,
    seats: 0,
    status: 'published',
  });

  useEffect(() => {
    if (id && DEPARTURE_MOCKS[id]) {
      setDeparture(DEPARTURE_MOCKS[id]);
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Départ mis à jour avec succès');
    router.push('/agency/departures');
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Modifier le départ</h1>
              <p className="text-text-light">Ajustez les informations du départ programmé.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Trajet</span>
                  <input
                    type="text"
                    value={departure.route}
                    onChange={(event) => setDeparture({ ...departure, route: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Date</span>
                  <input
                    type="date"
                    value={departure.date}
                    onChange={(event) => setDeparture({ ...departure, date: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Heure</span>
                  <input
                    type="time"
                    value={departure.time}
                    onChange={(event) => setDeparture({ ...departure, time: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Bus</span>
                  <input
                    type="text"
                    value={departure.bus}
                    onChange={(event) => setDeparture({ ...departure, bus: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Prix</span>
                  <input
                    type="number"
                    min={0}
                    value={departure.price}
                    onChange={(event) => setDeparture({ ...departure, price: Number(event.target.value) })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Places totales</span>
                  <input
                    type="number"
                    min={1}
                    value={departure.seats}
                    onChange={(event) => setDeparture({ ...departure, seats: Number(event.target.value) })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Statut</span>
                  <select
                    value={departure.status}
                    onChange={(event) => setDeparture({ ...departure, status: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                    <option value="closed">Fermé</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/agency/departures')}
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
