'use client';

import { useApp } from '@/context/AppContext';
import { User, Bell, Settings, LogOut } from 'lucide-react';

export function AdminTopbar() {
  const { dbUser, logout } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed right-0 left-64 top-0 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900">Espace Administrateur</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{dbUser?.name || 'Admin'}</p>
            <p className="text-xs text-slate-500">Administrateur</p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {dbUser?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
