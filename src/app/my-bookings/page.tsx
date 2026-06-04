'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Ticket as TicketIcon, Eye, ChevronRight } from 'lucide-react';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { useUserBookings } from '@/hooks/useUserBookings';
import { formatCurrency, formatDate } from '@/lib/api';

export default function MyBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data: bookings, isLoading } = useUserBookings();

  const upcomingBookings = bookings?.filter(booking =>
    new Date(booking.departure.date) >= new Date() && booking.status === 'confirmed'
  ) || [];

  const pastBookings = bookings?.filter(booking =>
    new Date(booking.departure.date) < new Date() || booking.status !== 'confirmed'
  ) || [];

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Mes réservations</h1>
          <p className="text-text-light">
            Gérez vos billets et consultez votre historique
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm border border-border">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-primary text-white'
                : 'text-text-light hover:text-text'
            }`}
          >
            À venir ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'past'
                ? 'bg-primary text-white'
                : 'text-text-light hover:text-text'
            }`}
          >
            Historique ({pastBookings.length})
          </button>
        </div>

        {/* Bookings list */}
        {currentBookings.length === 0 ? (
          <EmptyState
            icon={<TicketIcon className="w-12 h-12" />}
            title={activeTab === 'upcoming' ? "Aucune réservation à venir" : "Aucun historique"}
            description={
              activeTab === 'upcoming'
                ? "Vous n'avez pas de réservations confirmées à venir."
                : "Vos réservations passées apparaîtront ici."
            }
            action={
              activeTab === 'upcoming' ? (
                <Button onClick={() => router.push('/')}>
                  Réserver un billet
                </Button>
              ) : null
            }
          />
        ) : (
          <div className="space-y-4">
            {currentBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {booking.departure.agency.name.split(' ').map(word => word[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">{booking.departure.agency.name}</h3>
                      <p className="text-sm text-text-light">
                        {booking.departure.originCity} → {booking.departure.destinationCity}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      booking.status === 'confirmed' ? 'success' :
                      booking.status === 'cancelled' ? 'error' : 'warning'
                    }
                  >
                    {booking.status === 'confirmed' ? 'Confirmé' :
                     booking.status === 'cancelled' ? 'Annulé' : 'En attente'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm">{formatDate(booking.departure.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{booking.departure.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{booking.passengers.length} passager{booking.passengers.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => router.push(`/ticket/${booking.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir le billet
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}