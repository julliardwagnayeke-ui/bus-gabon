import Link from 'next/link';
import { Clock, Luggage, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DepartureCard({ departure }: { departure: any }) {
  // This will eventually fetch from the new backend
  const availableSeats = 12;
  const isAlmostFull = availableSeats <= 5 && availableSeats > 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border p-5 hover:shadow-xl transition-shadow flex flex-col sm:flex-row gap-6 items-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center flex-shrink-0 border border-border">
         <span className="font-bold text-primary text-xl">L</span>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
          <h3 className="font-bold text-dark text-lg">Ligne Nationale</h3>
          <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary-100 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Vérifié
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-text-light font-medium">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> 07:30</span>
          <span className="flex items-center gap-1.5"><Luggage className="w-3.5 h-3.5 text-primary" /> 2 Bagages inclus</span>
          <span className={`flex items-center gap-1.5 ${isAlmostFull ? 'text-amber-600' : 'text-success'}`}>
            <Users className="w-3.5 h-3.5" /> {availableSeats} places
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-end gap-2 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
        <p className="text-2xl font-extrabold text-dark tracking-tight">15 000 <span className="text-xs font-normal text-text-light">FCFA</span></p>
        <Link 
          href={`/depart/${departure.id}`}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-dark text-white text-sm font-bold hover:bg-black transition-colors text-center"
        >
          Réserver
        </Link>
      </div>
    </motion.div>
  );
}
