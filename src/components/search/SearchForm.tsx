'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CITIES = ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila', 'Lambaréné', 'Tchibanga', 'Koulamoutou', 'Makokou'];

interface SearchFormProps {
  compact?: boolean;
}

export default function SearchForm({ compact = false }: SearchFormProps) {
  const router = useRouter();
  const [tripType, setTripType] = useState<'aller' | 'retour'>('aller');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    router.push(`/recherche?from=${from}&to=${to}&date=${date}${returnDate ? `&return=${returnDate}` : ''}`);
  };

  if (compact) {
    // Compact version for results page
    return (
      <form onSubmit={handleSearch} className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-end bg-surface-alt p-3 rounded-2xl border border-border shadow-sm">
        {/* Simplified compact version */}
        <div className="col-span-2 sm:flex-1">
          <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary">
            <option value="">Départ</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-span-2 sm:flex-1">
          <select value={to} onChange={e => setTo(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary">
            <option value="">Arrivée</option>
            {CITIES.filter(c => c !== from).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-span-1">
           <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" className="col-span-1 bg-primary text-white p-2 rounded-xl flex items-center justify-center">
          <Search className="w-4 h-4" />
        </button>
      </form>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto -mt-16 relative z-20 px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl p-6 lg:p-8">
        {/* Trip Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-surface-alt p-1 rounded-full relative">
            {['aller', 'retour'].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type as any)}
                className={`relative px-8 py-2.5 text-sm font-bold z-10 transition-colors duration-300 ${tripType === type ? 'text-white' : 'text-text-light'}`}
              >
                {tripType === type && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {type === 'aller' ? 'Bus simple' : 'Aller-retour'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-light uppercase ml-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Ville de départ
            </label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition">
              <option value="">Sélectionnez</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-light uppercase ml-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Destination
            </label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition">
              <option value="">Sélectionnez</option>
              {CITIES.filter(c => c !== from).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-light uppercase ml-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Date du trajet
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border border-border bg-surface-alt focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold transition" />
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-[50px] rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group">
              <span>RECHERCHER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
