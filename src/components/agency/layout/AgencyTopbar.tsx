'use client';

import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function AgencyTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="hidden md:flex items-center justify-between h-16 bg-white border-b border-border px-6 sticky top-0 z-30">
      <div className="flex-1">
        <h1 className="text-lg font-bold text-dark">Espace Agence BusGabon</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 hover:bg-surface-alt rounded-lg transition"
        >
          <Bell className="w-5 h-5 text-text" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-surface-alt rounded-lg transition"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-text hidden sm:inline">Admin</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-alt flex items-center gap-2">
                <Settings className="w-4 h-4" /> Paramètres
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-alt flex items-center gap-2 text-danger border-t border-border">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
