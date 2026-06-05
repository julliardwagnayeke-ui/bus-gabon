import { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { updateSettings } from '../../services/settings';
import { useApp } from '../../context/AppContext';
import Button from '../../components/ui/Button';

function Field({ label, description, value, onChange, min, max, step = 1, suffix }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex-1 mr-8">
        <p className="font-semibold text-dark text-sm">{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-24 px-3 py-2 rounded-xl border border-border focus:outline-none focus:border-primary text-sm text-right font-mono"
        />
        {suffix && <span className="text-sm text-text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { platformSettings, setPlatformSettings } = useApp();

  const [form, setForm] = useState({
    commissionRate:           platformSettings.commissionRate           ?? 0.05,
    serviceFee:               platformSettings.serviceFee               ?? 200,
    reservationExpiryMinutes: platformSettings.reservationExpiryMinutes ?? 10,
  });
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setSaved(false); }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      await updateSettings(form);
      setPlatformSettings(prev => ({ ...prev, ...form }));
      setSaved(true);
    } catch (err) {
      setError('Erreur lors de la sauvegarde. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm({
      commissionRate:           platformSettings.commissionRate           ?? 0.05,
      serviceFee:               platformSettings.serviceFee               ?? 200,
      reservationExpiryMinutes: platformSettings.reservationExpiryMinutes ?? 10,
    });
    setSaved(false);
  }

  // Exemple de calcul avec les valeurs courantes du formulaire
  const examplePrice    = 10_000;
  const commission      = Math.round(examplePrice * form.commissionRate);
  const totalClient     = examplePrice + form.serviceFee;
  const agencyNet       = examplePrice - commission;
  const platformRevenue = commission + form.serviceFee;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dark">Paramètres plateforme</h1>
          <p className="text-sm text-text-muted">Ces valeurs s'appliquent à toutes les nouvelles réservations.</p>
        </div>
      </div>

      {/* Paramètres */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-5">
        <h2 className="font-bold text-dark text-sm mb-2">Modèle économique</h2>

        <Field
          label="Commission plateforme"
          description="Prélevée sur le prix HT du billet"
          value={form.commissionRate * 100}
          onChange={v => set('commissionRate', v / 100)}
          min={0} max={30} step={0.5}
          suffix="%"
        />
        <Field
          label="Frais de service client"
          description="Ajoutés au total payé par le client, conservés par la plateforme"
          value={form.serviceFee}
          onChange={v => set('serviceFee', v)}
          min={0} max={5000} step={50}
          suffix="FCFA"
        />
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 mb-5">
        <h2 className="font-bold text-dark text-sm mb-2">Réservations</h2>

        <Field
          label="Durée d'expiration"
          description="Une réservation non payée dans ce délai est annulée automatiquement"
          value={form.reservationExpiryMinutes}
          onChange={v => set('reservationExpiryMinutes', v)}
          min={5} max={60} step={5}
          suffix="min"
        />
      </div>

      {/* Exemple de calcul */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-5">
        <p className="font-bold text-dark text-sm mb-3">Simulation — billet à 10 000 FCFA</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-text-light">Prix billet</span>
            <span className="font-mono">10 000 FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Commission plateforme ({(form.commissionRate * 100).toFixed(1)}%)</span>
            <span className="font-mono text-primary">− {commission} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light">Frais de service</span>
            <span className="font-mono text-primary">+ {form.serviceFee} FCFA</span>
          </div>
          <div className="border-t border-primary-100 my-2" />
          <div className="flex justify-between font-semibold">
            <span className="text-text-light">Client paie</span>
            <span className="font-mono">{totalClient.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-xs">Agence reçoit</span>
            <span className="font-mono text-xs text-text-muted">{agencyNet.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-xs">Plateforme reçoit</span>
            <span className="font-mono text-xs text-text-muted">{platformRevenue.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      {saved && <div className="bg-green-50 text-success text-sm px-4 py-3 rounded-xl mb-4">Paramètres sauvegardés avec succès.</div>}

      <div className="flex gap-3">
        <Button onClick={handleSave} loading={saving} size="lg" className="flex-1">
          <Save className="w-4 h-4 mr-2" /> Enregistrer
        </Button>
        <button onClick={handleReset}
          className="flex items-center gap-2 px-5 py-3 rounded-full border border-border text-sm font-medium text-text-light hover:text-dark hover:bg-surface-alt transition">
          <RefreshCw className="w-4 h-4" /> Réinitialiser
        </button>
      </div>
    </div>
  );
}
