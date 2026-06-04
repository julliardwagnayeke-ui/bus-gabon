'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useCommissionsSummary } from '@/hooks/useAdmin';
import { Loader } from 'lucide-react';

export default function AdminCommissionsPage() {
  const { data: commissions, isLoading } = useCommissionsSummary();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Commissions et revenus</h1>
          <p className="text-slate-600 mt-2">Visualisez les commissions de la plateforme</p>
        </div>

        {commissions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
              <p className="text-slate-600 text-sm font-medium">Commissions totales</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {(commissions.totalCommissions / 1000000).toFixed(1)}M FCFA
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
              <p className="text-slate-600 text-sm font-medium">Frais utilisateur</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {(commissions.totalUserFees / 1000000).toFixed(1)}M FCFA
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
              <p className="text-slate-600 text-sm font-medium">Revenu total</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {(commissions.totalPlatformRevenue / 1000000).toFixed(1)}M FCFA
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Commissions par agence</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Agence</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions?.commissionByAgency?.map((item: any) => (
                  <tr key={item.agencyId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.agencyName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {(item.commission / 1000).toFixed(0)}K FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
