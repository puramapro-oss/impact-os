import { useState } from 'react';
import {
  Sparkles, Send, FileText, Euro, Users, Calendar,
  Shield, BarChart3, Clock, CheckCircle, Loader
} from 'lucide-react';
import { historiqueResoutre } from '../data/mockData';
import { formatRelativeTime } from '../hooks/useRelativeTime';
import { useToast } from '../contexts/ToastContext';

const suggestions = [
  { icon: FileText, text: 'Rédiger un courrier pour la mairie' },
  { icon: Euro, text: 'Trouver des subventions sport jeunesse' },
  { icon: Users, text: 'Organiser l\'assemblée générale' },
  { icon: Calendar, text: 'Planifier un événement de 200 personnes' },
  { icon: Shield, text: 'Mettre en conformité RGPD' },
  { icon: BarChart3, text: 'Générer un rapport d\'impact trimestriel' },
  { icon: Euro, text: 'Calculer le budget prévisionnel 2026' },
  { icon: FileText, text: 'Préparer le dossier de demande CNDS' },
];

const steps = [
  'Analyse de votre demande...',
  'Recherche dans la base de connaissances...',
  'Vérification des réglementations en vigueur...',
  'Génération de la réponse personnalisée...',
  'Préparation des documents associés...',
];

export default function Resoutre() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleSubmit = (text) => {
    const q = text || query;
    if (!q.trim()) return;
    setProcessing(true);
    setCurrentStep(0);
    setResult(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setProcessing(false);
          setResult({
            question: q,
            reponse: `Voici ma réponse détaillée concernant "${q}" :\n\n1. **Analyse** : J'ai analysé votre demande en tenant compte du contexte de l'Association Sportive Les Aigles de Lyon.\n\n2. **Recommandations** :\n   - Commencer par rassembler les documents nécessaires (statuts, bilan N-1, liste des bénéficiaires)\n   - Contacter les organismes concernés pour vérifier les délais\n   - Utiliser le modèle pré-rempli que j'ai préparé\n\n3. **Documents générés** :\n   - Courrier type pré-rempli avec vos informations\n   - Checklist des pièces justificatives\n   - Calendrier des étapes à suivre\n\n4. **Prochaines étapes** : Je peux exécuter ces actions automatiquement si vous activez le mode AUTOPILOT.`,
            documents: ['Courrier_type.pdf', 'Checklist_pieces.pdf', 'Calendrier_etapes.xlsx'],
          });
          addToast('Analyse terminée avec succès', 'success');
        }, 500);
      }
    }, 800);
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={28} color="#f59e0b" />
          RESOUTRE
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Posez n'importe quelle question administrative. L'IA analyse, propose et exécute.
        </p>
      </div>

      {/* Input area */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Décrivez votre besoin en langage naturel..."
          style={{
            width: '100%', minHeight: 120, padding: 16,
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-btn)', color: 'var(--text-primary)',
            fontSize: 15, resize: 'vertical', lineHeight: 1.6,
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⌘ + Entrée pour envoyer</span>
          <button
            onClick={() => handleSubmit()}
            className="btn-primary"
            disabled={processing || !query.trim()}
            style={{ opacity: processing || !query.trim() ? 0.5 : 1 }}
          >
            {processing ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
            {processing ? 'Analyse en cours...' : 'Analyser'}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {!processing && !result && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Suggestions rapides
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <button key={i} onClick={() => { setQuery(s.text); handleSubmit(s.text); }}
                  className="glass-card" style={{
                    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    background: 'var(--bg-card)', color: 'var(--text-primary)',
                    fontSize: 13, textAlign: 'left', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <Icon size={16} color="#f59e0b" />
                  {s.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Processing animation */}
      {processing && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Traitement en cours...</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {i < currentStep ? (
                  <CheckCircle size={18} color="#10b981" />
                ) : i === currentStep ? (
                  <Loader size={18} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                )}
                <span style={{
                  fontSize: 13,
                  color: i <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: i === currentStep ? 600 : 400,
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24, animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <CheckCircle size={20} color="#10b981" />
            <h3 style={{ fontSize: 16 }}>Résultat</h3>
          </div>
          <div style={{
            fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8,
            whiteSpace: 'pre-wrap', marginBottom: 20,
          }}>
            {result.reponse}
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Documents générés</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              {result.documents.map((doc, i) => (
                <button key={i} onClick={() => addToast(`${doc} téléchargé`, 'success')}
                  className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>
                  <FileText size={14} /> {doc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Historique RESOUTRE</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {historiqueResoutre.map((h) => (
            <div key={h.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 8,
              cursor: 'pointer', transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            onClick={() => { setQuery(h.question); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={14} color="#f59e0b" />
                <span style={{ fontSize: 13 }}>{h.question}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge badge-green" style={{ fontSize: 10 }}>{h.statut}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(h.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
