'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import BusTable from '@/components/agency/buses/BusTable';
import { useState, useEffect } from 'react';

const MOCK_BUSES = [
  {
    id: '1',
    name: 'Bus VIP 01',
    licensePlate: 'GA-001-AB',
    capacity: 40,
    type: 'VIP',
    status: 'active' as const,
    departureCount: 12,
  },
  {
    id: '2',
    name: 'Bus Classique 01',
    licensePlate: 'GA-002-AB',
    capacity: 50,
    type: 'Classique',
    status: 'active' as const,
    departureCount: 8,
  },
];

export default function BusesPage() {
  const [buses, setBuses] = useState(MOCK_BUSES);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr ?')) {
      setBuses(buses.filter(b => b.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Mes bus</h1>
              <p className="text-text-light">Gérez la flotte de votre agence</p>
            </div>
            <BusTable buses={buses} onDelete={handleDelete} />
          </div>
        </main>
      </div>
    </div>
  );
}
