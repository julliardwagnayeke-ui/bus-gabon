import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { getSettings, SETTINGS_DEFAULTS } from '../services/settings';

const AppContext = createContext(null);

// Rôles « plateforme » de notre schéma Supabase.
const ADMIN_ROLES = ['super_admin', 'finance_admin', 'support_admin', 'operations_admin', 'content_admin'];

// Mappe le profil Supabase vers le modèle de rôle attendu par l'app Vite.
function mapRole(profile) {
  if (!profile) return 'client';
  if (profile.agency_id) return 'agency_admin';
  if (ADMIN_ROLES.includes(profile.role)) return 'platform_admin';
  return 'client';
}

export function AppProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [userRole, setUserRole]   = useState('client');
  const [agencyId, setAgencyId]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [platformSettings, setPlatformSettings] = useState(SETTINGS_DEFAULTS);

  // Paramètres plateforme (commission, frais…) chargés une fois.
  useEffect(() => {
    getSettings().then(setPlatformSettings).catch(() => {});
  }, []);

  const applySession = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      // Repli : compte démo stocké en localStorage (raccourci de test)
      try {
        const stored = localStorage.getItem('busgabon_demo_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setUserRole(parsed.role || 'client');
          setAgencyId(parsed.agencyId || null);
          return;
        }
      } catch { /* ignore */ }
      setUser(null);
      setUserRole('client');
      setAgencyId(null);
      return;
    }

    // Récupère le profil (RLS : lecture de son propre profil)
    let profile = null;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, agency_id')
        .eq('id', sessionUser.id)
        .single();
      profile = data;
    } catch { /* profil indisponible → rôle client par défaut */ }

    const role = mapRole(profile);
    setUser({
      uid: sessionUser.id,
      email: sessionUser.email,
      name: profile?.full_name || sessionUser.user_metadata?.full_name || sessionUser.email,
      role,
      agencyId: profile?.agency_id || null,
    });
    setUserRole(role);
    setAgencyId(profile?.agency_id || null);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      await applySession(session?.user ?? null);
      if (mounted) setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      await applySession(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const loginDemo = useCallback((userData) => {
    setUser(userData);
    setUserRole(userData.role || 'client');
    setAgencyId(userData.agencyId || null);
    try { localStorage.setItem('busgabon_demo_user', JSON.stringify(userData)); }
    catch (err) { console.warn('[AppContext] localStorage write failed', err); }
  }, []);

  const logout = useCallback(async () => {
    try { await supabase.auth.signOut(); }
    catch (err) { console.warn('[AppContext] signOut failed', err); }
    setUser(null);
    setUserRole('client');
    setAgencyId(null);
    try { localStorage.removeItem('busgabon_demo_user'); }
    catch (err) { console.warn('[AppContext] localStorage remove failed', err); }
  }, []);

  const isClient        = userRole === 'client';
  const isAgencyAgent   = userRole === 'agency_agent' || userRole === 'agency_admin';
  const isAgencyAdmin   = userRole === 'agency_admin';
  const isPlatformAdmin = userRole === 'platform_admin';

  return (
    <AppContext.Provider value={{
      user, userRole, agencyId,
      authLoading,
      platformSettings, setPlatformSettings,
      loginDemo, logout,
      isClient, isAgencyAgent, isAgencyAdmin, isPlatformAdmin,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans AppProvider');
  return ctx;
}
