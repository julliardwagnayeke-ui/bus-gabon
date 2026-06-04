'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bus, MapPin, Plane, BookOpen, QrCode, BarChart3, DollarSign, Users, Settings, HelpCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: '/agency/dashboard' },
  { label: 'Profil agence', icon: Settings, href: '/agency/profile' },
  { label: 'Mes bus', icon: Bus, href: '/agency/buses' },
  { label: 'Mes lignes', icon: MapPin, href: '/agency/routes' },
  { label: 'Mes départs', icon: Plane, href: '/agency/departures' },
  { label: 'Réservations', icon: BookOpen, href: '/agency/bookings' },
  { label: 'Billets', icon: QrCode, href: '/agency/tickets' },
  { label: 'Scanner billet', icon: QrCode, href: '/agency/check-in' },
  { label: 'Ventes', icon: BarChart3, href: '/agency/sales' },
  { label: 'Reversements', icon: DollarSign, href: '/agency/payouts' },
  { label: 'Utilisateurs', icon: Users, href: '/agency/users' },
  { label: 'Paramètres', icon: Settings, href: '/agency/settings' },
  { label: 'Support', icon: HelpCircle, href: '/agency/support' },
];

export default function AgencySidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark border-r border-border sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-white">BusGabon</h2>
          <p className="text-xs text-text-light mt-1">Espace Agence</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-light hover:bg-surface-alt'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full px-4 py-2 bg-surface-alt text-sm font-semibold text-text rounded-lg hover:bg-border transition">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-dark rounded-lg text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 top-0 w-64 h-screen bg-dark border-r border-border overflow-y-auto">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-white">BusGabon</h2>
                <p className="text-xs text-text-light mt-1">Espace Agence</p>
              </div>

              <nav className="p-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? 'bg-primary text-white font-semibold'
                          : 'text-text-light hover:bg-surface-alt'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
