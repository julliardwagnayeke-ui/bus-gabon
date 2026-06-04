'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Save, Upload } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Mon Agence de Transport',
    email: 'contact@agency.com',
    phone: '+241 06 XX XX XX',
    address: 'Libreville, Gabon',
    description: 'La meilleure agence de transport au Gabon',
  });

  const handleSave = () => {
    alert('Profil mis à jour');
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Profil Agence</h1>
              <p className="text-text-light">Gérez les informations publiques de votre agence</p>
            </div>

            <div className="bg-white rounded-2xl border border-border p-8 space-y-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-3">Logo</label>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-surface border-2 border-dashed border-border flex items-center justify-center">
                    <Upload className="w-6 h-6 text-text-light" />
                  </div>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-surface transition font-semibold">
                    Charger un logo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              {Object.entries(profile).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-dark mb-2 capitalize">
                    {key === 'name' ? 'Nom de l\'agence' : key}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    value={value}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              ))}

              {/* Policies */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Politique bagages</label>
                <textarea
                  placeholder="Décrivez vos conditions de bagages..."
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary h-32 resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                <Save className="w-4 h-4" /> Enregistrer les modifications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
