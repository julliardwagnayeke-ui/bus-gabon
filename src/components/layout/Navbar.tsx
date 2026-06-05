'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bus, Menu, X, Ticket, LayoutDashboard, User, LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAgencyAgent, isPlatformAdmin } = useApp();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-white text-xl">
          <Bus className="w-6 h-6" />
          <span>BusGabon</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/recherche" className={`px-4 py-2 rounded-full text-sm font-medium transition ${pathname === '/recherche' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
            Trajets
          </Link>
          <Link href="/verify-ticket" className={`px-4 py-2 rounded-full text-sm font-medium transition ${pathname === '/verify-ticket' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
            Vérifier un billet
          </Link>
          {!isAgencyAgent && (
            <Link href="/devenir-partenaire" className={`px-4 py-2 rounded-full text-sm font-medium transition ${pathname === '/devenir-partenaire' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              Devenir partenaire
            </Link>
          )}
          {isAgencyAgent && (
            <Link href="/agency/dashboard" className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition">
              Espace agence
            </Link>
          )}
          {isPlatformAdmin && (
            <Link href="/admin/dashboard" className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Admin
            </Link>
          )}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/mes-billets" className="text-sm font-medium hover:underline flex items-center gap-2">
                <Ticket className="w-4 h-4" /> Mes billets
              </Link>
              <button onClick={() => logout()} className="p-2 rounded-full hover:bg-white/10 transition" title="Déconnexion">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/connexion" className="px-4 py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition">
                Connexion
              </Link>
              <Link href="/inscription" className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-primary hover:bg-gray-100 transition shadow-sm">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 bg-primary overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              <Link href="/recherche" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
                Trajets
              </Link>
              <Link href="/verify-ticket" onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
                Vérifier un billet
              </Link>
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link href="/connexion" onClick={() => setMenuOpen(false)} className="flex-1 py-3 rounded-xl text-center text-sm font-semibold border border-white/30 text-white">
                    Connexion
                  </Link>
                  <Link href="/inscription" onClick={() => setMenuOpen(false)} className="flex-1 py-3 rounded-xl text-center text-sm font-semibold bg-white text-primary">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
