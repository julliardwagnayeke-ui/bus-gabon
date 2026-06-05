import { Link } from 'react-router-dom';
import { XCircle, RotateCcw } from 'lucide-react';

export default function PaymentFailure() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-5">
        <XCircle className="w-10 h-10 text-danger" />
      </div>
      <h1 className="text-2xl font-bold text-dark mb-2">Paiement échoué</h1>
      <p className="text-text-light text-sm mb-8">
        Votre paiement n'a pas pu être traité. Vos places ont été libérées.<br />
        Réessayez ou contactez votre opérateur mobile money.
      </p>
      <div className="space-y-3">
        <Link to="/" className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition">
          <RotateCcw className="w-4 h-4" /> Nouvelle recherche
        </Link>
        <Link to="/mes-billets" className="flex items-center justify-center gap-2 w-full py-3.5 bg-surface-alt text-dark rounded-full font-semibold text-sm hover:bg-border transition border border-border">
          Mes billets
        </Link>
      </div>
    </div>
  );
}
