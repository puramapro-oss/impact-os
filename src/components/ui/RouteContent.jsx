import { Component, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './RouteContent.css';

class PageErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <section className="glass-card route-recovery" style={{ padding: 24 }}>
        <p role="alert">La page n’a pas pu être chargée.</p>
        <p>Vous pouvez recharger la page ou revenir à l’accueil.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
            Recharger la page
          </button>
          <Link to="/" className="btn-secondary">Retour à l’accueil</Link>
        </div>
      </section>
    );
  }
}

export default function RouteContent({ children }) {
  const { pathname } = useLocation();

  return (
    <PageErrorBoundary key={pathname}>
      <Suspense fallback={
        <p role="status" aria-live="polite" style={{ padding: 24 }}>
          Chargement de la page…
        </p>
      }>
        {children}
      </Suspense>
    </PageErrorBoundary>
  );
}
