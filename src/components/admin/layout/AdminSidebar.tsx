'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Bus, Route, Calendar, Ticket, CreditCard, DollarSign, BarChart3, Settings, Shield, FileText, HelpCircle, Bell, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const adminMenuItems = [
  { label: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Agences', href: '/admin/agencies', icon: Building2 },
  { label: 'Utilisateurs', href: '/admin/users', icon: Users },
  { label: 'Bus', href: '/admin/buses', icon: Bus },
  { label: 'Lignes', href: '/admin/routes', icon: Route },
  { label: 'Départs', href: '/admin/departures', icon: Calendar },
  { label: 'Réservations', href: '/admin/bookings', icon: Ticket },
  { label: 'Billets', href: '/admin/tickets', icon: Ticket },
  { label: 'Paiements', href: '/admin/payments', icon: CreditCard },
  { label: 'Commissions', href: '/admin/commissions', icon: DollarSign },
  { label: 'Reversements', href: '/admin/payouts', icon: BarChart3 },
  { label: 'Support', href: '/admin/support', icon: HelpCircle },
  { label: 'Contenus', href: '/admin/content/faqs', icon: FileText },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
  { label: 'Sécurité', href: '/admin/security/logs', icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useApp();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            BG
          </div>
          <div>
            <h1 className="font-bold text-lg">BusGabon</h1>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </Link>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
