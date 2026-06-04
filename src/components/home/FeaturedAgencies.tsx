import { MapPin, Star, ShieldCheck } from 'lucide-react';
import Badge from '@/components/common/Badge';

const agencies = [
  {
    name: 'Gabon Transport Express',
    logo: '/logos/gte.png',
    rating: 4.8,
    verified: true,
    city: 'Libreville',
  },
  {
    name: 'Trans-Gabon Lines',
    logo: '/logos/tgl.png',
    rating: 4.6,
    verified: true,
    city: 'Port-Gentil',
  },
  {
    name: 'Bus Plus Gabon',
    logo: '/logos/bpg.png',
    rating: 4.7,
    verified: true,
    city: 'Franceville',
  },
];

export default function FeaturedAgencies() {
  return (
    <section className="py-20 bg-surface-alt">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Agences vérifiées
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Toutes nos agences partenaires sont vérifiées et respectent nos standards de qualité et de sécurité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agencies.map((agency, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {agency.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                {agency.verified && (
                  <Badge variant="success" size="sm">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Vérifiée
                  </Badge>
                )}
              </div>

              <h3 className="font-bold text-dark mb-2">{agency.name}</h3>

              <div className="flex items-center text-sm text-text-light mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {agency.city}
              </div>

              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium">{agency.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}