'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import AgencyStatsCards from '@/components/agency/dashboard/AgencyStatsCards';
import TodayDepartures from '@/components/agency/dashboard/TodayDepartures';
import RecentBookings from '@/components/agency/dashboard/RecentBookings';
import LoadingState from '@/components/agency/common/LoadingState';
import { useState, useEffect } from 'react';

export default function AgencyDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        todaySales: 340000,
        todayTickets: 34,
        activeDepartures: 4,
        netRevenue: 323000,
        commission: 17000,
        departures: [
          {
            id: '1',
            route: 'Libreville → Oyem',
            time: '07h30',
            bus: 'Bus VIP 01',
            soldSeats: 24,
            openSeats: 28,
            status: 'published',
          },
          {
            id: '2',
            route: 'Libreville → Franceville',
            time: '09h00',
            bus: 'Bus Classique 02',
            soldSeats: 18,
            openSeats: 30,
            status: 'published',
          },
        ],
        bookings: [
          {
            id: '1',
            code: 'RES-2026-001',
            client: 'Jean Mvogo',
            route: 'Libreville → Oyem',
            tickets: 2,
            amount: 20400,
            paymentStatus: 'paid',
            time: '10h35',
          },
          {
            id: '2',
            code: 'RES-2026-002',
            client: 'Marie Nkogo',
            route: 'Libreville → Franceville',
            tickets: 1,
            amount: 25200,
            paymentStatus: 'pending',
            time: '11h20',
          },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Tableau de bord</h1>
              <p className="text-text-light">Bienvenue dans votre espace agence</p>
            </div>

            {/* Stats */}
            <AgencyStatsCards
              todaySales={stats?.todaySales}
              todayTickets={stats?.todayTickets}
              activeDepartures={stats?.activeDepartures}
              netRevenue={stats?.netRevenue}
              commission={stats?.commission}
            />

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-6">
              <TodayDepartures departures={stats?.departures} />
              <RecentBookings bookings={stats?.bookings} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
