'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

// Profil tel que renvoyé par /api/me (champs Prisma, camelCase).
interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  agencyId: string | null;
}

interface AppContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  /** Alias rétro-compat (ancien code) : expose `name`. */
  dbUser: { name: string | null; email: string; role: string; agencyId: string | null } | null;
  userRole: string | null;
  agencyId: string | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  isAgencyAgent: boolean;
  isPlatformAdmin: boolean;
  isClient: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/me');
      setProfile(res.ok ? await res.json() : null);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user);
      if (data.user) await loadProfile();
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile();
      else setProfile(null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const userRole = profile?.role ?? null;
  const agencyId = profile?.agencyId ?? null;

  const value: AppContextType = {
    user,
    profile,
    dbUser: profile
      ? { name: profile.fullName, email: profile.email, role: profile.role, agencyId: profile.agencyId }
      : null,
    userRole,
    agencyId,
    authLoading,
    logout,
    isAgencyAgent: !!agencyId,
    isPlatformAdmin: !!userRole && userRole !== 'client',
    isClient: userRole === 'client',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
