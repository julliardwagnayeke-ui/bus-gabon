import { CITIES, PROVINCES } from '../../lib/cities';
import { MapPin } from 'lucide-react';

export default function AdminCities() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-2">Villes desservies</h1>
      <p className="text-text-muted text-sm mb-6">{CITIES.length} villes · 9 provinces</p>

      <div className="space-y-4">
        {Object.entries(PROVINCES).map(([province, cities]) => (
          <div key={province} className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-dark text-sm mb-3">{province}</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => (
                <span key={c} className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary text-xs font-medium rounded-full">
                  <MapPin className="w-3 h-3" /> {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted mt-6">
        Pour ajouter ou retirer des villes, modifiez le fichier <code className="bg-surface-alt px-1 rounded">src/lib/cities.js</code>.
      </p>
    </div>
  );
}
