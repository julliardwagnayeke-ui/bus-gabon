import { useState, useEffect } from 'react';
import { getAgency, updateAgency } from '../../services/agencies';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function AgencyProfile() {
  const { agencyId } = useApp();
  const [form, setForm]     = useState({ name: '', phone: '', email: '', address: '', description: '', baggagePolicy: '', cancellationPolicy: '', openingHours: '' });
  const [loading, setLoading]  = useState(true);
  const [saving,  setSaving]   = useState(false);
  const [saved,   setSaved]    = useState(false);

  useEffect(() => {
    if (!agencyId) { setLoading(false); return; }
    getAgency(agencyId).then(a => {
      if (a) setForm({ name: a.name || '', phone: a.phone || '', email: a.email || '', address: a.address || '', description: a.description || '', baggagePolicy: a.baggagePolicy || '', cancellationPolicy: a.cancellationPolicy || '', openingHours: a.openingHours || '' });
    }).finally(() => setLoading(false));
  }, [agencyId]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAgency(agencyId, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.warn('[AgencyProfile] save failed', err); }
    finally { setSaving(false); }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm';

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-6">Profil de l'agence</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white border border-border rounded-2xl p-6">
        {[
          { key: 'name',       label: 'Nom de l\'agence', placeholder: 'Transgabonaise Express' },
          { key: 'phone',      label: 'Téléphone',       placeholder: '+241 77 XX XX XX' },
          { key: 'email',      label: 'Email',           placeholder: 'contact@agence.ga', type: 'email' },
          { key: 'address',    label: 'Adresse / Point de départ', placeholder: 'Gare routière de Libreville' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-sm font-medium text-dark mb-1 block">{f.label}</label>
            <input type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className={inputClass} />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Description courte</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Décrivez votre agence…" className={inputClass + ' resize-none'} />
        </div>
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Politique bagages</label>
          <input value={form.baggagePolicy} onChange={e => set('baggagePolicy', e.target.value)} placeholder="Ex: 1 bagage 20kg inclus" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Politique annulation</label>
          <input value={form.cancellationPolicy} onChange={e => set('cancellationPolicy', e.target.value)} placeholder="Ex: Non remboursable" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-dark mb-1 block">Horaires d'ouverture</label>
          <input value={form.openingHours} onChange={e => set('openingHours', e.target.value)} placeholder="Ex: Lun-Sam 06h00–18h00" className={inputClass} />
        </div>
        {saved && <p className="text-success text-sm">Profil mis à jour ✓</p>}
        <Button type="submit" loading={saving} className="w-full">Enregistrer</Button>
      </form>
    </div>
  );
}
