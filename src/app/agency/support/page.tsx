'use client';

import AgencySidebar from '@/components/agency/layout/AgencySidebar';
import AgencyTopbar from '@/components/agency/layout/AgencyTopbar';
import { Plus, Eye, Clock } from 'lucide-react';
import { useState } from 'react';

const MOCK_TICKETS = [
  {
    id: '1',
    code: 'SUP-2026-001',
    subject: 'Problème paiement réservation',
    status: 'open',
    priority: 'high',
    createdAt: '2026-05-15',
  },
];

export default function SupportPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex h-screen bg-surface">
      <AgencySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AgencyTopbar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-dark mb-2">Support</h1>
                <p className="text-text-light">Contacter l'équipe support de BusGabon</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                <Plus className="w-4 h-4" /> Nouvelle demande
              </button>
            </div>

            {/* New Ticket Form */}
            {showForm && (
              <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
                <h2 className="text-lg font-bold text-dark">Créer une demande</h2>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Type</label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary">
                    <option>Problème paiement</option>
                    <option>Problème réservation</option>
                    <option>Problème billet</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Sujet</label>
                  <input
                    type="text"
                    placeholder="Décrivez votre problème..."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Description</label>
                  <textarea
                    placeholder="Détails de votre demande..."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary h-32 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold">
                    Envoyer
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-surface transition font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Support Tickets */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold text-dark mb-6">Mes demandes</h2>
              <div className="space-y-3">
                {MOCK_TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-surface transition"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-dark">{ticket.code}</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            ticket.priority === 'high' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {ticket.priority === 'high' ? 'Urgent' : 'Normal'}
                        </span>
                      </div>
                      <p className="text-sm text-text-light">{ticket.subject}</p>
                      <p className="text-xs text-text-light mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ticket.createdAt}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-surface rounded-lg transition text-primary">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-lg font-bold text-dark mb-6">Questions fréquentes</h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'Comment fonctionne le système de commission ?',
                    a: 'BusGabon prend 5% de commission sur chaque billet vendu.',
                  },
                  {
                    q: 'Quand serai-je remboursé ?',
                    a: 'Les reversements sont effectués tous les 7 jours.',
                  },
                ].map((item, i) => (
                  <details
                    key={i}
                    className="border border-border rounded-lg overflow-hidden hover:border-primary/30 transition"
                  >
                    <summary className="p-4 cursor-pointer font-semibold text-dark hover:bg-surface">
                      {item.q}
                    </summary>
                    <p className="px-4 pb-4 text-text-light text-sm bg-surface">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
