import { CheckCircle, Search, CreditCard, Smartphone } from 'lucide-react';

const steps = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: 'Recherchez votre trajet',
    description: 'Choisissez votre ville de départ, d\'arrivée et la date souhaitée.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: 'Réservez et payez',
    description: 'Sélectionnez votre départ et payez en toute sécurité via mobile money.',
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: 'Recevez votre billet',
    description: 'Votre billet QR code vous est envoyé par WhatsApp et email.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-dark mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Réservez votre billet de bus en 3 étapes simples et sécurisées.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">
                {index + 1}. {step.title}
              </h3>
              <p className="text-text-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}