import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Plus, Edit2, Eye } from 'lucide-react';
import { getAgencyDepartures, createDeparture, updateDeparture } from '../../services/departures';
import { getAgencyRoutes } from '../../services/routes';
import { getAgencyBuses } from '../../services/buses';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export const DEPARTURE_STATUS = {
  draft:     { label: 'Brouillon', color: 'gray' },
  published: { label: 'Publié',    color: 'blue' },
  closed:    { label: 'Fermé',     color: 'amber' },
  boarding:  { label: 'Embarquement', color: 'amber' },
  departed:  { label: 'Parti',     color: 'purple' },
  completed: { label: 'Terminé',   color: 'gray' },
  cancelled: { label: 'Annulé',    color: 'red' },
};
const today = format(new Date(), 'yyyy-MM-dd');

export default function AgencyDepartures() {
  const { agencyId } = useApp();
  const [departures, setDepartures] = useState([]);
  const [routes,     setRoutes]     = useState([]);
  const [buses,      setBuses]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const emptyForm = { routeId: '', busId: '', departureDate: today, departureTime: '07:00', estimatedArrivalTime: '', totalSeats: '', maxTicketsPerOrder: 4, status: 'published' };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    Promise.all([
      getAgencyDepartures(agencyId),
      getAgencyRoutes(agencyId),
      getAgencyBuses(agencyId),
    ]).then(([deps, rts, bs]) => {
      setDepartures(deps);
      setRoutes(rts.filter(r => r.status === 'active'));
      setBuses(bs.filter(b => b.status === 'active'));
    }).finally(() => setLoading(false));
  }, [agencyId]);

  function openCreate() { setEditing(null); setForm(emptyForm); setModal(true); }
  function openEdit(d)  { setEditing(d.id); setForm({ routeId: d.routeId || '', busId: d.busId || '', departureDate: d.departureDate, departureTime: d.departureTime, estimatedArrivalTime: d.estimatedArrivalTime || '', totalSeats: d.totalSeats, maxTicketsPerOrder: d.maxTicketsPerOrder || 4, status: d.status }); setModal(true); }

  async function handleSave() {
    const data = { ...form, totalSeats: +form.totalSeats, maxTicketsPerOrder: +form.maxTicketsPerOrder, agencyId };
    setSaving(true);
    try {
      if (editing) { await updateDeparture(editing, data); setDepartures(ds => ds.map(d => d.id === editing ? { ...d, ...data } : d)); }
      else { const ref = await createDeparture(agencyId, data); setDepartures(ds => [{ id: ref.id, ...data }, ...ds]); }
      setModal(false);
    } catch (err) { console.warn('[AgencyDepartures] save failed', err); }
    finally { setSaving(false); }
  }

  const routeLabel = (id) => { const r = routes.find(r => r.id === id); return r ? `${r.originCity} → ${r.destinationCity}` : id; };
  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Départs ({departures.length})</h1>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4" /> Ajouter</Button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : departures.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <CalendarClock className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">Aucun départ programmé.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Ligne</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Date</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Heure</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Places (vendu/total)</th>
                <th className="text-left px-4 py-3 text-xs text-text-muted font-semibold">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {departures.map(d => (
                <tr key={d.id} className="border-t border-border hover:bg-surface-alt">
                  <td className="px-4 py-3 font-medium">{routeLabel(d.routeId)}</td>
                  <td className="px-4 py-3 text-text-light">{d.departureDate}</td>
                  <td className="px-4 py-3">{d.departureTime}</td>
                  <td className="px-4 py-3 text-text-light">{d.soldSeats ?? 0}/{d.openSeats ?? 0}</td>
                  <td className="px-4 py-3"><Badge color={(DEPARTURE_STATUS[d.status] || {}).color || 'gray'}>{(DEPARTURE_STATUS[d.status] || {}).label || d.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/agence/departs/${d.id}`} className="p-1.5 rounded-lg hover:bg-surface-alt" title="Détail / manifeste"><Eye className="w-4 h-4 text-text-muted" /></Link>
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-surface-alt" title="Modifier"><Edit2 className="w-4 h-4 text-text-muted" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le départ' : 'Ajouter un départ'}>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-dark mb-1 block">Ligne</label>
            <select value={form.routeId} onChange={e => setForm(f => ({ ...f, routeId: e.target.value }))} className={inputClass + ' bg-white'}>
              <option value="">Choisir une ligne…</option>
              {routes.map(r => <option key={r.id} value={r.id}>{r.originCity} → {r.destinationCity}</option>)}
            </select>
          </div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Bus</label>
            <select value={form.busId} onChange={e => setForm(f => ({ ...f, busId: e.target.value }))} className={inputClass + ' bg-white'}>
              <option value="">Choisir un bus…</option>
              {buses.map(b => <option key={b.id} value={b.id}>{b.name} ({b.capacity} places)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-dark mb-1 block">Date</label><input type="date" value={form.departureDate} min={today} onChange={e => setForm(f => ({ ...f, departureDate: e.target.value }))} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-dark mb-1 block">Heure départ</label><input type="time" value={form.departureTime} onChange={e => setForm(f => ({ ...f, departureTime: e.target.value }))} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-dark mb-1 block">Heure arrivée</label><input type="time" value={form.estimatedArrivalTime} onChange={e => setForm(f => ({ ...f, estimatedArrivalTime: e.target.value }))} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-dark mb-1 block">Places ouvertes</label><input type="number" min="1" value={form.totalSeats} onChange={e => setForm(f => ({ ...f, totalSeats: e.target.value }))} className={inputClass} /></div>
          </div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Max billets/commande</label>
            <select value={form.maxTicketsPerOrder} onChange={e => setForm(f => ({ ...f, maxTicketsPerOrder: +e.target.value }))} className={inputClass + ' bg-white'}>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <Button onClick={handleSave} loading={saving} className="w-full mt-2">Enregistrer</Button>
        </div>
      </Modal>
    </div>
  );
}
