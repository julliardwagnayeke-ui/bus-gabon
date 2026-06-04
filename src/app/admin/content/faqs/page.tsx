'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function AdminContentFAQPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des contenus</h1>
          <p className="text-slate-600 mt-2">Gérez les FAQ et les pages d'aide</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="h-96 flex items-center justify-center">
            <p className="text-slate-500">Gestion des contenus (en construction)</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
