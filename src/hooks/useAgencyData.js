import { useState, useEffect } from 'react';
import { getAgency } from '../services/agencies';
import { useApp } from '../context/AppContext';

export function useAgencyData() {
  const { agencyId } = useApp();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    setLoading(true);
    getAgency(agencyId)
      .then(setAgency)
      .catch(() => setAgency(null))
      .finally(() => setLoading(false));
  }, [agencyId]);

  return { agency, loading };
}
