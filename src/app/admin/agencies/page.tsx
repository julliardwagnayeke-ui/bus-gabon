'use client';

import { Suspense, useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { usePendingAgencies, useApproveAgency, useRejectAgency } from '@/hooks/useAdmin';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

function AgenciesContent() {
  const { data: agencies, isLoading } = usePendingAgencies();
  const approveAgencyMutation = useApproveAgency();
  const rejectAgencyMutation = useRejectAgency();
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectionAgencyId, setRejectionAgencyId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gestion des agences</h1>
        <p className="text-slate-600 mt-2">Validez les agences en attente de review</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Agence</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Statut</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agencies && agencies.length > 0 ? (
                agencies.map((agency: any) => (
                  <tr key={agency.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{agency.name}</p>
                        <p className="text-sm text-slate-500">{agency.contactInfo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {agency.contactInfo}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        En attente
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() =>
                            approveAgencyMutation.mutate(agency.id)
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setRejectionAgencyId(agency.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Rejeter"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Aucune agence en attente de validation
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminAgenciesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Chargement...</div>}>
        <AgenciesContent />
      </Suspense>
    </AdminLayout>
  );
}
