'use client';

import { Suspense } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminStatsCards } from '@/components/admin/dashboard/AdminStatsCards';
import { AlertsPanel } from '@/components/admin/dashboard/AlertsPanel';
import { useDashboardSummary, useDashboardAlerts } from '@/hooks/useAdmin';
import { Loader } from 'lucide-react';

function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useDashboardSummary();
  const { data: alerts, isLoading: alertsLoading } = useDashboardAlerts();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-600 mt-2">Bienvenue dans l'espace administrateur de BusGabon</p>
      </div>

      {stats && <AdminStatsCards stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-500">Graphiques des ventes</p>
              <p className="text-sm text-slate-400 mt-2">(À implémenter avec Recharts)</p>
            </div>
          </div>
        </div>

        <div>
          {alerts && alertsLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : alerts ? (
            <AlertsPanel alerts={alerts} />
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Activité récente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-900">Agence approuvée</p>
              <p className="text-xs text-slate-500">Agence Express Bus</p>
            </div>
            <span className="text-xs text-slate-400">Il y a 2 heures</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Chargement...</div>}>
        <DashboardContent />
      </Suspense>
    </AdminLayout>
  );
}
