import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, ArrowLeftRight, Search, Bus } from 'lucide-react';
import { CITIES } from '../../lib/cities';
import Button from '../ui/Button';
import { format } from 'date-fns';

export default function SearchForm({ defaultValues = {}, compact = false }) {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [tripType,   setTripType]   = useState(defaultValues.tripType || 'simple');
  const [from,       setFrom]       = useState(defaultValues.from || '');
  const [to,         setTo]         = useState(defaultValues.to || '');
  const [date,       setDate]       = useState(defaultValues.date || today);
  const [returnDate, setReturnDate] = useState(defaultValues.returnDate || '');
  const [passengers, setPassengers] = useState(defaultValues.passengers || 1);
  const [error,      setError]      = useState('');

  function swap() {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!from) { setError('Choisissez une ville de départ'); return; }
    if (!to)   { setError('Choisissez une ville d\'arrivée'); return; }
    if (from === to) { setError('Le départ et l\'arrivée doivent être différents'); return; }
    if (tripType === 'retour' && !returnDate) { setError('Choisissez une date de retour'); return; }
    if (tripType === 'retour' && returnDate < date) { setError('La date de retour doit être après le départ'); return; }
    setError('');
    
    let url = `/recherche?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&passengers=${passengers}&type=${tripType}`;
    if (tripType === 'retour') url += `&returnDate=${returnDate}`;
    navigate(url);
  }

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-end bg-surface-alt p-3 rounded-2xl border border-border shadow-sm">
        <div className="col-span-2 sm:flex-1">
          <label className="block text-[10px] font-bold text-text-light uppercase ml-1 mb-0.5">Départ</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary">
            <option value="">Ville de départ</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-span-2 sm:flex-1">
          <label className="block text-[10px] font-bold text-text-light uppercase ml-1 mb-0.5">Arrivée</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary">
            <option value="">Ville d'arrivée</option>
            {CITIES.filter(c => c !== from).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-span-1 sm:w-32">
          <label className="block text-[10px] font-bold text-text-light uppercase ml-1 mb-0.5">Date</label>
          <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary" />
        </div>
        {tripType === 'retour' && (
          <div className="col-span-1 sm:w-32">
            <label className="block text-[10px] font-bold text-text-light uppercase ml-1 mb-0.5">Retour</label>
            <input type="date" value={returnDate} min={date || today} onChange={e => setReturnDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary" />
          </div>
        )}
        <div className={`${tripType === 'retour' ? 'col-span-2' : 'col-span-1'} sm:w-auto`}>
          <Button type="submit" size="md" className="w-full h-[38px]"><Search className="w-4 h-4" /></Button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-border w-full max-w-5xl mx-auto animate-slide-up">
      {/* Tabs */}
      <div className="flex items-center justify-center sm:justify-start mb-6 w-full">
        <div className="bg-surface-alt p-1.5 rounded-full flex relative shadow-inner w-full max-w-[340px]">
          <button 
            type="button"
            onClick={() => setTripType('simple')}
            className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-3 rounded-full transition-all duration-300 relative z-10 ${tripType === 'simple' ? 'text-white' : 'text-text-light hover:text-dark'}`}
          >
            <Bus className="w-4 h-4 sm:w-5 sm:h-5" /> Bus simple
          </button>
          <button 
            type="button"
            onClick={() => setTripType('retour')}
            className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-3 rounded-full transition-all duration-300 relative z-10 ${tripType === 'retour' ? 'text-white' : 'text-text-light hover:text-dark'}`}
          >
            <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" /> Aller-retour
          </button>
          {/* Animated Background Pill */}
          <div 
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-primary rounded-full transition-transform duration-300 shadow-md"
            style={{ transform: tripType === 'simple' ? 'translateX(0)' : 'translateX(100%)' }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSearch}>
        {error && <p className="text-danger text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex flex-col lg:flex-row gap-2 relative">
          
          {/* Bouton Swap */}
          <button
            type="button"
            onClick={swap}
            className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 -ml-4 w-8 h-8 rounded-full bg-white border border-border items-center justify-center hover:bg-surface-alt transition z-10 shadow-sm ${tripType === 'simple' ? 'left-[26%]' : 'left-[21%]'}`}
            title="Inverser"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-text-light" />
          </button>

          {/* Départ */}
          <div className="flex-1 bg-surface-alt rounded-2xl p-3 border border-transparent hover:border-primary/20 focus-within:border-primary focus-within:bg-white transition relative">
            <label className="block text-xs font-semibold text-text-light mb-0.5">Départ</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full bg-transparent border-none text-dark font-bold text-base sm:text-lg focus:outline-none appearance-none cursor-pointer">
              <option value="">D'où partez-vous ?</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Arrivée */}
          <div className="flex-1 bg-surface-alt rounded-2xl p-3 border border-transparent hover:border-primary/20 focus-within:border-primary focus-within:bg-white transition relative">
            <label className="block text-xs font-semibold text-text-light mb-0.5">Destination</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full bg-transparent border-none text-dark font-bold text-base sm:text-lg focus:outline-none appearance-none cursor-pointer">
              <option value="">Où voulez-vous aller ?</option>
              {CITIES.filter(c => c !== from).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date Départ */}
          <div className="flex-1 bg-surface-alt rounded-2xl p-3 border border-transparent hover:border-primary/20 focus-within:border-primary focus-within:bg-white transition">
            <label className="block text-xs font-semibold text-text-light mb-0.5">{tripType === 'retour' ? 'Aller' : 'Quand ?'}</label>
            <input type="date" value={date} min={today} onChange={e => {
              setDate(e.target.value);
              if (returnDate && e.target.value > returnDate) setReturnDate('');
            }} className="w-full bg-transparent border-none text-dark font-bold text-base sm:text-lg focus:outline-none cursor-pointer" />
          </div>

          {/* Date Retour */}
          {tripType === 'retour' && (
            <div className="flex-1 bg-surface-alt rounded-2xl p-3 border border-transparent hover:border-primary/20 focus-within:border-primary focus-within:bg-white transition animate-scale-in origin-left">
              <label className="block text-xs font-semibold text-text-light mb-0.5">Retour</label>
              <input type="date" value={returnDate} min={date || today} onChange={e => setReturnDate(e.target.value)} className="w-full bg-transparent border-none text-dark font-bold text-base sm:text-lg focus:outline-none cursor-pointer" />
            </div>
          )}

          {/* Voyageurs */}
          <div className="flex-1 bg-surface-alt rounded-2xl p-3 border border-transparent hover:border-primary/20 focus-within:border-primary focus-within:bg-white transition">
            <label className="block text-xs font-semibold text-text-light mb-0.5">Voyageurs</label>
            <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full bg-transparent border-none text-dark font-bold text-base sm:text-lg focus:outline-none appearance-none cursor-pointer">
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} voyageur{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          {/* Bouton recherche */}
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white rounded-2xl w-full lg:w-16 h-[72px] lg:h-auto flex items-center justify-center transition shadow-lg shrink-0 mt-2 lg:mt-0">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
