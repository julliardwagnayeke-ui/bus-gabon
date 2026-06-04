'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Mail, Send } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { formValidators } from '@/lib/validators';

const contactMethods = [
  {
    title: 'WhatsApp',
    description: 'Réponse la plus rapide',
    icon: <MessageCircle className="w-6 h-6" />,
    action: 'Écrire sur WhatsApp',
    link: 'https://wa.me/241XXXXXXXXX',
    color: 'bg-green-500',
  },
  {
    title: 'Téléphone',
    description: 'Support direct',
    icon: <Phone className="w-6 h-6" />,
    action: 'Appeler maintenant',
    link: 'tel:+241XXXXXXXXX',
    color: 'bg-blue-500',
  },
  {
    title: 'Email',
    description: 'Pour les demandes détaillées',
    icon: <Mail className="w-6 h-6" />,
    action: 'Envoyer un email',
    link: 'mailto:support@busgabon.com',
    color: 'bg-purple-500',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    reservationCode: '',
    message: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formValidators.required(formData.name)) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formValidators.required(formData.email) || !formValidators.email(formData.email)) {
      newErrors.email = 'Email valide requis';
    }

    if (!formValidators.required(formData.phone) || !formValidators.phone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone valide requis';
    }

    if (!formValidators.required(formData.subject)) {
      newErrors.subject = 'Le sujet est requis';
    }

    if (!formValidators.required(formData.message)) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement contact form submission
      console.log('Sending contact form:', formData);
      alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        reservationCode: '',
        message: '',
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-dark mb-2">Contactez-nous</h1>
          <p className="text-text-light">
            Notre équipe est là pour vous aider
          </p>
        </div>

        {/* Quick Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:border-primary transition-colors text-center group"
            >
              <div className={`w-12 h-12 ${method.color} text-white rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {method.icon}
              </div>
              <h3 className="font-bold text-dark mb-2">{method.title}</h3>
              <p className="text-sm text-text-light mb-4">{method.description}</p>
              <span className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors">
                {method.action}
              </span>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-dark mb-2">Envoyez-nous un message</h2>
            <p className="text-text-light">
              Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom complet"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                required
              />

              <Input
                label="Téléphone WhatsApp"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                required
              />

              <Input
                label="Sujet"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                error={errors.subject}
                required
              />
            </div>

            <Input
              label="Code de réservation (optionnel)"
              value={formData.reservationCode}
              onChange={(e) => setFormData({ ...formData, reservationCode: e.target.value })}
              placeholder="Ex: BUSGAB-ABC123"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-text">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border border-border bg-surface text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                rows={5}
                placeholder="Décrivez votre problème ou votre question..."
                required
              />
              {errors.message && (
                <p className="text-sm text-red-600">{errors.message}</p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              <Send className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-2">Horaires de support</h3>
          <p className="text-blue-700 text-sm">
            Notre équipe est disponible du lundi au samedi de 8h à 20h, et le dimanche de 10h à 18h.
            Pour les urgences en dehors de ces horaires, utilisez WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}