import { Shield, Lock, CheckCircle, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: 'Paiement sécurisé',
    description: 'Vos transactions sont protégées par des standards bancaires.',
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    title: 'Agences vérifiées',
    description: 'Toutes nos agences partenaires sont contrôlées et approuvées.',
  },
  {
    icon: <Lock className="w-6 h-6 text-primary" />,
    title: 'Billet sécurisé',
    description: 'Votre billet QR code est unique et infalsifiable.',
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour vous accompagner.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-surface-alt">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Pourquoi nous faire confiance ?
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            BusGabon digitalise le transport au Gabon pour vous offrir une expérience moderne et sécurisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="font-bold text-dark mb-2">{feature.title}</h3>
              <p className="text-sm text-text-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}