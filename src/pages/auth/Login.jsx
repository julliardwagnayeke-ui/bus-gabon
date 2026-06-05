import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabase';
import { useApp } from '../../context/AppContext';
import { sanitizeInput, validateEmail, checkRateLimit } from '../../lib/security';
import Button from '../../components/ui/Button';

// Comptes demo pour tester rapidement
const DEMO_USERS = [
  { label: 'Client démo', email: 'client@demo.ga', password: 'Demo1234!', role: 'client', name: 'Jean Mouketou' },
  { label: 'Agence démo', email: 'agence@demo.ga', password: 'Demo1234!', role: 'agency_admin', name: 'Transgabonaise Express', agencyId: 'demo-agency-1' },
  { label: 'Admin démo',  email: 'admin@demo.ga',  password: 'Demo1234!', role: 'platform_admin', name: 'Admin BusGabon' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginDemo } = useApp();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const from = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const cleanEmail = sanitizeInput(email).toLowerCase();
    if (!validateEmail(cleanEmail)) { setError('Adresse email invalide'); return; }
    if (!checkRateLimit('login_' + cleanEmail, 5, 60000)) { setError('Trop de tentatives. Réessayez dans 1 minute.'); return; }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (signInError) {
        const m = signInError.message?.toLowerCase() || '';
        setError(
          m.includes('invalid login credentials') ? 'Email ou mot de passe incorrect'
          : m.includes('email not confirmed') ? "Votre email n'est pas encore confirmé."
          : 'Erreur de connexion. Réessayez.'
        );
        return;
      }
      navigate(from, { replace: true });
    } catch {
      setError('Erreur de connexion. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  function loginAsDemo(demoUser) {
    loginDemo(demoUser);
    const redirect = demoUser.role === 'platform_admin' ? '/admin'
      : demoUser.role === 'agency_admin' ? '/agence/dashboard'
      : from;
    navigate(redirect, { replace: true });
  }

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
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Bonjour ! Connectez-vous</h1>
          <p className="text-text-light text-sm mt-2 font-medium">Débloquez des avantages exclusifs et une expérience personnalisée.</p>
        </div>

        {/* Demo Accounts */}
        <div className="bg-surface-alt border border-border rounded-xl p-3 mb-6">
          <p className="text-xs font-bold text-text-light mb-2 text-center uppercase tracking-wide">Comptes Démo</p>
          <div className="flex flex-wrap justify-center gap-2">
            {DEMO_USERS.map(u => (
              <button key={u.email} onClick={() => loginAsDemo(u)}
                className="px-3 py-1.5 rounded-lg bg-white border border-border text-dark text-xs font-semibold hover:border-primary hover:text-primary transition shadow-sm">
                {u.label}
              </button>
            ))}
          </div>
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="text-xs font-bold text-dark ml-1 mb-1 block">Adresse e-mail *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition" />
          </div>

          <div>
            <label className="text-xs font-bold text-dark ml-1 mb-1 block">Mot de passe *</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition" />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-dark">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link to="/mot-de-passe-oublie" className="text-xs font-semibold text-text-light hover:text-dark transition">Mot de passe oublié ?</Link>
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full bg-dark hover:bg-black text-white" size="lg">Continuer</Button>
        </form>

        <p className="text-sm text-center text-dark mt-6 font-medium">
          Vous n'avez pas de compte ?{' '}
          <Link to="/inscription" className="text-primary font-bold hover:underline">Inscrivez-vous</Link>
        </p>

        <p className="text-[10px] text-center text-text-light mt-8 leading-relaxed max-w-xs mx-auto">
          En créant votre compte, vous confirmez avoir lu et accepté les <Link to="/terms" className="underline hover:text-dark">Conditions générales</Link> et avoir lu la <Link to="/terms" className="underline hover:text-dark">Politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
