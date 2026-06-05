'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bus, Building2, User, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import Button from '@/components/common/Button';
import { CITIES } from '@/lib/cities';
import { registerAgencyAction } from '@/server/actions/registerAgency';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => /^(\+?241)?\s?0?[0-9]{8,9}$/.test(v.replace(/\s/g, ''));

const inputClass = (err?: string) =>
  `w-full px-4 py-3 rounded-xl border ${err ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`;

export default function AgencyRegisterPage() {
  const [step, setStep] = useState(1); // 1 = agence, 2 = compte, 3 = succès
  const [agency, setAgency] = useState({ name: '', city: '', phone: '', email: '', description: '' });
  const [account, setAccount] = useState({ managerName: '', loginEmail: '', loginPhone: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  const setA = (k: string, v: string) => setAgency((p) => ({ ...p, [k]: v }));
  const setAcc = (k: string, v: string) => setAccount((p) => ({ ...p, [k]: v }));

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!agency.name.trim()) e.name = "Nom de l'agence requis";
    if (!agency.city) e.city = 'Ville requise';
    if (!isPhone(agency.phone)) e.phone = 'Numéro invalide (ex: 077123456)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Record<string, string> = {};
    if (!account.managerName.trim()) e.managerName = 'Nom requis';
    if (!isEmail(account.loginEmail)) e.loginEmail = 'Email invalide';
    if (account.password.length < 8) e.password = 'Mot de passe : 8 caractères minimum';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) {
      setErrors({});
      setStep(2);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setServerErr('');
    const res = await registerAgencyAction({ agency, account });
    setLoading(false);
    if (res.ok) setStep(3);
    else setServerErr(res.error);
  }

  // ── Étape 3 : succès ──
  if (step === 3) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2 font-extrabold text-primary text-2xl mb-8">
            <Bus className="w-7 h-7" /> BusGabon
          </div>
          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-dark mb-3">Demande envoyée !</h1>
            <p className="text-text-light text-sm mb-5 leading-relaxed">
              Votre demande d&apos;inscription a été reçue. Notre équipe va vérifier vos informations et vous
              contactera sous <strong>24 à 48 heures</strong>.
            </p>
            <div className="bg-primary-50 rounded-xl p-4 text-sm text-text-light mb-6 text-left space-y-1.5">
              <p>✅ Agence : <strong className="text-dark">{agency.name}</strong></p>
              <p>✅ Ville : <strong className="text-dark">{agency.city}</strong></p>
              <p>✅ Contact : <strong className="text-dark">{account.loginEmail}</strong></p>
            </div>
            <Link
              href="/connexion"
              className="block w-full py-3.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition text-center"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire ──
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-primary text-2xl">
            <Bus className="w-7 h-7" /> BusGabon
          </Link>
          <h1 className="text-2xl font-bold text-dark mt-3">Inscrire mon agence</h1>
          <p className="text-text-light text-sm mt-1">Rejoignez la plateforme et vendez vos billets en ligne</p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          {[
            { n: 1, icon: Building2, label: 'Agence' },
            { n: 2, icon: User, label: 'Compte' },
          ].map(({ n, icon: Icon, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${step >= n ? 'bg-primary text-white' : 'bg-surface-alt text-text-muted'}`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </div>
              {n < 2 && <ChevronRight className="w-4 h-4 text-text-muted" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-dark mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Informations de l&apos;agence
              </h2>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Nom de l&apos;agence *</label>
                <input value={agency.name} onChange={(e) => setA('name', e.target.value)} placeholder="ex : Transport Gabon Express" className={inputClass(errors.name)} />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Ville principale *</label>
                <select value={agency.city} onChange={(e) => setA('city', e.target.value)} className={inputClass(errors.city) + ' bg-white'}>
                  <option value="">Choisir une ville…</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <p className="text-xs text-danger mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Téléphone de l&apos;agence *</label>
                <input type="tel" value={agency.phone} onChange={(e) => setA('phone', e.target.value)} placeholder="077 12 34 56" className={inputClass(errors.phone)} />
                {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Email de l&apos;agence (optionnel)</label>
                <input type="email" value={agency.email} onChange={(e) => setA('email', e.target.value)} placeholder="contact@monagence.ga" className={inputClass()} />
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Lignes desservies (optionnel)</label>
                <textarea value={agency.description} onChange={(e) => setA('description', e.target.value)} placeholder="ex : Libreville → Oyem, Libreville → Franceville" rows={2} className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm resize-none" />
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                Continuer <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button type="button" onClick={() => setStep(1)} className="text-text-muted hover:text-dark">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="font-bold text-dark flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Compte du gestionnaire
                </h2>
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Nom complet du gestionnaire *</label>
                <input value={account.managerName} onChange={(e) => setAcc('managerName', e.target.value)} placeholder="Prénom Nom" className={inputClass(errors.managerName)} />
                {errors.managerName && <p className="text-xs text-danger mt-1">{errors.managerName}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Email de connexion *</label>
                <input type="email" value={account.loginEmail} onChange={(e) => setAcc('loginEmail', e.target.value)} placeholder="gestionnaire@email.com" className={inputClass(errors.loginEmail)} />
                {errors.loginEmail && <p className="text-xs text-danger mt-1">{errors.loginEmail}</p>}
                <p className="text-xs text-text-muted mt-1">Cet email servira pour vous connecter à votre espace agence.</p>
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Téléphone du gestionnaire</label>
                <input type="tel" value={account.loginPhone} onChange={(e) => setAcc('loginPhone', e.target.value)} placeholder="077 12 34 56" className={inputClass()} />
              </div>

              <div>
                <label className="text-xs font-medium text-dark mb-1 block">Mot de passe *</label>
                <input type="password" value={account.password} onChange={(e) => setAcc('password', e.target.value)} placeholder="8 caractères minimum" className={inputClass(errors.password)} />
                {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
              </div>

              {serverErr && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl">{serverErr}</div>}

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Envoyer ma demande
              </Button>

              <p className="text-xs text-center text-text-muted">
                En soumettant, vous acceptez nos{' '}
                <Link href="/cgu" className="text-primary hover:underline">conditions d&apos;utilisation</Link>.
              </p>
            </form>
          )}
        </div>

        <p className="text-sm text-center text-text-muted mt-5">
          Déjà un compte ?{' '}
          <Link href="/connexion" className="text-primary font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
