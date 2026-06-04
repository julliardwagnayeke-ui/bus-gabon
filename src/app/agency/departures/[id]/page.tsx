'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DEPARTURE_MOCKS: Record<string, any> = {
  '1': {
    route: 'Libreville → Oyem',
    date: '2026-05-20',
    time: '07:30',
    bus: 'Bus VIP 01',
    price: 12000,
    sold: 18,
    available: 28,
    status: 'published',
    notes: 'Arrivée prévue à 15h30 avec pause à Lambaréné.',
  },
  '2': {
    route: 'Libreville → Franceville',
    date: '2026-05-21',
    time: '09:00',
    bus: 'Bus Classique 02',
    price: 18000,
    sold: 12,
    available: 30,
    status: 'published',
    notes: 'Départ depuis le terminal principal, embarquement 30 min avant.',
  },
};

export default function DepartureDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [departure, setDeparture] = useState(DEPARTURE_MOCKS['1']);

  useEffect(() => {
    if (id && DEPARTURE_MOCKS[id]) {
      setDeparture(DEPARTURE_MOCKS[id]);
    }
  }, [id]);

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-dark mb-2">Détails du départ</h1>
                <p className="text-text-light">Visualisez le planning et les informations de bord.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => router.push('/agency/departures')}
                  className="px-5 py-3 border border-border rounded-lg hover:bg-surface transition font-semibold"
                >
                  Retour aux départs
                </button>
                <Link
                  href={`/agency/departures/${id}/edit`}
                  className="px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                >
                  Modifier le départ
                </Link>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-light uppercase tracking-[0.2em]">Trajet</h2>
                  <p className="text-2xl font-bold text-dark">{departure.route}</p>
                </div>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-text-light">Date</p>
                    <p className="font-semibold text-dark">{departure.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Heure</p>
                    <p className="font-semibold text-dark">{departure.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Bus</p>
                    <p className="font-semibold text-dark">{departure.bus}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-text-light uppercase tracking-[0.2em]">Statut</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                    {departure.status}
                  </span>
                </div>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm text-text-light">Prix unitaire</p>
                    <p className="font-semibold text-dark">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(departure.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Billets vendus</p>
                    <p className="font-semibold text-dark">{departure.sold}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Places disponibles</p>
                    <p className="font-semibold text-dark">{departure.available}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-dark">Notes du départ</h2>
              <p className="text-text">{departure.notes}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
