import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import SearchForm from '../../components/search/SearchForm';
import DepartureCard from '../../components/search/DepartureCard';
import Spinner from '../../components/ui/Spinner';
import { searchDepartures } from '../../services/departures';
import { getAgency } from '../../services/agencies';
import { getAvailableSeats } from '../../lib/availability';

export default function SearchResults() {
  const [params] = useSearchParams();
  const from      = params.get('from')       || '';
  const to        = params.get('to')         || '';
  const date      = params.get('date')       || '';
  const passengers = Number(params.get('passengers') || 1);

  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sort,     setSort]     = useState('time'); // 'time' | 'price'

  useEffect(() => {
    if (!from || !to || !date) { setLoading(false); return; }
    setLoading(true);

    searchDepartures({ originCity: from, destinationCity: to, date })
      .then(async (departures) => {
        const enriched = await Promise.all(
          departures.map(async (dep) => {
            const [agency, available] = await Promise.all([
              getAgency(dep.agencyId),
              getAvailableSeats(dep.id, dep.totalSeats),
            ]);
            return { ...dep, agency, availableSeats: available };
          })
        );
        // Filtrer les départs ayant assez de places
        setResults(enriched.filter(d => d.availableSeats >= passengers));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [from, to, date, passengers]);

  const sorted = [...results].sort((a, b) =>
    sort === 'price'
      ? (a.route?.basePrice || 0) - (b.route?.basePrice || 0)
      : a.departureTime.localeCompare(b.departureTime)
  );

  let formattedDate = date;
  if (date) {
    try { 
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = format(parsedDate, 'EEEE d MMMM yyyy', { locale: fr }); 
      }
    } catch (err) { 
      console.warn('[SearchResults] date format failed', err); 
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Retour */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-dark mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>

      {/* Résumé recherche */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-dark mb-1">
          {from} → {to}
        </h1>
        <p className="text-text-light text-sm capitalize">{formattedDate} · {passengers} voyageur{passengers > 1 ? 's' : ''}</p>
      </div>

      {/* Modifier recherche */}
      <div className="mb-6">
        <SearchForm compact defaultValues={{ from, to, date, passengers }} />
      </div>

      {/* Tri */}
      {!loading && results.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-text-muted" />
          <span className="text-text-light">Trier par :</span>
          <button onClick={() => setSort('time')} className={`px-3 py-1 rounded-full font-medium transition ${sort === 'time' ? 'bg-primary text-white' : 'bg-surface-alt text-text-light hover:bg-border'}`}>
            Heure
          </button>
          <button onClick={() => setSort('price')} className={`px-3 py-1 rounded-full font-medium transition ${sort === 'price' ? 'bg-primary text-white' : 'bg-surface-alt text-text-light hover:bg-border'}`}>
            Prix
          </button>
        </div>
      )}

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-border">
          <p className="text-4xl mb-4">🚌</p>
          <h2 className="font-bold text-dark mb-2">Aucun départ trouvé</h2>
          <p className="text-text-light text-sm mb-6">
            Aucune agence ne propose ce trajet à cette date.<br />Essayez une autre date.
          </p>
          <Link to="/" className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark">
            Nouvelle recherche
          </Link>
        </div>
      ) : (
        <div className="space-y-4 stagger">
          <p className="text-sm text-text-light">{sorted.length} départ{sorted.length > 1 ? 's' : ''} disponible{sorted.length > 1 ? 's' : ''}</p>
          {sorted.map((dep) => (
            <div key={dep.id} className="animate-slide-up">
              <DepartureCard
                departure={dep}
                route={dep.route}
                agency={dep.agency}
                availableSeats={dep.availableSeats}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
