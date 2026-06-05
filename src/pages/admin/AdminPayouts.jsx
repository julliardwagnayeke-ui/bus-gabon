import { useState, useEffect } from 'react';
import { Wallet, Calculator, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAllAgencies } from '../../services/agencies';
import {
  calculatePayoutPreview,
  createPayout,
  getPayouts,
  markPayoutPaid,
} from '../../services/agencyPayouts';
import { formatPrice } from '../../lib/pricing';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

function today()    { return new Date().toISOString().slice(0, 10); }
function monthAgo() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

function formatTs(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return format(d, 'd MMM yyyy', { locale: fr });
  } catch { return '—'; }
}

const STATUS_INFO = {
  pending:    { label: 'En attente', color: 'yellow' },
  processing: { label: 'En cours',   color: 'blue' },
  paid:       { label: 'Versé',      color: 'green' },
};

export default function AdminPayouts() {
  const [agencies,  setAgencies]  = useState([]);
  const [payouts,   setPayouts]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);

  // Formulaire de génération
  const [agencyId,  setAgencyId]  = useState('');
  const [fromDate,  setFromDate]  = useState(monthAgo());
  const [toDate,    setToDate]    = useState(today());
  const [preview,   setPreview]   = useState(null);
  const [computing, setComputing] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  // Marquer comme payé
  const [payingId,  setPayingId]  = useState(null);
  const [payNotes,  setPayNotes]  = useState('');

  useEffect(() => {
    Promise.all([getAllAgencies(), getPayouts()])
      .then(([ags, pvs]) => { setAgencies(ags); setPayouts(pvs); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCalculate() {
    if (!agencyId || !fromDate || !toDate) { setFormError('Sélectionnez une agence et une période.'); return; }
    setComputing(true);
    setFormError('');
    setPreview(null);
    try {
      const data = await calculatePayoutPreview(agencyId, fromDate, toDate);
      setPreview(data);
    } catch (err) {
      setFormError('Erreur lors du calcul. Réessayez.');
    } finally {
      setComputing(false);
    }
  }

  async function handleCreate() {
    if (!preview || preview.reservationCount === 0) { setFormError('Aucune réservation trouvée sur cette période.'); return; }
    setSaving(true);
    try {
      const agency = agencies.find(a => a.id === agencyId);
      await createPayout({
        agencyId,
        agencyName: agency?.name || agencyId,
        periodStart: fromDate,
        periodEnd:   toDate,
        ...preview,
      });
      const updated = await getPayouts();
      setPayouts(updated);
      setPreview(null);
      setShowForm(false);
    } catch (err) {
      setFormError('Erreur lors de la création. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkPaid(payoutId) {
    try {
      await markPayoutPaid(payoutId, payNotes);
      setPayouts(prev => prev.map(p => p.id === payoutId
        ? { ...p, status: 'paid', paidAt: { toDate: () => new Date() } }
        : p));
      setPayingId(null);
      setPayNotes('');
    } catch (err) {
      alert('Erreur lors de la mise à jour.');
    }
  }

  // Totaux pour les cartes de résumé
  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.agencyNetAmount || 0), 0);
  const totalPaid    = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + (p.agencyNetAmount || 0), 0);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-dark">Versements agences</h1>
            <p className="text-sm text-text-muted">Suivi des montants dus aux agences partenaires</p>
          </div>
        </div>
        <Button onClick={() => { setShowForm(f => !f); setPreview(null); setFormError(''); }} size="sm">
          {showForm ? 'Annuler' : 'Générer un versement'}
        </Button>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-500" />
            <p className="text-xs text-text-muted font-semibold">En attente de versement</p>
          </div>
          <p className="text-2xl font-bold text-dark">{formatPrice(totalPending)}</p>
          <p className="text-xs text-text-muted mt-0.5">{payouts.filter(p => p.status === 'pending').length} versement(s)</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-success" />
            <p className="text-xs text-text-muted font-semibold">Total versé</p>
          </div>
          <p className="text-2xl font-bold text-dark">{formatPrice(totalPaid)}</p>
          <p className="text-xs text-text-muted mt-0.5">{payouts.filter(p => p.status === 'paid').length} versement(s)</p>
        </div>
      </div>

      {/* Formulaire de génération */}
      {showForm && (
        <div className="bg-white border border-border rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" /> Nouveau versement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs font-medium text-dark mb-1 block">Agence *</label>
              <select value={agencyId} onChange={e => { setAgencyId(e.target.value); setPreview(null); }}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-primary">
                <option value="">Choisir une agence…</option>
                {agencies.filter(a => a.status === 'active').map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-dark mb-1 block">Du</label>
              <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPreview(null); }}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-dark mb-1 block">Au</label>
              <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPreview(null); }}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          {formError && <p className="text-danger text-sm mb-3">{formError}</p>}

          <Button onClick={handleCalculate} loading={computing} size="sm" className="mb-4">
            <Calculator className="w-4 h-4 mr-1.5" /> Calculer
          </Button>

          {/* Aperçu du calcul */}
          {preview && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-4">
              <p className="font-bold text-dark text-sm mb-3">
                Aperçu — {preview.reservationCount} réservation(s) · {preview.ticketCount} billet(s)
              </p>
              {preview.reservationCount === 0 ? (
                <p className="text-sm text-text-muted">Aucune réservation payée sur cette période.</p>
              ) : (
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-light">Ventes brutes (HT comm.)</span>
                    <span className="font-mono">{formatPrice(preview.grossSalesAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-light">Commission plateforme</span>
                    <span className="font-mono text-danger">− {formatPrice(preview.commissionAmount)}</span>
                  </div>
                  <div className="border-t border-primary-100 my-1" />
                  <div className="flex justify-between font-bold text-dark">
                    <span>À verser à l'agence</span>
                    <span className="text-primary font-mono">{formatPrice(preview.agencyNetAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>Revenu plateforme (comm. + frais)</span>
                    <span className="font-mono">{formatPrice(preview.platformRevenue)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {preview && preview.reservationCount > 0 && (
            <Button onClick={handleCreate} loading={saving} size="sm">
              Créer le versement
            </Button>
          )}
        </div>
      )}

      {/* Liste des versements */}
      {payouts.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <Wallet className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="font-semibold text-dark mb-1">Aucun versement</p>
          <p className="text-text-muted text-sm">Générez votre premier versement ci-dessus.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payouts.map(payout => {
            const info = STATUS_INFO[payout.status] || { label: payout.status, color: 'gray' };
            const isMarkingPaid = payingId === payout.id;

            return (
              <div key={payout.id} className="bg-white border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-dark text-sm">{payout.agencyName || payout.agencyId}</p>
                      <Badge color={info.color}>{info.label}</Badge>
                    </div>
                    <p className="text-xs text-text-muted">
                      {payout.periodStart} → {payout.periodEnd} · {payout.reservationCount} réserv. · {payout.ticketCount} billets
                    </p>
                    {payout.paidAt && (
                      <p className="text-xs text-success mt-0.5">Versé le {formatTs(payout.paidAt)}</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-dark">{formatPrice(payout.agencyNetAmount || 0)}</p>
                    <p className="text-xs text-text-muted">à verser</p>
                  </div>

                  {payout.status === 'pending' && (
                    <button
                      onClick={() => setPayingId(isMarkingPaid ? null : payout.id)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0">
                      {isMarkingPaid ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {isMarkingPaid ? 'Annuler' : 'Marquer comme versé'}
                    </button>
                  )}
                </div>

                {/* Panel "marquer comme versé" */}
                {isMarkingPaid && (
                  <div className="mt-4 pt-4 border-t border-border flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-dark mb-1 block">Note (référence virement, etc.)</label>
                      <input
                        type="text"
                        value={payNotes}
                        onChange={e => setPayNotes(e.target.value)}
                        placeholder="ex: Virement BICI GA — réf. 123456"
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <Button onClick={() => handleMarkPaid(payout.id)} size="sm">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Confirmer
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
