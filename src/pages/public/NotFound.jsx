import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl mb-4">🚌</p>
      <h1 className="text-2xl font-bold text-dark mb-2">Page introuvable</h1>
      <p className="text-text-light mb-6 text-sm">Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition text-sm">
        Retour à l'accueil
      </Link>
    </div>
  );
}
