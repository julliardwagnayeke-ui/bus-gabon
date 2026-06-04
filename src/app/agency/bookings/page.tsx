'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Eye, Download, X } from 'lucide-react';

const MOCK_BOOKINGS = [
  {
    id: '1',
    code: 'RES-2026-001',
    client: 'Jean Mvogo',
    phone: '+241 06 XX XX XX',
    route: 'Libreville → Oyem',
    date: '2026-05-20',
    tickets: 2,
    amount: 20400,
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
  },
];

export default function BookingsPage() {
  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Réservations</h1>
              <p className="text-text-light">Gérez toutes les réservations de votre agence</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold text-text-light">Code</th>
                      <th className="text-left py-3 font-semibold text-text-light">Client</th>
                      <th className="text-left py-3 font-semibold text-text-light">Trajet</th>
                      <th className="text-left py-3 font-semibold text-text-light">Billets</th>
                      <th className="text-left py-3 font-semibold text-text-light">Montant</th>
                      <th className="text-left py-3 font-semibold text-text-light">Paiement</th>
                      <th className="text-left py-3 font-semibold text-text-light">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BOOKINGS.map((booking) => (
                      <tr key={booking.id} className="border-b border-border hover:bg-surface transition">
                        <td className="py-4 font-semibold text-dark">{booking.code}</td>
                        <td className="py-4 text-text">{booking.client}</td>
                        <td className="py-4 text-text">{booking.route}</td>
                        <td className="py-4 font-semibold text-dark">{booking.tickets}</td>
                        <td className="py-4 font-semibold text-primary">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(booking.amount)}
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                            ✓ Payé
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
