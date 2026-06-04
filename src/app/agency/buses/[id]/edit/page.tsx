'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const BUS_MOCKS: Record<string, any> = {
  '1': { name: 'Bus VIP 01', licensePlate: 'GA-001-AB', capacity: 40, type: 'VIP', status: 'active' },
  '2': { name: 'Bus Classique 02', licensePlate: 'GA-002-AB', capacity: 50, type: 'Classique', status: 'active' },
};

export default function EditBusPage() {
  const { id } = useParams();
  const router = useRouter();
  const [bus, setBus] = useState({
    name: '',
    licensePlate: '',
    capacity: 40,
    type: 'VIP',
    status: 'active',
  });

  useEffect(() => {
    if (id && BUS_MOCKS[id]) {
      setBus(BUS_MOCKS[id]);
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('Bus mis à jour avec succès');
    router.push('/agency/buses');
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Modifier le bus</h1>
              <p className="text-text-light">Ajustez les informations du bus existant.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Nom du bus</span>
                  <input
                    type="text"
                    value={bus.name}
                    onChange={(event) => setBus({ ...bus, name: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Immatriculation</span>
                  <input
                    type="text"
                    value={bus.licensePlate}
                    onChange={(event) => setBus({ ...bus, licensePlate: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Capacité</span>
                  <input
                    type="number"
                    min={10}
                    value={bus.capacity}
                    onChange={(event) => setBus({ ...bus, capacity: Number(event.target.value) })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-dark">Type de bus</span>
                  <select
                    value={bus.type}
                    onChange={(event) => setBus({ ...bus, type: event.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Classique">Classique</option>
                    <option value="Economique">Economique</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-dark">Statut</span>
                <select
                  value={bus.status}
                  onChange={(event) => setBus({ ...bus, status: event.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="active">Actif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactif</option>
                </select>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/agency/buses')}
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
