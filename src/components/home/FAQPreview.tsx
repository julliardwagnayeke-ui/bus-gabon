import Link from 'next/link';

const faqs = [
  {
    question: 'Comment réserver un billet ?',
    answer: 'Remplissez le formulaire de recherche, choisissez votre départ et payez en ligne.',
  },
  {
    question: 'Quels sont les moyens de paiement ?',
    answer: 'Airtel Money, Moov Money et cartes bancaires (bientôt disponible).',
  },
  {
    question: 'Comment recevoir mon billet ?',
    answer: 'Votre billet QR code vous est envoyé par WhatsApp et email immédiatement après paiement.',
  },
  {
    question: 'Puis-je annuler ma réservation ?',
    answer: 'Contactez l\'agence directement selon leur politique d\'annulation.',
  },
];

export default function FAQPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Questions fréquentes
          </h2>
          <p className="text-text-light">
            Trouvez rapidement les réponses à vos questions.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-surface-alt rounded-xl p-6 cursor-pointer">
              <summary className="font-semibold text-dark flex justify-between items-center">
                {faq.question}
                <span className="text-primary">▼</span>
              </summary>
              <p className="text-text-light mt-4">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/help"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Voir toutes les FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}