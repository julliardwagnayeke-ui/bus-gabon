'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

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
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/60 to-transparent opacity-90"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg px-6 py-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 card-float">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Créer un compte</h1>
            <p className="text-text-light text-sm font-medium">Rejoignez BusGabon et voyagez en toute simplicité</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-light uppercase ml-1">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="text" placeholder="Jean Dupont" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary text-sm font-semibold transition" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-light uppercase ml-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input type="tel" placeholder="077 00 00 00" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary text-sm font-semibold transition" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-light uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" placeholder="votre@email.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary text-sm font-semibold transition" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-light uppercase ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary text-sm font-semibold transition" />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group mt-6">
              <span>CRÉER MON COMPTE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-text-light">
            Déjà un compte ? <Link href="/connexion" className="text-primary font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
