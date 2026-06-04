'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600 mt-2">Configurez les règles globales de la plateforme</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres financiers */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Paramètres financiers</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Commission plateforme (%)
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">Actuellement: 5%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Frais utilisateur (FCFA)
                </label>
                <input
                  type="number"
                  defaultValue={200}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">Actuellement: 200 FCFA par billet</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Devise
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option>XAF (Franc CFA)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Paramètres de réservation */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Réservations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Durée blocage réservation (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Billets max par réservation
                </label>
                <input
                  type="number"
                  defaultValue={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  disabled
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="rounded" />
                  <span className="text-sm font-medium text-slate-900">Autoriser réservations invité</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Sauvegarder les paramètres
        </button>
      </div>
    </AdminLayout>
  );
}
