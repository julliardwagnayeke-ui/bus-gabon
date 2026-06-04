'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types/user';

interface AppContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: User | null;
  userRole: string | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  isAgencyAgent: boolean;
  isPlatformAdmin: boolean;
  isClient: boolean;
  agencyId: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [agencyId, setAgencyId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);

      if (u) {
        try {
          // Fetch user data from backend
          const token = await u.getIdToken();
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/me`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const userData = await res.json();
            setDbUser(userData);
            setUserRole(userData.role);
            setAgencyId(userData.agencyId || null);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      } else {
        setDbUser(null);
        setUserRole(null);
        setAgencyId(null);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setDbUser(null);
    setUserRole(null);
    setAgencyId(null);
  };

  const value = {
    firebaseUser,
    dbUser,
    userRole,
    authLoading,
    logout,
    isAgencyAgent: userRole === 'agency_agent' || userRole === 'agency_admin',
    isPlatformAdmin: userRole === 'platform_admin',
    isClient: userRole === 'client',
    agencyId,
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
