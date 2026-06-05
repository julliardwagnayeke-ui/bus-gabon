import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Réservation',
    items: [
      { q: 'Comment réserver un billet ?', a: 'Choisissez votre ville de départ, votre destination et votre date sur la page d’accueil. Sélectionnez ensuite un départ parmi les agences proposées, renseignez vos informations passager et payez en ligne.' },
      { q: 'Combien de billets puis-je acheter ?', a: 'Jusqu’à 4 billets par commande. Au-delà, contactez directement l’agence ou créez plusieurs réservations.' },
      { q: 'Puis-je choisir mon siège ?', a: 'Non. Chaque agence attribue les places sur place selon son organisation interne. Présentez-vous à l’embarquement avec votre QR code.' },
      { q: 'Que faire si un trajet n’apparaît pas ?', a: 'Toutes les agences ne publient pas encore leurs départs en ligne. Essayez une date différente ou contactez-nous pour signaler une demande.' },
    ],
  },
  {
    title: 'Paiement',
    items: [
      { q: 'Quels modes de paiement sont acceptés ?', a: 'Mobile money gabonais (Airtel Money, Moov Money). Les cartes bancaires internationales seront prochainement disponibles.' },
      { q: 'Y a-t-il des frais cachés ?', a: 'Non. Le tarif affiché inclut le prix du billet et 200 FCFA de frais de service par commande, quel que soit le nombre de billets.' },
      { q: 'Que se passe-t-il en cas d’échec de paiement ?', a: 'Aucun débit n’est confirmé. Votre réservation est annulée automatiquement après 10 minutes. Vous pouvez relancer une nouvelle commande à tout moment.' },
    ],
  },
  {
    title: 'Bagages',
    items: [
      { q: 'Combien de bagages sont inclus ?', a: 'Chaque agence définit sa propre politique. Les détails (nombre de bagages inclus, poids maximum, frais supplémentaires) sont affichés clairement sur la page de détail du départ avant paiement.' },
      { q: 'Comment payer un bagage supplémentaire ?', a: 'Le tarif est précisé sur la page du départ. Le paiement s’effectue directement à l’agence à l’embarquement.' },
    ],
  },
  {
    title: 'Le jour du voyage',
    items: [
      { q: 'Comment recevoir mon billet ?', a: 'Dès paiement confirmé, votre billet QR code est disponible immédiatement dans « Mes billets ». Vous pouvez aussi le recevoir par WhatsApp ou email.' },
      { q: 'Comment valider mon billet ?', a: 'Présentez le QR code de votre billet à l’agent au point d’embarquement. Un seul scan suffit.' },
      { q: 'Que faire si je suis en retard ?', a: 'Contactez immédiatement l’agence dont les coordonnées figurent sur votre billet. Les politiques d’annulation et de report dépendent de chaque agence.' },
    ],
  },
];

export default function FAQ() {
  const [openKey, setOpenKey] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          <HelpCircle className="w-3.5 h-3.5" /> Aide
        </span>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Questions fréquentes</h1>
        <p className="text-text-light text-sm">Tout ce que vous devez savoir avant de réserver votre prochain trajet.</p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((sec, si) => (
          <section key={sec.title}>
            <h2 className="text-base font-bold text-dark mb-3">{sec.title}</h2>
            <div className="space-y-2">
              {sec.items.map((item, qi) => {
                const key = `${si}-${qi}`;
                const open = openKey === key;
                return (
                  <div key={key} className="bg-white rounded-2xl border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenKey(open ? null : key)}
                      aria-expanded={open}
                      aria-controls={`faq-${key}`}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-dark hover:bg-surface-alt transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {item.q}
                      <ChevronDown className={`w-4 h-4 text-text-muted transition-transform flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <div id={`faq-${key}`} className={`accordion-content ${open ? 'open' : ''}`}>
                      <p className="px-5 pb-4 text-sm text-text-light">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 glass rounded-2xl p-6 text-center">
        <h3 className="font-bold text-dark mb-2">Vous ne trouvez pas la réponse ?</h3>
        <p className="text-sm text-text-light mb-4">Notre équipe répond sous 24h ouvrées.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary-dark transition"
        >
          <Mail className="w-4 h-4" /> Nous contacter
        </Link>
      </div>
    </div>
  );
}
