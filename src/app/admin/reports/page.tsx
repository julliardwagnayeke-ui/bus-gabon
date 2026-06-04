'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function AdminReportsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rapports et statistiques</h1>
          <p className="text-slate-600 mt-2">Générez des rapports avancés sur la plateforme</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Rapport ventes global', icon: '📊' },
            { title: 'Rapport ventes par agence', icon: '🏢' },
            { title: 'Rapport paiements', icon: '💳' },
            { title: 'Rapport commissions', icon: '💰' },
            { title: 'Rapport reversements', icon: '🔄' },
            { title: 'Rapport support', icon: '🆘' },
          ].map((report, index) => (
            <button
              key={index}
              className="bg-white rounded-lg shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow text-left"
            >
              <p className="text-3xl mb-3">{report.icon}</p>
              <p className="font-semibold text-slate-900">{report.title}</p>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Générer →
              </button>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
