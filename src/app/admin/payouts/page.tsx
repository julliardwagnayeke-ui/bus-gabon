'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { usePayouts } from '@/hooks/useAdmin';
import { Loader } from 'lucide-react';

export default function AdminPayoutsPage() {
  const { data: payouts, isLoading } = usePayouts();

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
          <h1 className="text-3xl font-bold text-slate-900">Gestion des reversements</h1>
          <p className="text-slate-600 mt-2">Validez et payez les reversements aux agences</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Agence</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Période</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Montant net</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts && payouts.length > 0 ? (
                  payouts.map((payout: any) => (
                    <tr key={payout.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">Agence</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{payout.period}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {(payout.netAmount / 1000).toFixed(0)}K FCFA
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Aucun reversement
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
