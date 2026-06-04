'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Download, Eye } from 'lucide-react';

const MOCK_TICKETS = [
  {
    id: '1',
    code: 'TKT-2026-001',
    reservation: 'RES-2026-001',
    passenger: 'Jean Mvogo',
    route: 'Libreville → Oyem',
    date: '2026-05-20',
    status: 'active',
    validated: false,
  },
];

export default function TicketsPage() {
  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Billets</h1>
              <p className="text-text-light">Consultez tous les billets émis par votre agence</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-text-light">Code</th>
                      <th className="text-left py-3 font-semibold text-text-light">Passager</th>
                      <th className="text-left py-3 font-semibold text-text-light">Trajet</th>
                      <th className="text-left py-3 font-semibold text-text-light">Date</th>
                      <th className="text-left py-3 font-semibold text-text-light">Statut</th>
                      <th className="text-left py-3 font-semibold text-text-light">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TICKETS.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-border hover:bg-surface transition">
                        <td className="py-4 font-semibold text-dark">{ticket.code}</td>
                        <td className="py-4 text-text">{ticket.passenger}</td>
                        <td className="py-4 text-text">{ticket.route}</td>
                        <td className="py-4 text-text">{ticket.date}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            Actif
                          </span>
                        </td>
                        <td className="py-4 flex gap-2">
                          <button className="p-2 hover:bg-surface rounded-lg transition text-primary">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-surface rounded-lg transition text-text-light">
                            <Download className="w-4 h-4" />
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
