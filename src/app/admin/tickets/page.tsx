'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function AdminTicketsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des billets</h1>
          <p className="text-slate-600 mt-2">Contrôlez tous les billets générés</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="h-96 flex items-center justify-center">
            <p className="text-slate-500">Table des billets (en construction)</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
