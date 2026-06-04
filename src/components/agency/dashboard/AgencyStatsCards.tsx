'use client';

import StatCard from '@/components/agency/common/StatCard';
import { DollarSign, ShoppingCart, Plane, AlertCircle } from 'lucide-react';

interface AgencyStatsCardsProps {
  todaySales: number;
  todayTickets: number;
  activeDepartures: number;
  netRevenue: number;
  commission: number;
}

export default function AgencyStatsCards({
  todaySales,
  todayTickets,
  activeDepartures,
  netRevenue,
  commission,
}: AgencyStatsCardsProps) {
  const formatCFA = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        icon={<ShoppingCart className="w-6 h-6" />}
        label="Billets vendus"
        value={todayTickets}
        change="12%"
        trend="up"
        color="success"
      />
      <StatCard
        icon={<DollarSign className="w-6 h-6" />}
        label="Chiffre brut"
        value={formatCFA(todaySales)}
        change="8%"
        trend="up"
        color="primary"
      />
      <StatCard
        icon={<AlertCircle className="w-6 h-6" />}
        label="Commission (5%)"
        value={formatCFA(commission)}
        color="warning"
      />
      <StatCard
        icon={<DollarSign className="w-6 h-6" />}
        label="Net agence"
        value={formatCFA(netRevenue)}
        change="10%"
        trend="up"
        color="success"
      />
      <StatCard
        icon={<Plane className="w-6 h-6" />}
        label="Départs actifs"
        value={activeDepartures}
        color="primary"
      />
    </div>
  );
}
