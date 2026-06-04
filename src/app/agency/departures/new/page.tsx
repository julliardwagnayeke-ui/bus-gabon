'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewDeparturePage() {
  const router = useRouter();
  const [departure, setDeparture] = useState({
    route: 'Libreville → Oyem',
    date: '',
    time: '07:30',
    bus: 'Bus VIP 01',
    price: 12000,
    seats: 40,
    status: 'published',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Départ programmé avec succès');
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
              <h1 className="text-4xl font-extrabold text-dark mb-2">Programmer un départ</h1>
              <p className="text-text-light">Ajoutez un nouveau départ pour une ligne existante.</p>
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
                  Enregistrer le départ
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
