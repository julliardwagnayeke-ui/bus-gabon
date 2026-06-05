import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabase';
import { sanitizeInput, validateEmail, validatePassword } from '../../lib/security';
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const name  = sanitizeInput(form.name);
    const email = sanitizeInput(form.email).toLowerCase();
    const phone = sanitizeInput(form.phone);
    if (!name)  { setError('Nom requis'); return; }
    if (!validateEmail(email)) { setError('Email invalide'); return; }
    const pwCheck = validatePassword(form.password);
    if (!pwCheck.length) { setError('Le mot de passe doit contenir au moins 8 caractères'); return; }

    setLoading(true);
    try {
      // Le profil (table profiles) est créé automatiquement par le trigger
      // handle_new_user à partir des métadonnées (full_name, phone).
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: { data: { full_name: name, phone } },
      });
      if (signUpError) {
        const m = signUpError.message?.toLowerCase() || '';
        setError(m.includes('already') || m.includes('registered')
          ? 'Cet email est déjà utilisé.'
          : "Erreur lors de l'inscription.");
        return;
      }
      if (data.session) {
        navigate('/mes-billets', { replace: true });
      } else {
        // Confirmation email activée : pas de session immédiate
        setError('Compte créé ! Vérifiez votre email pour confirmer, puis connectez-vous.');
      }
    } catch {
      setError("Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition';

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with diagonal color overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Diagonal shape overlay in primary blue */}
        <div className="absolute top-0 left-0 w-full h-[40%] bg-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 100%)' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mt-12 mb-12">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-primary text-2xl mb-4">
            <Bus className="w-6 h-6" /> BusGabon
          </Link>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Bonjour ! Créez un compte</h1>
          <p className="text-text-light text-sm mt-2 font-medium">Débloquez des avantages exclusifs et une expérience personnalisée.</p>
        </div>

        {/* Social Logins */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-border rounded-xl hover:bg-surface-alt transition font-semibold text-dark text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-border rounded-xl hover:bg-surface-alt transition font-semibold text-dark text-sm">
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continuer avec Facebook
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-border rounded-xl hover:bg-surface-alt transition font-semibold text-dark text-sm">
            <svg className="w-5 h-5" fill="black" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.948 1.56-.048 2.619-1.503 3.616-2.978 1.155-1.682 1.632-3.315 1.652-3.4-.031-.013-3.181-1.22-3.21-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.509 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/></svg>
            Continuer avec Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-xs font-semibold text-text-light uppercase">ou</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="text-xs font-bold text-dark ml-1 mb-1 block">Nom complet *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Jean Mouketou" className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-bold text-dark ml-1 mb-1 block">Adresse e-mail *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="votre@email.com" className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-bold text-dark ml-1 mb-1 block">Téléphone (optionnel)</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+241 XX XX XX XX" className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-bold text-dark ml-1 mb-1 block">Mot de passe *</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required placeholder="8 caractères minimum" className={inputClass} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-dark">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full bg-dark hover:bg-black text-white mt-2" size="lg">Continuer</Button>
        </form>

        <p className="text-sm text-center text-dark mt-6 font-medium">
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" className="text-primary font-bold hover:underline">Connectez-vous</Link>
        </p>

        <p className="text-[10px] text-center text-text-light mt-8 leading-relaxed max-w-xs mx-auto">
          En créant votre compte, vous confirmez avoir lu et accepté les <Link to="/terms" className="underline hover:text-dark">Conditions générales</Link> et avoir lu la <Link to="/terms" className="underline hover:text-dark">Politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
