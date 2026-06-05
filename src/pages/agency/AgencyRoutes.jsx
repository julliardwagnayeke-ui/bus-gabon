import { useState, useEffect } from 'react';
import { Route, Plus, Trash2, Edit2, ArrowRight } from 'lucide-react';
import { getAgencyRoutes, createRoute, updateRoute, deleteRoute } from '../../services/routes';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../lib/cities';
import { formatPrice } from '../../lib/pricing';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function AgencyRoutes() {
  const { agencyId } = useApp();
  const [routes,  setRoutes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { originCity: '', destinationCity: '', basePrice: '', estimatedDuration: '', baggageIncluded: 1, baggageMaxWeight: 20, baggageExtraFee: 0, cancellationPolicy: '', status: 'active' };
  const [form,    setForm]    = useState(emptyForm);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    getAgencyRoutes(agencyId).then(setRoutes).finally(() => setLoading(false));
  }, [agencyId]);

  function openCreate() { setEditing(null); setForm(emptyForm); setModal(true); }
  function openEdit(r)  { setEditing(r.id); setForm({ originCity: r.originCity || '', destinationCity: r.destinationCity || '', basePrice: r.basePrice || '', estimatedDuration: r.estimatedDuration || '', baggageIncluded: r.baggageIncluded ?? 1, baggageMaxWeight: r.baggageMaxWeight ?? 20, baggageExtraFee: r.baggageExtraFee ?? 0, cancellationPolicy: r.cancellationPolicy || '', status: r.status || 'active' }); setModal(true); }

  async function handleSave() {
    const data = { ...form, basePrice: +form.basePrice, estimatedDuration: +form.estimatedDuration, baggageIncluded: +form.baggageIncluded, baggageMaxWeight: +form.baggageMaxWeight, baggageExtraFee: +form.baggageExtraFee };
    setSaving(true);
    try {
      if (editing) { await updateRoute(editing, data); setRoutes(rs => rs.map(r => r.id === editing ? { ...r, ...data } : r)); }
      else { const ref = await createRoute(agencyId, data); setRoutes(rs => [...rs, { id: ref.id, ...data, agencyId }]); }
      setModal(false);
    } catch (err) { console.warn('[AgencyRoutes] save failed', err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette ligne ?')) return;
    await deleteRoute(id);
    setRoutes(rs => rs.filter(r => r.id !== id));
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm';
  const selectClass = inputClass + ' bg-white';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">Lignes ({routes.length})</h1>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4" /> Ajouter</Button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Spinner /></div>
      : routes.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <Route className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">Aucune ligne créée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map(r => (
            <div key={r.id} className="flex items-center justify-between bg-white border border-border rounded-xl px-4 py-3">
              <div>
                <p className="font-semibold text-dark text-sm flex items-center gap-1.5">{r.originCity}<ArrowRight className="w-3 h-3" />{r.destinationCity}</p>
                <p className="text-xs text-text-muted">{formatPrice(r.basePrice)} · {r.baggageIncluded} bagages inclus</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={r.status === 'active' ? 'green' : 'gray'}>{r.status}</Badge>
                <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-surface-alt"><Edit2 className="w-4 h-4 text-text-muted" /></button>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-danger" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Modifier la ligne' : 'Ajouter une ligne'} maxWidth="max-w-lg">
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-dark mb-1 block">Ville départ</label><select value={form.originCity} onChange={e => setForm(f => ({ ...f, originCity: e.target.value }))} className={selectClass}><option value="">Choisir…</option>{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="text-xs font-medium text-dark mb-1 block">Ville arrivée</label><select value={form.destinationCity} onChange={e => setForm(f => ({ ...f, destinationCity: e.target.value }))} className={selectClass}><option value="">Choisir…</option>{CITIES.filter(c => c !== form.originCity).map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-dark mb-1 block">Prix (FCFA)</label><input type="number" min="0" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-dark mb-1 block">Durée (min)</label><input type="number" min="0" value={form.estimatedDuration} onChange={e => setForm(f => ({ ...f, estimatedDuration: e.target.value }))} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-dark mb-1 block">Bagages inclus</label><input type="number" min="0" value={form.baggageIncluded} onChange={e => setForm(f => ({ ...f, baggageIncluded: e.target.value }))} className={inputClass} /></div>
            <div><label className="text-xs font-medium text-dark mb-1 block">Poids max (kg)</label><input type="number" min="0" value={form.baggageMaxWeight} onChange={e => setForm(f => ({ ...f, baggageMaxWeight: e.target.value }))} className={inputClass} /></div>
          </div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Politique annulation</label><input value={form.cancellationPolicy} onChange={e => setForm(f => ({ ...f, cancellationPolicy: e.target.value }))} placeholder="Ex: Non remboursable" className={inputClass} /></div>
          <div><label className="text-xs font-medium text-dark mb-1 block">Statut</label><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectClass}><option value="active">Actif</option><option value="inactive">Inactif</option></select></div>
        </div>
        <Button onClick={handleSave} loading={saving} className="w-full mt-4">Enregistrer</Button>
      </Modal>
    </div>
  );
}
