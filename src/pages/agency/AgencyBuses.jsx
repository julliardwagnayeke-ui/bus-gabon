import { useState, useEffect } from 'react';
import { Bus, Plus, Trash2, Edit2 } from 'lucide-react';
import { getAgencyBuses, createBus, updateBus, deleteBus } from '../../services/buses';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const STATUS_COLOR = { active: 'green', inactive: 'gray', maintenance: 'amber' };

export default function AgencyBuses() {
  const { agencyId } = useApp();
  const [buses,   setBuses]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ name: '', plateNumber: '', capacity: 50, status: 'active' });
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    getAgencyBuses(agencyId).then(setBuses).finally(() => setLoading(false));
  }, [agencyId]);

  function openCreate() { setEditing(null); setForm({ name: '', plateNumber: '', capacity: 50, status: 'active' }); setModal(true); }
  function openEdit(b)  { setEditing(b.id); setForm({ name: b.name, plateNumber: b.plateNumber || '', capacity: b.capacity || 50, status: b.status || 'active' }); setModal(true); }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateBus(editing, form);
        setBuses(bs => bs.map(b => b.id === editing ? { ...b, ...form } : b));
      } else {
        const ref = await createBus(agencyId, form);
        setBuses(bs => [...bs, { id: ref.id, ...form, agencyId }]);
      }
      setModal(false);
    } catch (err) { console.warn('[AgencyBuses] save failed', err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce bus ?')) return;
    await deleteBus(id);
    setBuses(bs => bs.filter(b => b.id !== id));
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Bus ({buses.length})</h1>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4" /> Ajouter</Button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : buses.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <Bus className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">Aucun bus enregistré.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buses.map(b => (
            <div key={b.id} className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3">
              <div>
                <p className="font-semibold text-dark text-sm">{b.name}</p>
                <p className="text-xs text-text-muted">{b.plateNumber} · {b.capacity} places</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={STATUS_COLOR[b.status] || 'gray'}>{b.status}</Badge>
                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-surface-alt"><Edit2 className="w-4 h-4 text-text-muted" /></button>
                <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-danger" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier le bus' : 'Ajouter un bus'}>
        <div className="space-y-3">
          <div><label className="text-xs font-medium text-dark mb-1 block">Nom du bus</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} /></div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Immatriculation</label><input value={form.plateNumber} onChange={e => setForm(f => ({ ...f, plateNumber: e.target.value }))} className={inputClass} /></div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Capacité</label><input type="number" min="1" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} className={inputClass} /></div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Statut</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={inputClass + ' bg-white'}>
              <option value="active">Actif</option><option value="inactive">Inactif</option><option value="maintenance">Maintenance</option>
            </select>
          </div>
          <Button onClick={handleSave} loading={saving} className="w-full mt-2">Enregistrer</Button>
        </div>
      </Modal>
    </div>
  );
}
