'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useSupportTickets } from '@/hooks/useAdmin';
import { Loader } from 'lucide-react';

export default function AdminSupportPage() {
  const { data: tickets, isLoading } = useSupportTickets();

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
          <h1 className="text-3xl font-bold text-slate-900">Support client et agence</h1>
          <p className="text-slate-600 mt-2">Gérez tous les tickets de support</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">N°</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Sujet</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Priorité</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets && tickets.length > 0 ? (
                  tickets.map((ticket: any) => (
                    <tr key={ticket.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{ticket.number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{ticket.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Aucun ticket de support
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
