'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function AdminDeparturesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Supervision des départs</h1>
          <p className="text-slate-600 mt-2">Supervisez tous les départs programmés</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
          <div className="h-96 flex items-center justify-center">
            <p className="text-slate-500">Table des départs (en construction)</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
