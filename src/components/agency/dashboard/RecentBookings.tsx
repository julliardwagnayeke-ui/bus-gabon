'use client';

import { ShoppingCart, CheckCircle, Clock } from 'lucide-react';

interface RecentBooking {
  id: string;
  code: string;
  client: string;
  route: string;
  tickets: number;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  time: string;
}

interface RecentBookingsProps {
  bookings: RecentBooking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  const getStatusColor = (status: string) => {
    const colors: any = {
      paid: 'bg-success/10 text-success',
      pending: 'bg-warning/10 text-warning',
      failed: 'bg-danger/10 text-danger',
    };
    return colors[status] || 'bg-surface-alt text-text';
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" /> Réservations récentes
      </h3>

      {bookings.length === 0 ? (
        <p className="text-text-light text-center py-8">Aucune réservation</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-semibold text-text-light">Code</th>
                <th className="text-left py-2 font-semibold text-text-light">Client</th>
                <th className="text-left py-2 font-semibold text-text-light">Billets</th>
                <th className="text-left py-2 font-semibold text-text-light">Montant</th>
                <th className="text-left py-2 font-semibold text-text-light">Statut</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-surface transition">
                  <td className="py-3 font-semibold text-dark">{booking.code}</td>
                  <td className="py-3 text-text">{booking.client}</td>
                  <td className="py-3 text-text">{booking.tickets}</td>
                  <td className="py-3 font-semibold text-dark">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(booking.amount)}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus === 'paid' ? '✓ Payé' : booking.paymentStatus === 'pending' ? '⏳ En attente' : '✕ Échoué'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
