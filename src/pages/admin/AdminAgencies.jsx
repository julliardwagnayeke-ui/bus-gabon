import { useState, useEffect } from 'react';
import { getAllAgencies, approveAgency, suspendAgency } from '../../services/agencies';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { ShieldCheck, Ban } from 'lucide-react';

export default function AdminAgencies() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');

  useEffect(() => { getAllAgencies().then(setAgencies).finally(() => setLoading(false)); }, []);

  async function handleApprove(id) {
    await approveAgency(id);
    setAgencies(as => as.map(a => a.id === id ? { ...a, status: 'active', verified: true, verifiedBadge: true } : a));
  }
  async function handleSuspend(id) {
    if (!confirm('Suspendre cette agence ?')) return;
    await suspendAgency(id);
    setAgencies(as => as.map(a => a.id === id ? { ...a, status: 'suspended' } : a));
  }

  const displayed = filter === 'all' ? agencies : agencies.filter(a => a.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Gestion des agences</h1>

      <div className="flex flex-wrap gap-2 mb-5">
        {['all','pending_review','active','suspended'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${filter === f ? 'bg-primary text-white' : 'bg-surface-alt text-text-light'}`}>
            {f === 'all' ? 'Toutes' : f === 'pending_review' ? 'En attente' : f === 'active' ? 'Actives' : 'Suspendues'}
            {f !== 'all' && ` (${agencies.filter(a => a.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : displayed.length === 0 ? <p className="text-text-muted text-sm py-10 text-center">Aucune agence.</p>
      : (
        <div className="space-y-3">
          {displayed.map(a => (
            <div key={a.id} className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 font-bold text-primary">
                  {a.name?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-dark text-sm truncate">{a.name}</p>
                  <p className="text-xs text-text-muted">{a.email} · {a.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge color={a.status === 'active' ? 'green' : a.status === 'pending_review' ? 'amber' : 'red'}>{a.status}</Badge>
                {a.status === 'pending_review' && (
                  <Button onClick={() => handleApprove(a.id)} size="sm" variant="success">
                    <ShieldCheck className="w-3.5 h-3.5" /> Approuver
                  </Button>
                )}
                {a.status === 'active' && (
                  <Button onClick={() => handleSuspend(a.id)} size="sm" variant="danger">
                    <Ban className="w-3.5 h-3.5" /> Suspendre
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
