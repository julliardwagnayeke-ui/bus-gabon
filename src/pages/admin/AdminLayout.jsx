import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, CreditCard, TrendingUp, Users, MapPin } from 'lucide-react';

const NAV = [
  { to: '/admin',             icon: LayoutDashboard, label: 'Vue générale',   end: true },
  { to: '/admin/agences',     icon: Building2,       label: 'Agences' },
  { to: '/admin/paiements',   icon: CreditCard,      label: 'Paiements' },
  { to: '/admin/revenus',     icon: TrendingUp,      label: 'Revenus' },
  { to: '/admin/utilisateurs',icon: Users,           label: 'Utilisateurs' },
  { to: '/admin/villes',      icon: MapPin,          label: 'Villes' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex flex-col w-60 bg-dark text-white border-r border-white/10 min-h-screen flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-xs text-white/50 mb-0.5">Administration</p>
          <p className="font-bold text-sm">BusGabon</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${isActive ? 'bg-white/15 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-auto"><Outlet /></div>
    </div>
  );
}
