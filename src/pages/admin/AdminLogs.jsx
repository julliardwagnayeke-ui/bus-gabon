import { useState, useEffect } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getActivityLogs, ACTION_LABELS, ACTION_COLORS } from '../../services/activityLogs';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const ACTIONS = [
  { value: '',                   label: 'Toutes les actions' },
  { value: 'reservation.created', label: 'Réservations créées' },
  { value: 'payment.initiated',   label: 'Paiements initiés' },
  { value: 'payment.confirmed',   label: 'Paiements confirmés' },
  { value: 'ticket.validated',    label: 'Billets validés' },
  { value: 'agency.approved',     label: 'Agences approuvées' },
  { value: 'agency.suspended',    label: 'Agences suspendues' },
];

function formatTs(ts) {
  if (!ts) return '—';
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return format(date, 'd MMM yyyy · HH:mm:ss', { locale: fr });
  } catch {
    return '—';
  }
}

export default function AdminLogs() {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [error,   setError]   = useState('');

  async function load(action = filter) {
    setLoading(true);
    setError('');
    try {
      const data = await getActivityLogs({ limitCount: 100, action: action || undefined });
      setLogs(data);
    } catch (err) {
      setError('Impossible de charger les logs. Vérifiez les règles Firestore.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilter(e) {
    setFilter(e.target.value);
    load(e.target.value);
  }

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Journal d'activité</h1>
            <p className="text-sm text-text-muted">{logs.length} entrée{logs.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={() => load()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-text-light hover:text-dark hover:bg-surface-alt transition">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {/* Filtre */}
      <div className="mb-5">
        <select value={filter} onChange={handleFilter}
          className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary">
          {ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>

      {error && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <Activity className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-dark font-semibold mb-1">Aucun log</p>
          <p className="text-text-muted text-sm">Les actions importantes apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Heure</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden md:table-cell">Entité</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted hidden lg:table-cell">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-surface-alt/50 transition">
                  <td className="px-4 py-3 text-xs text-text-muted font-mono whitespace-nowrap">
                    {formatTs(log.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={ACTION_COLORS[log.action] || 'gray'}>
                      {ACTION_LABELS[log.action] || log.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {log.entityType && (
                      <span className="text-xs text-text-muted font-mono">
                        {log.entityType} · {log.entityId?.slice(-8) || '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {log.metadata && (
                      <span className="text-xs text-text-muted font-mono">
                        {Object.entries(log.metadata)
                          .filter(([, v]) => v !== null && v !== undefined)
                          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : v}`)
                          .join(' · ')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
