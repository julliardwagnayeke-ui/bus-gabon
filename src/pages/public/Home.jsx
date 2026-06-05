import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Smartphone, Star, ChevronDown, Bus, MapPin, ArrowLeftRight, Info, Mail } from 'lucide-react';
import SearchForm from '../../components/search/SearchForm';
import { CITIES } from '../../lib/cities';
import { getVerifiedAgencies } from '../../services/agencies';

const HERO_SLIDES = [
  {
    title: "Réservez votre bus,",
    highlight: "PAYEZ PAR MOBILE MONEY",
    subtitle: "100 % garanti, 0 % d'attente",
    accent: "CHOISISSEZ LA SIMPLICITÉ"
  },
  {
    title: "Voyagez dans tout le Gabon,",
    highlight: "EN TOUTE SÉCURITÉ",
    subtitle: "Des agences vérifiées, des trajets confortables",
    accent: "PARTEZ L'ESPRIT TRANQUILLE"
  },
  {
    title: "Fini les files d'attente,",
    highlight: "VOTRE BILLET SUR SMARTPHONE",
    subtitle: "Simple, rapide et instantané",
    accent: "GAGNEZ DU TEMPS"
  }
];

const FAQ = [
  { q: 'Comment recevoir mon billet ?', a: 'Après paiement confirmé, votre billet avec QR code est disponible immédiatement dans "Mes billets". Vous pouvez aussi le recevoir via WhatsApp.' },
  { q: 'Puis-je choisir mon siège ?', a: 'Non. La place est attribuée par l\'agence à votre arrivée, selon leur organisation interne.' },
  { q: 'Combien de billets puis-je acheter ?', a: 'Vous pouvez acheter jusqu\'à 4 billets par commande.' },
  { q: 'Comment annuler ma réservation ?', a: 'La politique d\'annulation dépend de chaque agence. Consultez les conditions avant d\'acheter.' },
  { q: 'Quels sont les frais de service ?', a: '200 FCFA de frais de service par commande, quel que soit le nombre de billets.' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [agencies, setAgencies] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let alive = true;
    getVerifiedAgencies(6)
      .then(list => { if (alive) setAgencies(list); })
      .catch(() => { if (alive) setAgencies([]); });
      
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    
    return () => { 
      alive = false; 
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="bg-hero relative px-4 pt-16 pb-40 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10 min-h-[180px] sm:min-h-[220px] flex flex-col justify-center items-center">
          {HERO_SLIDES.map((slide, index) => (
            <div 
              key={index} 
              className={`transition-all duration-1000 ease-in-out w-full ${index === currentSlide ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute top-0 pointer-events-none'}`}
            >
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-2 tracking-tight">
                {slide.title} <span className="font-handwriting text-accent inline-block -rotate-2 ml-2">{slide.highlight}</span>
              </h1>
              <p className="text-white text-xl sm:text-3xl font-semibold mb-6">
                {slide.subtitle}
              </p>
              <div className="flex justify-center items-center gap-2">
                <span className="font-handwriting text-accent text-2xl sm:text-3xl font-bold -rotate-3">
                  {slide.accent}
                </span>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-12">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="-mt-24 relative z-20 px-4 mb-16">
        <SearchForm />
      </div>

      {/* ===== DESTINATIONS ET OFFRES (Inspiration Air France Img 1) ===== */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-hero mb-6 tracking-tight">Destinations et offres</h2>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button className="text-dark font-bold border-b-2 border-dark pb-3 px-1">Trajets simples</button>
          <button className="text-text-light hover:text-dark font-semibold pb-3 px-1 transition">Abonnements promotionnels</button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-dark mb-6">
          <span>Découvrez nos meilleures offres</span>
          <select className="font-bold underline decoration-2 underline-offset-4 cursor-pointer focus:outline-none appearance-none bg-transparent hover:text-primary transition">
            <option>Standard</option>
            <option>VIP</option>
          </select>
          <span>au départ de</span>
          <select className="font-bold underline decoration-2 underline-offset-4 cursor-pointer focus:outline-none appearance-none bg-transparent hover:text-primary transition">
            <option>Libreville</option>
            <option>Port-Gentil</option>
            <option>Franceville</option>
          </select>
        </div>

        <div className="space-y-4">
          {[
            { city: 'Oyem', province: 'Woleu-Ntem', price: '15 000 FCFA', img: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=200&h=200' },
            { city: 'Franceville', province: 'Haut-Ogooué', price: '25 000 FCFA', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=200&h=200' },
            { city: 'Mouila', province: 'Ngounié', price: '12 000 FCFA', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=200&h=200' },
          ].map((dest, i) => (
            <Link key={i} to={`/recherche?from=Libreville&to=${dest.city}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-2 border-b border-border/50 hover:bg-surface-alt transition rounded-xl sm:rounded-none group cursor-pointer">
              <div className="flex items-center gap-4 w-full sm:w-1/3 mb-4 sm:mb-0">
                <img src={dest.img} alt={dest.city} className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:shadow transition" />
                <div>
                  <h3 className="font-bold text-hero text-lg group-hover:text-primary transition">{dest.city}</h3>
                  <p className="text-text-light text-sm">({dest.province})</p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto mb-4 sm:mb-0">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary text-primary font-semibold text-sm bg-primary-50/50 group-hover:bg-primary group-hover:text-white transition">
                  Tarif promotionnel
                </span>
              </div>

              <div className="flex items-center gap-2 text-dark font-medium text-sm w-full sm:w-auto mb-4 sm:mb-0">
                <ArrowLeftRight className="w-4 h-4 text-text-light" /> Aller-retour
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto font-bold text-hero">
                <span>Depuis {dest.price}*</span>
                <Info className="w-5 h-5 text-text-light cursor-help" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== RESTEZ INFORMÉ (Inspiration Air France Img 2) ===== */}
      <section className="bg-surface-alt px-4 py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-hero mb-8 tracking-tight uppercase">Restez Informé</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer border border-border/40">
              <div className="h-64 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=800" alt="Voyageurs" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-hero mb-2 group-hover:text-primary transition">S'évader. Découvrir. Voyager.</h3>
                <p className="text-text-light text-sm leading-relaxed">Découvrez nos meilleures promotions et réservez votre trajet BusGabon en quelques clics. Plus besoin de vous déplacer pour sécuriser votre place.</p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer border border-border/40">
              <div className="h-64 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=800" alt="Nature" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-hero mb-2 group-hover:text-primary transition">Les meilleures offres pour le Woleu-Ntem</h3>
                <p className="text-text-light text-sm leading-relaxed">Découvrez Oyem, Bitam, Minvoul et bien d'autres merveilles du nord avec nos partenaires privilégiés. Voyagez en toute sécurité.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES COMPLÉMENTAIRES (Inspiration Air France Img 3) ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-hero mb-10 tracking-tight">Vous recherchez plus qu'un simple trajet ?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { img: '🚗', title: 'Louez un véhicule à un prix avantageux.', desc: 'avec GabonLocation' },
            { img: '🏨', title: 'Réservez votre hébergement et reposez-vous.', desc: 'avec Booking.com' },
            { img: '📦', title: 'Envoyez vos colis en toute sécurité.', desc: 'Service Messagerie' },
            { img: '🛡️', title: 'Assurez votre voyage et partez serein.', desc: 'avec Sunu Assurances' },
          ].map((service, i) => (
            <div key={i} className="bg-surface-alt p-6 hover:shadow-md transition group cursor-pointer flex flex-col h-full border border-border/40">
              <div className="w-16 h-16 bg-hero rounded-[14px] flex items-center justify-center text-3xl mb-6 shadow-md group-hover:-translate-y-1 transition duration-300">
                {service.img}
              </div>
              <h3 className="text-hero font-bold text-lg mb-3 leading-snug">{service.title}</h3>
              <p className="text-text-light text-sm mt-auto">avec <span className="font-semibold text-hero">{service.desc.replace('avec ', '')}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DESTINATIONS MASONRY (Inspiration Air France Img 4) ===== */}
      <section className="bg-white px-4 py-16 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-hero mb-1 tracking-tight">Destinations de voyage BusGabon</h2>
          <p className="text-text-light mb-8 font-medium">Chaque rêve a une destination</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[450px]">
            {/* Grand bloc gauche */}
            <div className="lg:col-span-6 h-[300px] lg:h-full relative overflow-hidden group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1503926839359-53e30d71a171?auto=format&fit=crop&q=80&w=1200" alt="Libreville" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-sm font-semibold tracking-wide uppercase opacity-90">Estuaire</span>
                <h3 className="text-3xl font-extrabold mt-1">Libreville</h3>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="lg:col-span-6 grid grid-rows-2 gap-4 h-[400px] lg:h-full">
              <div className="relative overflow-hidden group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&q=80&w=800" alt="Port-Gentil" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-sm font-semibold tracking-wide uppercase opacity-90">Ogooué-Maritime</span>
                  <h3 className="text-2xl font-extrabold mt-1">Port-Gentil</h3>
                </div>
              </div>
              
              <div className="relative overflow-hidden group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=800" alt="Franceville" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-sm font-semibold tracking-wide uppercase opacity-90">Haut-Ogooué</span>
                  <h3 className="text-2xl font-extrabold mt-1">Franceville</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER (Inspiration Air France Img 5) ===== */}
      <section className="bg-surface-alt px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-border flex flex-col md:flex-row min-h-[300px]">
            {/* Left part */}
            <div className="p-8 sm:p-12 md:w-3/5 flex flex-col justify-center items-start">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-hero mb-4 leading-tight">Vous recherchez des offres spéciales ?<br/>Besoin d'inspiration ?</h2>
              <p className="text-text-light mb-8 max-w-lg text-sm sm:text-base leading-relaxed">
                Inscrivez-vous ici pour recevoir des offres personnalisées, des idées de voyage et des informations sur nos nouveaux produits et services.
              </p>
              <button className="bg-primary-50 text-primary font-bold px-8 py-3.5 hover:bg-primary-100 transition border border-primary/20">
                Inscrivez-vous maintenant
              </button>
            </div>
            {/* Right part */}
            <div className="md:w-2/5 bg-hero relative flex items-center justify-center p-12 overflow-hidden min-h-[300px]">
              {/* Simulation of stacked polaroids */}
              <div className="relative w-40 h-56 z-10 scale-110">
                <div className="absolute inset-0 bg-white p-2 pb-10 shadow-2xl rotate-[-20deg] hover:rotate-[-10deg] transition duration-500 origin-bottom">
                  <img src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Travel" />
                </div>
                <div className="absolute inset-0 bg-white p-2 pb-10 shadow-2xl rotate-[-5deg] hover:rotate-[5deg] transition duration-500 origin-bottom">
                  <img src="https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Travel" />
                </div>
                <div className="absolute inset-0 bg-white p-2 pb-10 shadow-2xl rotate-[15deg] hover:rotate-[25deg] transition duration-500 origin-bottom">
                  <img src="https://images.unsplash.com/photo-1503926839359-53e30d71a171?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Travel" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VILLES ===== */}
      <section className="bg-white px-4 py-14 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-2 text-center">Villes desservies</h2>
          <p className="text-text-light text-center text-sm mb-8">24 villes au Gabon</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CITIES.map(c => (
              <Link
                key={c}
                to={`/recherche?to=${encodeURIComponent(c)}&date=${new Date().toISOString().split('T')[0]}&passengers=1`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-alt rounded-full text-sm hover:bg-primary-50 hover:text-primary transition"
              >
                <MapPin className="w-3 h-3" /> {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-surface-alt px-4 py-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-dark text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-dark hover:bg-surface-alt transition"
                >
                  {item.q}
                  <ChevronDown className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ml-2 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`accordion-content ${openFaq === i ? 'open' : ''}`}>
                  <p className="px-5 pb-4 text-sm text-text-light">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
