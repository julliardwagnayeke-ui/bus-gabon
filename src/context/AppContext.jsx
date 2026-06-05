import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [userRole, setUserRole]   = useState('client');
  const [agencyId, setAgencyId]   = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Timeout for Firestore to prevent hanging on unreachable backend
          const fetchPromise = getDoc(doc(db, 'users', firebaseUser.uid));
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore timeout')), 5000)
          );
          
          const snap = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (isMounted) {
            if (snap && snap.exists()) {
              const data = snap.data();
              const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...data };
              setUser(userData);
              setUserRole(data.role || 'client');
              setAgencyId(data.agencyId || null);
            } else {
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'client' });
              setUserRole('client');
            }
          }
        } catch (err) {
          console.warn('[AppContext] Firestore fetch failed or timed out', err);
          if (isMounted) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'client' });
          }
        }
      } else {
        // Vérifier demo user en localStorage
        try {
          const stored = localStorage.getItem('busgabon_demo_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (isMounted) {
              setUser(parsed);
              setUserRole(parsed.role || 'client');
              setAgencyId(parsed.agencyId || null);
            }
          } else {
            if (isMounted) {
              setUser(null);
              setUserRole('client');
            }
          }
        } catch {
          if (isMounted) setUser(null);
        }
      }
      if (isMounted) setAuthLoading(false);
    });
    
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const loginDemo = useCallback((userData) => {
    setUser(userData);
    setUserRole(userData.role || 'client');
    setAgencyId(userData.agencyId || null);
    try { localStorage.setItem('busgabon_demo_user', JSON.stringify(userData)); }
    catch (err) { console.warn('[AppContext] localStorage write failed', err); }
  }, []);

  const logout = useCallback(async () => {
    try { await auth.signOut(); }
    catch (err) { console.warn('[AppContext] signOut failed', err); }
    setUser(null);
    setUserRole('client');
    setAgencyId(null);
    try { localStorage.removeItem('busgabon_demo_user'); }
    catch (err) { console.warn('[AppContext] localStorage remove failed', err); }
  }, []);

  const isClient       = userRole === 'client';
  const isAgencyAgent  = userRole === 'agency_agent' || userRole === 'agency_admin';
  const isAgencyAdmin  = userRole === 'agency_admin';
  const isPlatformAdmin = userRole === 'platform_admin';

  return (
    <AppContext.Provider value={{
      user, userRole, agencyId,
      authLoading,
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
