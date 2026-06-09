import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { sanitizeInput, validateEmail, validatePhone } from '../../lib/security';

const SUPPORT_EMAIL = 'contact@busgabon.ga';
import Button from '../../components/ui/Button';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function validate() {
    const e = {};
    if (!form.name.trim())                    e.name    = 'Nom requis';
    if (!form.email.trim() && !form.phone.trim()) e.email = 'Email ou téléphone requis';
    if (form.email && !validateEmail(form.email)) e.email = 'Email invalide';
    if (form.phone && !validatePhone(form.phone)) e.phone = 'Numéro invalide';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message trop court (10 caractères min.)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      // Pas de backend dédié : on ouvre le client mail pré-rempli.
      const subject = sanitizeInput(form.subject) || 'Contact BusGabon';
      const body = [
        `Nom : ${sanitizeInput(form.name)}`,
        `Email : ${sanitizeInput(form.email)}`,
        `Téléphone : ${sanitizeInput(form.phone)}`,
        '',
        sanitizeInput(form.message),
      ].join('\n');
      window.location.href =
        `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setDone(true);
    } catch (err) {
      setServerError(err.message || 'Envoi impossible. Réessayez plus tard.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Message envoyé</h1>
        <p className="text-text-light text-sm mb-6">Merci ! Notre équipe vous répond sous 24h ouvrées.</p>
        <Button onClick={() => { setForm({ name: '', email: '', phone: '', subject: '', message: '' }); setDone(false); }}>
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-dark mb-2">Nous contacter</h1>
        <p className="text-text-light text-sm">Une question, un retour, un signalement ? Écrivez-nous.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Coordonnées */}
        <aside className="md:col-span-1 space-y-4">
          <div className="glass rounded-2xl p-5">
            <Phone className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-text-muted">Téléphone</p>
            <a href="tel:+241000000000" className="font-semibold text-dark text-sm hover:text-primary">+241 XX XX XX XX</a>
          </div>
          <div className="glass rounded-2xl p-5">
            <Mail className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-text-muted">Email</p>
            <a href="mailto:contact@busgabon.ga" className="font-semibold text-dark text-sm hover:text-primary">contact@busgabon.ga</a>
          </div>
          <div className="glass rounded-2xl p-5">
            <MapPin className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-text-muted">Siège</p>
            <p className="font-semibold text-dark text-sm">Libreville, Gabon</p>
          </div>
        </aside>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-xs font-medium text-dark mb-1 block">Nom complet *</label>
              <input
                id="name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`}
              />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="text-xs font-medium text-dark mb-1 block">Téléphone</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="077 12 34 56"
                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`}
              />
              {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-medium text-dark mb-1 block">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="vous@email.com"
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm`}
            />
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="subject" className="text-xs font-medium text-dark mb-1 block">Sujet</label>
            <input
              id="subject"
              value={form.subject}
              onChange={e => set('subject', e.target.value)}
              placeholder="À quel sujet souhaitez-vous nous contacter ?"
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm"
            />
          </div>

          <div>
            <label htmlFor="message" className="text-xs font-medium text-dark mb-1 block">Message *</label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={e => set('message', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-danger' : 'border-border'} focus:outline-none focus:border-primary text-sm resize-none`}
            />
            {errors.message && <p className="text-xs text-danger mt-1">{errors.message}</p>}
          </div>

          {serverError && (
            <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl">{serverError}</div>
          )}

          <Button type="submit" loading={submitting} className="w-full" size="lg">
            <Send className="w-4 h-4" /> Envoyer le message
          </Button>
        </form>
      </div>
    </div>
  );
}
