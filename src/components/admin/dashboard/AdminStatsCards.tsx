'use client';

import { AdminStats } from '@/types/admin';
import { TrendingUp, Users, DollarSign, CreditCard } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  trend?: number;
}

function StatCard({ title, value, subtext, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">+{trend}% cette semaine</span>
        </div>
      )}
    </div>
  );
}

interface AdminStatsCardsProps {
  stats: AdminStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Réservations aujourd'hui"
        value={stats.totalReservations}
        icon={<Users className="w-6 h-6 text-blue-500" />}
        trend={12}
      />
      <StatCard
        title="Billets vendus"
        value={stats.totalTicketsSold}
        icon={<Ticket className="w-6 h-6 text-green-500" />}
        trend={8}
      />
      <StatCard
        title="Chiffre brut"
        value={`${(stats.grossRevenue / 1000000).toFixed(1)}M FCFA`}
        icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
        trend={15}
      />
      <StatCard
        title="Revenu plateforme"
        value={`${(stats.totalPlatformRevenue / 1000).toFixed(0)}K FCFA`}
        subtext={`Commission: ${(stats.platformCommission / 1000).toFixed(0)}K + Frais: ${(stats.userFees / 1000).toFixed(0)}K`}
        icon={<CreditCard className="w-6 h-6 text-purple-500" />}
        trend={20}
      />
    </div>
  );
}

function Ticket({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2--.9-2-2-2zM1 2v6h6V2H1zm6 12H1v6h6v-6zm6-7h-6v6h6V7zm0 12c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm6-7v6h6V7h-6zm0 12c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  );
}
