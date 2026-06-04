'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Save, Bell, Lock, Globe } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    language: 'fr',
    timezone: 'Africa/Libreville',
    notifications: true,
    email: 'contact@agency.com',
  });

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Paramètres</h1>
              <p className="text-text-light">Configurez votre espace agence</p>
            </div>

            {/* Language */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-dark">Langue</h2>
              </div>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-dark">Fuseau horaire</h2>
              </div>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary">
                <option>Africa/Libreville</option>
                <option>Africa/Douala</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-dark">Notifications</h2>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-dark">Sécurité</h2>
              </div>
              <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-surface transition font-semibold">
                Changer le mot de passe
              </button>
            </div>

            {/* Payout Settings */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold text-dark mb-6">Coordonnées de paiement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Méthode</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary">
                    <option>Mobile Money</option>
                    <option>Virement bancaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Numéro</label>
                  <input
                    type="text"
                    placeholder="+241 06 XX XX XX"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
