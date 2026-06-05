'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.error('Login error:', signInError);
      const msg = signInError.message?.toLowerCase() ?? '';
      if (msg.includes('invalid login credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (msg.includes('email not confirmed')) {
        setError("Votre email n'est pas encore confirmé.");
      } else {
        setError(signInError.message || 'Problème de connexion. Réessayez.');
      }
      setLoading(false);
      return;
    }

    // Redirection vers la cible demandée (?redirect=...) ou l'accueil.
    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-dark mb-2 tracking-tight">Connexion</h1>
          <p className="text-text-light text-sm">Bon retour parmi nous !</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition"
            />
          </div>

          <div className="text-right">
             <Link href="/mot-de-passe-oublie" className="text-xs font-bold text-primary hover:underline">Mot de passe oublié ?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-[56px] rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <span>SE CONNECTER</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-light font-medium">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-primary font-bold hover:underline">Inscrivez-vous</Link>
        </p>
      </motion.div>
    </div>
  );
}
