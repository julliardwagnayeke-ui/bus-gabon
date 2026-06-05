import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSent(true);
    } catch {
      setError('Impossible d\'envoyer l\'email. Vérifiez l\'adresse.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-primary text-2xl">
            <Bus className="w-7 h-7" /> BusGabon
          </Link>
          <h1 className="text-2xl font-bold text-dark mt-3">Mot de passe oublié</h1>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-success font-semibold mb-2">Email envoyé !</p>
              <p className="text-sm text-text-light mb-5">Consultez votre boîte mail pour réinitialiser votre mot de passe.</p>
              <Link to="/connexion" className="text-primary font-semibold hover:underline text-sm">Retour à la connexion</Link>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-dark mb-1 block">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm" />
                </div>
                <Button type="submit" loading={loading} className="w-full" size="lg">Envoyer le lien</Button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/connexion" className="text-sm text-text-light hover:text-dark flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
