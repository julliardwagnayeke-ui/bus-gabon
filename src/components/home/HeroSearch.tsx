'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';

const cities = [
  { value: 'libreville', label: 'Libreville' },
  { value: 'port-gentil', label: 'Port-Gentil' },
  { value: 'franceville', label: 'Franceville' },
  { value: 'oyem', label: 'Oyem' },
  { value: 'mouila', label: 'Mouila' },
  { value: 'lambarene', label: 'Lambaréné' },
  { value: 'bitam', label: 'Bitam' },
];

export default function HeroSearch() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.from && formData.to && formData.date) {
      const params = new URLSearchParams({
        from: formData.from,
        to: formData.to,
        date: formData.date,
        passengers: formData.passengers.toString(),
      });
      router.push(`/search?${params}`);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Réservez votre billet de bus
          <span className="block text-primary-light">au Gabon en toute confiance</span>
        </h1>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Trouvez un départ, choisissez une agence vérifiée, payez en ligne et recevez votre billet sécurisé par WhatsApp et email.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
              <select
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Ville de départ</option>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
              <select
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Ville d'arrivée</option>
                {cities.filter(city => city.value !== formData.from).map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={today}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
              <select
                value={formData.passengers}
                onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} voyageur{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Search className="w-5 h-5 mr-2" />
            Rechercher un départ
          </Button>
        </form>
      </div>
    </section>
  );
}