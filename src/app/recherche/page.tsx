'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import SearchForm from '@/components/search/SearchForm';
import DepartureCard from '@/components/search/DepartureCard';
import { Filter, ArrowUpDown, Bus } from 'lucide-react';
import { useDepartures } from '@/hooks/useDepartures';
import Spinner from '@/components/common/LoadingSpinner';
import { motion } from 'framer-motion';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  const { data: departures, isLoading, error } = useDepartures(from, to, date);

  return (
    <div className="bg-surface min-h-screen">
      {/* Header compact search */}
      <div className="bg-primary pt-6 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            {from} → {to}
            <span className="text-white/60 font-normal text-sm">({date})</span>
          </h1>
          <SearchForm compact />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 pb-20">
        <div className="flex justify-between items-center mb-6">
           <p className="text-sm font-medium text-text-light">
             {isLoading ? 'Recherche en cours...' : `${departures?.length || 0} trajets trouvés`}
           </p>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-bold text-text hover:bg-surface-alt transition">
                <Filter className="w-3.5 h-3.5" /> Filtrer
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-bold text-text hover:bg-surface-alt transition">
                <ArrowUpDown className="w-3.5 h-3.5" /> Trier
              </button>
           </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm">
            <Spinner size="lg" />
            <p className="mt-4 text-sm text-text-light font-medium">Nous trouvons les meilleurs trajets pour vous...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-danger/20">
            <p className="text-danger font-bold">Erreur lors de la récupération des données.</p>
            <p className="text-sm text-text-light mt-2">Vérifiez votre connexion au serveur backend.</p>
          </div>
        ) : !departures || departures.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-border">
            <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-4">
               <Bus className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="font-bold text-dark text-lg">Aucun bus trouvé</h2>
            <p className="text-sm text-text-light mt-2">Essayez de modifier vos critères de recherche ou une autre date.</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {departures.map((dep: any, i: number) => (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <DepartureCard departure={dep} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
