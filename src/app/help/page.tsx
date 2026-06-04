import Link from 'next/link';
import { HelpCircle, Search, CreditCard, Ticket as TicketIcon, MessageCircle, Phone } from 'lucide-react';

const faqs = [
  {
    category: 'Réservation',
    icon: <Search className="w-5 h-5" />,
    questions: [
      {
        q: 'Comment réserver un billet ?',
        a: 'Remplissez le formulaire de recherche avec votre ville de départ, d\'arrivée et la date souhaitée. Choisissez un départ, remplissez vos informations et payez en ligne.',
      },
      {
        q: 'Puis-je réserver pour plusieurs personnes ?',
        a: 'Oui, vous pouvez réserver jusqu\'à 4 billets par commande. Les informations de chaque passager sont collectées lors du processus de réservation.',
      },
      {
        q: 'Faut-il créer un compte pour réserver ?',
        a: 'Non, vous pouvez réserver sans compte. Cependant, créer un compte vous permet de retrouver facilement vos réservations.',
      },
    ],
  },
  {
    category: 'Paiement',
    icon: <CreditCard className="w-5 h-5" />,
    questions: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons Airtel Money, Moov Money et les cartes bancaires (Visa, Mastercard). Le paiement s\'effectue de manière sécurisée.',
      },
      {
        q: 'Le paiement est-il sécurisé ?',
        a: 'Oui, tous les paiements sont traités via des passerelles sécurisées conformes aux standards bancaires internationaux.',
      },
      {
        q: 'Que se passe-t-il si mon paiement échoue ?',
        a: 'Vous pouvez réessayer le paiement immédiatement. Si le problème persiste, contactez notre support.',
      },
    ],
  },
  {
    category: 'Billets',
    icon: <TicketIcon className="w-5 h-5" />,
    questions: [
      {
        q: 'Comment recevoir mon billet ?',
        a: 'Votre billet QR code vous est envoyé par WhatsApp et email immédiatement après confirmation du paiement.',
      },
      {
        q: 'Que faire si je ne reçois pas mon billet ?',
        a: 'Vérifiez vos spams et contactez notre support WhatsApp. Nous pouvons vous renvoyer votre billet.',
      },
      {
        q: 'Puis-je annuler ou modifier ma réservation ?',
        a: 'Contactez directement l\'agence selon leur politique d\'annulation. BusGabon ne facture pas de frais d\'annulation.',
      },
    ],
  },
];

const contactOptions = [
  {
    title: 'WhatsApp Support',
    description: 'Réponse rapide 24h/24',
    icon: <MessageCircle className="w-6 h-6" />,
    action: 'Contacter via WhatsApp',
    link: 'https://wa.me/241XXXXXXXXX',
  },
  {
    title: 'Téléphone',
    description: 'Support téléphonique',
    icon: <Phone className="w-6 h-6" />,
    action: 'Appeler le support',
    link: 'tel:+241XXXXXXXXX',
  },
  {
    title: 'Email',
    description: 'Pour les demandes complexes',
    icon: <HelpCircle className="w-6 h-6" />,
    action: 'Envoyer un email',
    link: 'mailto:support@busgabon.com',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-dark mb-2">Centre d'aide</h1>
          <p className="text-text-light">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8 mb-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-dark">{category.category}</h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <details key={faqIndex} className="border border-border rounded-xl">
                    <summary className="p-4 font-semibold text-dark cursor-pointer hover:bg-surface-alt transition-colors">
                      {faq.q}
                    </summary>
                    <div className="px-4 pb-4 text-text-light">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Options */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">Nous contacter</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <div key={index} className="text-center p-6 border border-border rounded-xl hover:border-primary transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {option.icon}
                </div>
                <h3 className="font-bold text-dark mb-2">{option.title}</h3>
                <p className="text-sm text-text-light mb-4">{option.description}</p>
                <Link
                  href={option.link}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  {option.action}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-text-light mb-4">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Formulaire de contact
          </Link>
        </div>
      </div>
    </div>
  );
}