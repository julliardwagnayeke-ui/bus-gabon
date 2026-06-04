import Hero from '@/components/home/Hero';
import SearchForm from '@/components/search/SearchForm';
import { Plane, Train, Bus, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <SearchForm />
      
      {/* Services Section */}
      <section className="py-24 max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-4">
            Une expérience de voyage premium
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            BusGabon digitalise le transport au Gabon pour vous offrir simplicité, sécurité et rapidité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="w-6 h-6 text-primary" />, title: "Réservation instantanée", desc: "Réservez votre billet en moins de 2 minutes et recevez votre QR code immédiatement." },
            { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "Paiement sécurisé", desc: "Payez en toute confiance via Airtel Money, Moov Money ou Carte Bancaire." },
            { icon: <HeartHandshake className="w-6 h-6 text-primary" />, title: "Service Client 24/7", desc: "Notre équipe est à votre disposition pour vous accompagner avant et pendant votre voyage." }
          ].map((s, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-surface-alt border border-border hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">{s.title}</h3>
              <p className="text-sm text-text-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations Section (Simplified) */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-6xl mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl font-extrabold mb-4">Destinations populaires</h2>
                <p className="text-white/60">Explorez le Gabon avec nos agences partenaires. Des départs quotidiens vers toutes les provinces.</p>
              </div>
              <button className="px-6 py-3 rounded-full bg-primary font-bold text-sm hover:bg-primary-dark transition">VOIR TOUS LES TRAJETS</button>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Libreville', 'Port-Gentil', 'Franceville', 'Oyem'].map((city, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2rem] overflow-hidden relative group cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-15${50 + i}2345678-abc?auto=format&fit=crop&w=800&q=80`} alt={city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-xl font-bold">{city}</h3>
                    <p className="text-sm text-white/70">À partir de 10 000 FCFA</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
}
