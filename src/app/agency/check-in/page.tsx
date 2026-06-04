'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Camera, Type } from 'lucide-react';
import { useState } from 'react';

export default function CheckInPage() {
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({
      status: 'success',
      ticket: 'TKT-2026-001',
      passenger: 'Jean Mvogo',
      route: 'Libreville → Oyem',
      time: '07h30',
      baggage: 1,
    });
  };

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-dark mb-2">Scanner Billet</h1>
              <p className="text-text-light">Validez l'embarquement des passagers</p>
            </div>

            <div className="max-w-2xl">
              {/* QR Scanner */}
              <div className="bg-white rounded-2xl border border-border p-8 mb-6">
                <h2 className="text-xl font-bold text-dark mb-6">Scanner QR Code</h2>
                <div className="bg-dark rounded-lg p-12 mb-6 flex items-center justify-center text-white text-center">
                  <div>
                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm opacity-75">Scannez le QR code du billet</p>
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="bg-white rounded-2xl border border-border p-8">
                <h2 className="text-xl font-bold text-dark mb-6">Saisie manuelle</h2>
                <form onSubmit={handleCheckIn} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Code du billet ou réservation</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        placeholder="TKT-2026-001"
                        className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                      >
                        Vérifier
                      </button>
                    </div>
                  </div>
                </form>

                {result && (
                  <div className="mt-8 p-6 bg-success/10 border border-success rounded-lg">
                    <h3 className="font-bold text-success mb-4">✓ Billet valide</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold">Passager :</span> {result.passenger}
                      </p>
                      <p>
                        <span className="font-semibold">Trajet :</span> {result.route}
                      </p>
                      <p>
                        <span className="font-semibold">Heure départ :</span> {result.time}
                      </p>
                      <p>
                        <span className="font-semibold">Bagages :</span> {result.baggage}
                      </p>
                    </div>
                    <button className="mt-4 w-full px-4 py-2 bg-success text-white rounded-lg font-semibold hover:bg-success/90 transition">
                      Valider l'embarquement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
