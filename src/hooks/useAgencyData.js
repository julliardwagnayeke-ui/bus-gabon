import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../context/AppContext';

export function useAgencyData() {
  const { agencyId } = useApp();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    getDoc(doc(db, 'agencies', agencyId))
      .then((snap) => snap.exists() ? setAgency({ id: snap.id, ...snap.data() }) : setAgency(null))
      .catch(() => setAgency(null))
      .finally(() => setLoading(false));
  }, [agencyId]);

  return { agency, loading };
}
