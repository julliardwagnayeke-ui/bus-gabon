'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Le profil (table profiles) est créé automatiquement par le trigger
    // handle_new_user à partir des métadonnées (full_name).
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already')) {
        setError('Cet email est déjà utilisé.');
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
      setLoading(false);
      return;
    }

    // Si la confirmation email est activée, aucune session n'est ouverte.
    if (data.session) {
      router.push('/');
      router.refresh();
    } else {
      setConfirmEmailSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-dark mb-2 tracking-tight">Rejoignez-nous</h1>
          <p className="text-text-light text-sm">Créez votre compte BusGabon en quelques secondes.</p>
        </div>

        {confirmEmailSent && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-700 text-xs font-bold text-center">
            Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-light uppercase ml-1 flex items-center gap-1.5">
              <User className="w-3 h-3" /> Nom complet
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Jean-Pierre Nguema"
              className="w-full px-5 py-4 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-light uppercase ml-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-5 py-4 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-light uppercase ml-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Mot de passe
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              minLength={6}
              className="w-full px-5 py-4 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-[56px] rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>CRÉER MON COMPTE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-light font-medium">
          Déjà inscrit ?{' '}
          <Link href="/connexion" className="text-primary font-bold hover:underline">Connectez-vous</Link>
        </p>
      </motion.div>
    </div>
  );
}
