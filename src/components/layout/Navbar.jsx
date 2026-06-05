import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Menu, X, Ticket, LayoutDashboard, User, LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const { user, logout, isAgencyAgent, isPlatformAdmin } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
    setDropdownOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-white text-xl" onClick={() => setMenuOpen(false)}>
          <Bus className="w-6 h-6" />
          BusGabon
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/recherche" className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition">
            Trajets
          </Link>
          <Link to="/verifier-billet" className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition">
            Vérifier un billet
          </Link>
          {isAgencyAgent && (
            <Link to="/agence/dashboard" className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition">
              Espace agence
            </Link>
          )}
          {isPlatformAdmin && (
            <Link to="/admin" className="px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition">
              Admin
            </Link>
          )}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                aria-label="Menu utilisateur"
              >
                <div className="w-7 h-7 rounded-full bg-white text-primary flex items-center justify-center">
                  <span className="text-xs font-bold">{user.name?.[0] || user.email?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-white max-w-24 truncate">{user.name || user.email}</span>
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-12 bg-white rounded-2xl border border-border shadow-xl py-2 w-52 z-20 text-dark animate-scale-in">
                    <Link to="/mes-billets" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-alt transition">
                      <Ticket className="w-4 h-4 text-text-muted" /> Mes billets
                    </Link>
                    <Link to="/profil" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-alt transition">
                      <User className="w-4 h-4 text-text-muted" /> Profil
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/connexion" className="px-4 py-2 rounded-full text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition">
                Connexion
              </Link>
              <Link to="/inscription" className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-primary hover:bg-gray-100 transition shadow-sm">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/20 bg-primary px-4 py-4 flex flex-col gap-2 animate-slide-up shadow-lg">
          <Link to="/recherche" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
            Trajets
          </Link>
          <Link to="/verifier-billet" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
            Vérifier un billet
          </Link>
          {user && (
            <>
              <Link to="/mes-billets" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
                <Ticket className="w-4 h-4 opacity-70" /> Mes billets
              </Link>
              <Link to="/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
                <User className="w-4 h-4 opacity-70" /> Profil
              </Link>
            </>
          )}
          {isAgencyAgent && (
            <Link to="/agence/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
              <LayoutDashboard className="w-4 h-4 opacity-70" /> Espace agence
            </Link>
          )}
          {isPlatformAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white text-sm font-medium">
              <ShieldCheck className="w-4 h-4 opacity-70" /> Admin
            </Link>
          )}
          <div className="border-t border-white/20 pt-3 mt-1">
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 text-sm font-medium w-full">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/connexion" onClick={() => setMenuOpen(false)} className="flex-1 py-3 rounded-full text-center text-sm font-semibold border border-white/30 text-white hover:bg-white/10">
                  Connexion
                </Link>
                <Link to="/inscription" onClick={() => setMenuOpen(false)} className="flex-1 py-3 rounded-full text-center text-sm font-semibold bg-white text-primary hover:bg-gray-100">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
