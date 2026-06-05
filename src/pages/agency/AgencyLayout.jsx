import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, Bus, Route, CalendarClock, BookOpen, ScanQrCode, BarChart3 } from 'lucide-react';
import { useAgencyData } from '../../hooks/useAgencyData';

const NAV = [
  { to: '/agence/dashboard',    icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/agence/profil',       icon: Building2,       label: 'Profil agence'   },
  { to: '/agence/bus',          icon: Bus,             label: 'Bus'             },
  { to: '/agence/lignes',       icon: Route,           label: 'Lignes'          },
  { to: '/agence/departs',      icon: CalendarClock,   label: 'Départs'         },
  { to: '/agence/reservations', icon: BookOpen,        label: 'Réservations'    },
  { to: '/agence/scanner',      icon: ScanQrCode,      label: 'Scanner billets' },
  { to: '/agence/ventes',       icon: BarChart3,       label: 'Ventes'          },
];

export default function AgencyLayout() {
  const { agency } = useAgencyData();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-dark text-white border-r border-white/10 min-h-screen flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-xs text-white/50 mb-0.5">Espace agence</p>
          <p className="font-bold text-sm truncate">{agency?.name || '—'}</p>
          {agency?.status === 'active' && (
            <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
              ● Actif
            </span>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${isActive ? 'bg-white/15 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Bottom nav mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark z-30 flex justify-around py-2 border-t border-white/10">
          {NAV.slice(0, 5).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${isActive ? 'text-white' : 'text-white/50'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
        <div className="pb-20 lg:pb-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
