'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Chrome, Facebook } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80" 
          alt="Bus background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
        {/* Diagonal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-transparent opacity-90"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-10 card-float">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Bienvenue</h1>
            <p className="text-text-light text-sm font-medium">Connectez-vous pour gérer vos voyages</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-light uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary text-sm font-semibold transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-text-light uppercase">Mot de passe</label>
                <Link href="/mot-de-passe-oublie" className="text-[10px] font-bold text-primary hover:underline uppercase">Oublié ?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary text-sm font-semibold transition"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group mt-4">
              <span>SE CONNECTER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-text-muted font-bold tracking-widest">Ou continuer avec</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-border hover:bg-surface-alt transition font-bold text-xs text-dark">
              <Chrome className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-border hover:bg-surface-alt transition font-bold text-xs text-dark">
              <Facebook className="w-4 h-4 fill-current" /> Facebook
            </button>
          </div>

          <p className="text-center mt-8 text-sm font-medium text-text-light">
            Pas encore de compte ? <Link href="/inscription" className="text-primary font-bold hover:underline">S'inscrire</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
