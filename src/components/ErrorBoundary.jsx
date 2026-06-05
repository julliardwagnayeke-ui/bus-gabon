import { Component } from 'react';
import { Bus, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2 font-extrabold text-primary text-2xl mb-8">
            <Bus className="w-7 h-7" /> BusGabon
          </div>

          <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">⚠️</span>
            </div>

            <h1 className="text-xl font-bold text-dark mb-2">Une erreur est survenue</h1>
            <p className="text-text-light text-sm mb-6">
              Une erreur inattendue s'est produite. Rechargez la page pour continuer.
            </p>

            {this.state.error?.message && (
              <p className="text-xs text-text-muted font-mono bg-surface-alt rounded-lg px-4 py-3 mb-6 text-left break-all">
                {this.state.error.message}
              </p>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-dark transition"
              >
                <RefreshCw className="w-4 h-4" /> Recharger la page
              </button>
              <button
                onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
                className="w-full py-3.5 bg-surface-alt text-dark rounded-full font-semibold text-sm hover:bg-border transition border border-border"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
