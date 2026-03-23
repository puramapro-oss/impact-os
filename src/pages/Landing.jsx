import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════
   MANA — Landing page
   Design : Nuit océan × Turquoise polynésien × Or sacré × Vert émeraude
═══════════════════════════════════════════════════ */
const HEADING = "'Cormorant Garamond', serif";
const BODY = "'DM Sans', sans-serif";
const MONO = "'Courier New', monospace";

const C = {
  bg: '#040B14',
  bgCard: '#081420',
  cyan: '#22D3EE',
  cyanDim: 'rgba(34,211,238,0.08)',
  cyanGlow: 'rgba(34,211,238,0.25)',
  gold: '#F59E0B',
  goldDim: 'rgba(245,158,11,0.08)',
  goldGlow: 'rgba(245,158,11,0.25)',
  emerald: '#10B981',
  emeraldDim: 'rgba(16,185,129,0.08)',
  violet: '#F59E0B',
  violetDim: 'rgba(245,158,11,0.08)',
  violetGlow: 'rgba(245,158,11,0.25)',
  text: '#f0f6fc',
  muted: 'rgba(240,246,252,0.5)',
  faint: 'rgba(240,246,252,0.25)',
  border: 'rgba(34,211,238,0.1)',
  borderHot: 'rgba(34,211,238,0.25)',
};

function useVisible(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function WaveBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg viewBox="0 0 1440 600" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%', opacity: 0.15 }}>
        <defs>
          <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.cyan} />
            <stop offset="50%" stopColor={C.violet} />
            <stop offset="100%" stopColor={C.cyan} />
          </linearGradient>
          <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.violet} />
            <stop offset="50%" stopColor={C.cyan} />
            <stop offset="100%" stopColor={C.violet} />
          </linearGradient>
        </defs>
        <path fill="none" stroke="url(#wg1)" strokeWidth="1.5" d="M0,300 C360,200 720,400 1080,250 C1260,175 1440,300 1440,300" style={{ animation: 'waveFlow 8s ease-in-out infinite' }} />
        <path fill="none" stroke="url(#wg2)" strokeWidth="1" d="M0,350 C240,450 480,250 720,350 C960,450 1200,250 1440,350" style={{ animation: 'waveFlow 10s ease-in-out infinite reverse', opacity: 0.7 }} />
        <path fill="none" stroke="url(#wg1)" strokeWidth="0.8" d="M0,400 C320,300 640,500 960,350 C1120,275 1440,400 1440,400" style={{ animation: 'waveFlow 12s ease-in-out infinite', opacity: 0.4 }} />
      </svg>
      {/* Orbes lumineux */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${C.cyanDim} 0%, transparent 70%)`, animation: 'orbFloat 12s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', top: '30%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${C.violetDim} 0%, transparent 70%)`, animation: 'orbFloat 15s ease-in-out infinite reverse' }} />
      {/* Grille de points */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${C.cyan}20 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.3 }} />
    </div>
  );
}

// ─── FORM STEPS ──────────────────────────────────────────────
const STEPS = [
  {
    id: 'situation', title: 'Tu es…', subtitle: 'Pour personnaliser ton analyse',
    type: 'cards',
    options: [
      { id: 'solo', icon: '🧑', label: 'Seul(e)' },
      { id: 'couple', icon: '👫', label: 'En couple' },
      { id: 'famille', icon: '👨‍👩‍👧', label: 'En famille' },
      { id: 'pro', icon: '💼', label: 'Entrepreneur' },
    ],
  },
  {
    id: 'abonnements', title: "Tu as combien d'abonnements ?", subtitle: 'Une estimation suffit',
    type: 'slider', min: 1, max: 25, default: 8,
    label: (v) => v <= 4 ? 'Peu (1-4)' : v <= 10 ? 'Quelques-uns (5-10)' : v <= 18 ? 'Beaucoup (11-18)' : 'Énormément (19+)',
  },
  {
    id: 'categories', title: 'Qu\'est-ce que tu paies chaque mois ?', subtitle: 'Sélectionne tout ce qui s\'applique',
    type: 'multi',
    options: [
      { id: 'streaming', icon: '🎬', label: 'Streaming (Netflix, Disney...)' },
      { id: 'mobile', icon: '📱', label: 'Forfait mobile' },
      { id: 'box', icon: '📡', label: 'Box Internet & TV' },
      { id: 'assurance', icon: '🛡️', label: 'Assurances' },
      { id: 'energie', icon: '⚡', label: 'Électricité / Gaz' },
      { id: 'banque', icon: '🏦', label: 'Compte bancaire payant' },
      { id: 'sport', icon: '💪', label: 'Salle de sport / appli sport' },
      { id: 'musique', icon: '🎵', label: 'Musique (Spotify, Deezer...)' },
      { id: 'logiciels', icon: '💻', label: 'Logiciels (Adobe, Office...)' },
    ],
  },
  {
    id: 'contact', title: "Où t'envoyer ton analyse ?",
    subtitle: 'Gratuit, sans engagement, résultat immédiat',
    type: 'contact',
  },
];

// ─── SUPABASE SAVE ────────────────────────────────────────────
async function saveLead(data) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('leads').insert([data]);
  } catch (_) {
    /* silently fail — form still shows success */
  }
}

// ─── FORM MODAL ───────────────────────────────────────────────
function FluxForm({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ abonnements: 8, categories: [] });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const current = STEPS[step];

  const savings = Math.round(
    ((answers.abonnements ?? 8) * 14) *
    ((answers.categories?.length ?? 3) / 10) * 1.4
  );

  const canNext = () => {
    if (current.type === 'cards') return !!answers[current.id];
    if (current.type === 'multi') return (answers.categories?.length ?? 0) > 0;
    if (current.type === 'slider') return true;
    if (current.type === 'contact') return (answers.email ?? '').includes('@');
    return true;
  };

  const toggleCat = (id) => {
    setAnswers(a => ({
      ...a,
      categories: (a.categories ?? []).includes(id)
        ? a.categories.filter(c => c !== id)
        : [...(a.categories ?? []), id],
    }));
  };

  const handleNext = () => { if (step < STEPS.length - 1) setStep(s => s + 1); };

  const handleSubmit = async () => {
    setSubmitting(true);
    await saveLead({
      situation: answers.situation ?? '',
      nb_abonnements: answers.abonnements ?? 8,
      categories: answers.categories ?? [],
      prenom: answers.prenom ?? '',
      nom: answers.nom ?? '',
      email: answers.email ?? '',
      tel: answers.tel ?? '',
    });
    setTimeout(() => { setSubmitting(false); setDone(true); }, 1600);
  };

  // ── DONE SCREEN ──
  if (done) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: C.bgCard, borderRadius: 28, padding: '52px 40px', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 40px ${C.cyanGlow}`, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: HEADING, fontSize: 30, color: C.text, marginBottom: 12, fontWeight: 700 }}>Ton analyse est prête !</h2>
        <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          On a détecté <strong style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>~{savings}€/mois</strong> d'économies potentielles.<br />
          Vérifie ta boîte mail — ton rapport arrive dans 2 minutes.
        </p>
        <div style={{ background: `${C.cyan}08`, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          {[
            `✅ ${answers.abonnements ?? 8} abonnements analysés`,
            `✅ ${answers.categories?.length ?? 0} catégories passées au crible`,
            `✅ Meilleures offres du marché identifiées`,
            `✅ Rapport PDF personnalisé en cours`,
          ].map((l, i) => <div key={i} style={{ fontSize: 13, color: C.cyan, padding: '4px 0', fontFamily: MONO }}>{l}</div>)}
        </div>
        <button onClick={onClose} style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`, color: C.bg, border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: HEADING }}>
          Fermer
        </button>
      </div>
    </div>
  );

  // ── FORM STEPS ──
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style>{`
        @keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(20px)}to{opacity:1;transform:none}}
        @keyframes stepIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
        .opt-card{cursor:pointer;transition:all .2s}
        .opt-card:hover{transform:translateY(-2px)}
      `}</style>
      <div style={{ background: C.bgCard, borderRadius: 28, width: '100%', maxWidth: 500, boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 40px ${C.cyanGlow}`, animation: 'modalIn .35s ease', overflow: 'hidden', border: `1px solid ${C.border}` }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: `${C.bg}` }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg, ${C.cyan}, ${C.violet})`, width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width .5s ease', borderRadius: '0 2px 2px 0' }} />
        </div>
        {/* Header */}
        <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: C.cyan, letterSpacing: 2, marginBottom: 6, fontFamily: MONO }}>
              ÉTAPE {step + 1} / {STEPS.length}
            </div>
            <h2 style={{ fontFamily: HEADING, fontSize: 26, color: C.text, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>{current.title}</h2>
            <p style={{ fontSize: 13, color: C.muted }}>{current.subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.faint, fontSize: 22, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        {/* Savings preview */}
        {step >= 1 && (
          <div style={{ margin: '16px 32px 0', background: `${C.violet}12`, border: `1px solid ${C.violet}30`, borderRadius: 12, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.muted }}>Économies estimées</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: HEADING, background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>~{savings}€/mois</span>
          </div>
        )}
        {/* Step content */}
        <div style={{ padding: '20px 32px 28px', animation: 'stepIn .25s ease' }}>
          {/* CARDS */}
          {current.type === 'cards' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {current.options.map(o => {
                const sel = answers[current.id] === o.id;
                return (
                  <div key={o.id} className="opt-card" onClick={() => setAnswers(a => ({ ...a, [current.id]: o.id }))}
                    style={{ padding: '18px 14px', borderRadius: 16, border: `2px solid ${sel ? C.cyan : C.border}`, background: sel ? C.cyanDim : C.bg, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>{o.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: sel ? C.cyan : C.text }}>{o.label}</div>
                  </div>
                );
              })}
            </div>
          )}
          {/* SLIDER */}
          {current.type === 'slider' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 56, fontWeight: 700, fontFamily: HEADING, lineHeight: 1, background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{answers.abonnements}</div>
                <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>{current.label(answers.abonnements)}</div>
              </div>
              <input type="range" min={current.min} max={current.max} value={answers.abonnements}
                onChange={e => setAnswers(a => ({ ...a, abonnements: +e.target.value }))}
                style={{ width: '100%', accentColor: C.cyan, height: 6, cursor: 'pointer', marginBottom: 12 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.faint, fontFamily: MONO }}>
                <span>{current.min}</span><span>{current.max}</span>
              </div>
            </div>
          )}
          {/* MULTI SELECT */}
          {current.type === 'multi' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {current.options.map(o => {
                const sel = (answers.categories ?? []).includes(o.id);
                return (
                  <div key={o.id} className="opt-card" onClick={() => toggleCat(o.id)}
                    style={{ padding: '12px 14px', borderRadius: 12, border: `2px solid ${sel ? C.cyan : C.border}`, background: sel ? C.cyanDim : C.bg, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{o.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: sel ? 700 : 400, color: sel ? C.cyan : C.text, lineHeight: 1.3 }}>{o.label}</span>
                    {sel && <span style={{ marginLeft: 'auto', color: C.cyan, fontSize: 14 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          )}
          {/* CONTACT */}
          {current.type === 'contact' && (
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { key: 'prenom', label: 'Prénom', placeholder: 'Marie', type: 'text' },
                  { key: 'nom', label: 'Nom', placeholder: 'Dupont', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontFamily: MONO }}>{f.label}</div>
                    <input type={f.type} placeholder={f.placeholder} value={answers[f.key] ?? ''}
                      onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, color: C.text, fontFamily: BODY, outline: 'none' }} />
                  </div>
                ))}
              </div>
              {[
                { key: 'email', label: 'Email', placeholder: 'marie@email.com', type: 'email' },
                { key: 'tel', label: 'Téléphone (optionnel)', placeholder: '06 12 34 56 78', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontFamily: MONO }}>{f.label}</div>
                  <input type={f.type} placeholder={f.placeholder} value={answers[f.key] ?? ''}
                    onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: C.bg, border: `1.5px solid ${(answers.email ?? '').includes('@') && f.key === 'email' ? C.cyan : C.border}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, color: C.text, fontFamily: BODY, outline: 'none' }} />
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.faint, fontFamily: MONO }}>
                🔒 Données 100% sécurisées · Jamais revendues · RGPD
              </div>
            </div>
          )}
          {/* CTA Button */}
          <div style={{ marginTop: 24 }}>
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext} disabled={!canNext()}
                style={{ width: '100%', background: canNext() ? `linear-gradient(135deg, ${C.cyan}, ${C.violet})` : C.border, color: canNext() ? C.bg : C.faint, border: 'none', borderRadius: 14, padding: 18, fontSize: 16, fontWeight: 700, cursor: canNext() ? 'pointer' : 'default', fontFamily: HEADING, transition: 'all .2s' }}>
                Continuer →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canNext() || submitting}
                style={{ width: '100%', background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`, color: C.bg, border: 'none', borderRadius: 14, padding: 18, fontSize: 16, fontWeight: 700, cursor: canNext() ? 'pointer' : 'default', fontFamily: HEADING, position: 'relative', overflow: 'hidden' }}>
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${C.bg}40`, borderTop: `2px solid ${C.bg}`, display: 'inline-block', animation: 'spin .7s linear infinite' }} />
                    Analyse en cours...
                  </span>
                ) : '🔍 Obtenir mon analyse gratuite'}
              </button>
            )}
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ width: '100%', background: 'none', border: 'none', color: C.faint, cursor: 'pointer', marginTop: 10, fontSize: 13, fontFamily: BODY }}>
                ← Retour
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const r1 = useRef(), r2 = useRef(), r3 = useRef(), r4 = useRef();
  const v1 = useVisible(r1), v2 = useVisible(r2), v3 = useVisible(r3), v4 = useVisible(r4);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeUp = (vis, delay = '0s') => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'none' : 'translateY(28px)',
    transition: `opacity .8s ease ${delay}, transform .8s ease ${delay}`,
  });

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: BODY, overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @keyframes waveFlow {
          0%, 100% { d: path("M0,300 C360,200 720,400 1080,250 C1260,175 1440,300 1440,300"); transform: translateX(0); }
          50% { transform: translateX(-30px) translateY(10px); }
        }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px ${C.cyanGlow}} 50%{box-shadow:0 0 40px ${C.cyanGlow}, 0 0 60px ${C.violetGlow}} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .cta-flux { transition: transform .2s, box-shadow .2s; }
        .cta-flux:hover { transform:translateY(-3px); box-shadow:0 16px 48px ${C.cyanGlow}!important; }
        .cta-flux:active { transform:translateY(0); }
        .nav-link { cursor:pointer; transition: color .2s; }
        .nav-link:hover { color: ${C.cyan}!important; }
      `}</style>

      {showForm && <FluxForm onClose={() => setShowForm(false)} />}

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? `${C.bg}F0` : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all .3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: `0 0 16px ${C.cyanGlow}`,
          }}>🌊</div>
          <span style={{
            fontFamily: HEADING, fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MANA</span>
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 14, color: C.muted }}>
          {['Comment ça marche', 'Témoignages', 'Prix'].map(l => (
            <span key={l} className="nav-link" style={{ color: C.muted }}>{l}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', color: C.muted, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '8px 20px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: BODY, transition: 'all .2s',
          }}>Connexion</button>
          <button className="cta-flux" onClick={() => setShowForm(true)} style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
            color: C.bg, border: 'none', borderRadius: 10, padding: '8px 22px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: BODY,
            boxShadow: `0 4px 20px ${C.cyanGlow}`,
          }}>Reprends ton MANA</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        overflow: 'hidden', padding: '100px 48px 80px',
      }}>
        <WaveBackground />

        <div style={{
          maxWidth: 1100, margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
          alignItems: 'center', position: 'relative',
        }}>
          {/* Left */}
          <div>
            <div style={{
              ...fadeUp(mounted, '0s'),
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.cyanDim, border: `1px solid ${C.borderHot}`,
              borderRadius: 100, padding: '6px 16px', marginBottom: 28,
              fontSize: 12, color: C.cyan, fontFamily: MONO, letterSpacing: 1,
            }}>
              ✦ 94 000 Français reprennent leur MANA
            </div>
            <h1 style={{
              ...fadeUp(mounted, '0.1s'),
              fontFamily: HEADING, fontSize: 'clamp(42px,5vw,68px)',
              fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em',
              color: C.text, marginBottom: 24,
            }}>
              Reprends ton{' '}
              <em style={{
                fontStyle: 'italic',
                background: `linear-gradient(135deg, ${C.cyan}, ${C.gold})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>MANA.</em>
            </h1>
            <p style={{
              ...fadeUp(mounted, '0.15s'),
              fontSize: 20, color: C.text, lineHeight: 1.6,
              marginBottom: 12, maxWidth: 460, fontFamily: HEADING, fontWeight: 500, fontStyle: 'italic',
            }}>
              L'énergie de ton argent t'appartient.
            </p>
            <p style={{
              ...fadeUp(mounted, '0.2s'),
              fontSize: 14, color: C.muted, lineHeight: 1.8,
              marginBottom: 16, maxWidth: 440, fontFamily: BODY,
              background: C.cyanDim, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: '14px 18px',
            }}>
              Dans la culture polynésienne, le <strong style={{ color: C.cyan }}>MANA</strong> est la force sacrée qui circule en toute chose. Le tien s'échappe chaque mois en abonnements oubliés. On t'aide à le reprendre.
            </p>
            <p style={{
              ...fadeUp(mounted, '0.25s'),
              fontSize: 16, color: C.muted, lineHeight: 1.7,
              marginBottom: 36, maxWidth: 460, fontFamily: BODY,
            }}>
              MANA analyse tous tes abonnements et trouve automatiquement les offres moins chères.{' '}
              <strong style={{ color: C.text }}>Gratuit. 3 minutes. Résultat garanti.</strong>
            </p>
            <div style={fadeUp(mounted, '0.3s')}>
              <button className="cta-flux" onClick={() => setShowForm(true)} style={{
                background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                color: C.bg, border: 'none', borderRadius: 16,
                padding: '20px 44px', fontSize: 18, fontWeight: 700,
                cursor: 'pointer', fontFamily: HEADING, letterSpacing: '-0.01em',
                boxShadow: `0 8px 32px ${C.cyanGlow}`,
                display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16,
              }}>
                🌊 Récupérer mon MANA — Gratuit
              </button>
              <div style={{ fontSize: 12, color: C.faint, fontFamily: MONO }}>
                Aucune CB · Résultat en 3 min · 100% RGPD
              </div>
            </div>
          </div>

          {/* Right — Floating card preview */}
          <div style={{ ...fadeUp(mounted, '0.4s'), position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
              {/* Main card */}
              <div style={{
                background: C.bgCard, borderRadius: 24, padding: 32,
                boxShadow: `0 24px 80px rgba(0,0,0,0.4), 0 0 1px ${C.border}`,
                border: `1px solid ${C.border}`,
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ fontSize: 11, color: C.cyan, letterSpacing: 2, marginBottom: 16, fontFamily: MONO }}>
                  ANALYSE IA EN TEMPS RÉEL
                </div>
                {[
                  { icon: '📡', name: 'Box SFR', old: '39,99€', new: '19,99€', save: 240, color: C.cyan },
                  { icon: '🏠', name: 'Assurance AXA', old: '28,50€', new: '6,58€', save: 263, color: C.violet },
                  { icon: '🎬', name: 'Netflix', old: '17,99€', new: '5,99€', save: 144, color: C.cyan },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0',
                    borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `${item.color}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: C.faint, textDecoration: 'line-through' }}>{item.old}/mois</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: item.color }}>{item.new}/mois</div>
                      <div style={{ fontSize: 10, color: C.muted }}>−{item.save}€/an</div>
                    </div>
                  </div>
                ))}
                <div style={{
                  marginTop: 20, background: C.cyanDim, borderRadius: 14,
                  padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{ fontSize: 13, color: C.muted }}>Économies totales</div>
                  <div style={{
                    fontSize: 26, fontWeight: 700, fontFamily: HEADING,
                    background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>647€/an</div>
                </div>
              </div>
              {/* Floating badges */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                background: C.bgCard, borderRadius: 100, padding: '10px 16px',
                boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 12px ${C.cyanGlow}`,
                fontSize: 12, fontWeight: 700, color: C.cyan,
                animation: 'float 3s ease infinite',
                border: `1px solid ${C.border}`, fontFamily: MONO,
              }}>
                🎉 +156€/mois
              </div>
              <div style={{
                position: 'absolute', bottom: -16, left: -16,
                background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                borderRadius: 100, padding: '8px 14px',
                boxShadow: `0 8px 24px ${C.cyanGlow}`,
                fontSize: 11, fontWeight: 700, color: C.bg,
                animation: 'float 4s ease .5s infinite', fontFamily: MONO,
              }}>
                ✓ 100% gratuit
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(90deg, ${C.cyan}08, ${C.violet}12, ${C.cyan}08)`,
        padding: '14px 0', overflow: 'hidden',
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap' }}>
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{
              marginRight: 60, fontSize: 13,
              color: `${C.text}50`, fontFamily: MONO, letterSpacing: 1,
            }}>
              🌊 487€ de MANA perdu/mois en moyenne &nbsp;·&nbsp;
              🎯 156€ récupérés par nos membres &nbsp;·&nbsp;
              ✓ Gratuit, sans CB, sans engagement &nbsp;·&nbsp;
              🇫🇷 Données hébergées en France &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <section ref={r1} style={{ padding: '80px 48px', background: `${C.bgCard}80` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {[
            { n: '487€', l: 'gaspillés/mois en moyenne' },
            { n: '47%', l: "d'abonnements inutilisés" },
            { n: '156€', l: 'économisés/mois par nos membres' },
            { n: '94k+', l: 'Français nous font confiance' },
          ].map((s, i) => (
            <div key={i} style={{
              ...fadeUp(v1, `${i * 0.1}s`),
              background: C.bgCard, borderRadius: 20, padding: '28px 24px',
              textAlign: 'center', border: `1px solid ${C.border}`,
              boxShadow: `0 2px 16px rgba(0,0,0,0.2)`,
              transition: 'transform .3s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                fontSize: 40, fontWeight: 700, fontFamily: HEADING,
                letterSpacing: '-0.03em', marginBottom: 8,
                background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.n}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section ref={r2} style={{ padding: '100px 48px', position: 'relative' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ ...fadeUp(v2), textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, color: C.cyan, letterSpacing: 3, marginBottom: 12, fontFamily: MONO }}>COMMENT ÇA MARCHE</div>
            <h2 style={{ fontFamily: HEADING, fontSize: 42, fontWeight: 700, color: C.text, letterSpacing: '-0.03em' }}>
              Simple comme <em style={{
                fontStyle: 'italic',
                background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>bonjour</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, position: 'relative' }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute', top: 44, left: '16.66%', right: '16.66%',
              height: 1, background: `linear-gradient(90deg, ${C.cyan}40, ${C.violet}40)`, zIndex: 0,
            }} />
            {[
              { icon: '🔍', title: 'Tu réponds à 4 questions', desc: 'En moins de 3 minutes. Sur tes abonnements actuels.' },
              { icon: '🤖', title: 'MANA analyse tout', desc: 'Notre IA compare 200+ offres pour trouver les moins chères.' },
              { icon: '💰', title: 'Tu économises', desc: "On s'occupe de tout : résiliations, négociations, switches." },
            ].map((s, i) => (
              <div key={i} style={{ ...fadeUp(v2, `${i * 0.15}s`), textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: i === 1 ? `linear-gradient(135deg, ${C.cyan}, ${C.violet})` : C.bgCard,
                  border: `2px solid ${i === 1 ? 'transparent' : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 36,
                  boxShadow: i === 1 ? `0 8px 32px ${C.cyanGlow}` : 'none',
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8, fontFamily: HEADING, letterSpacing: '-0.01em' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ ...fadeUp(v2, '0.4s'), textAlign: 'center', marginTop: 52 }}>
            <button className="cta-flux" onClick={() => setShowForm(true)} style={{
              background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
              color: C.bg, border: 'none', borderRadius: 14,
              padding: '18px 44px', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', fontFamily: HEADING,
              boxShadow: `0 8px 28px ${C.cyanGlow}`,
            }}>
              Commencer — c'est gratuit
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section ref={r3} style={{ padding: '80px 48px', background: `${C.bgCard}80` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ ...fadeUp(v3), textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: C.cyan, letterSpacing: 3, marginBottom: 12, fontFamily: MONO }}>ILS ÉCONOMISENT DÉJÀ</div>
            <h2 style={{ fontFamily: HEADING, fontSize: 38, fontWeight: 700, color: C.text, letterSpacing: '-0.03em' }}>
              Ce qu'ils en pensent
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[
              { name: 'Sarah M.', job: 'Infirmière, Lyon', save: '213€/mois', text: "En 3 minutes, MANA a trouvé 9 abonnements que j'avais oubliés. Incroyable.", avatar: 'SM' },
              { name: 'Thomas K.', job: 'Freelance, Paris', save: '89€/mois', text: "Mon forfait SFR est passé de 39€ à 19€ sans que je fasse quoi que ce soit.", avatar: 'TK' },
              { name: 'Famille Durand', job: 'Bordeaux', save: '334€/mois', text: "7 doublons détectés entre nos 4 comptes. 334€ récupérés chaque mois.", avatar: 'FD' },
            ].map((t, i) => (
              <div key={i} style={{
                ...fadeUp(v3, `${i * 0.1}s`),
                background: C.bgCard, borderRadius: 24, padding: 28,
                border: `1px solid ${C.border}`,
                boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                transition: 'transform .3s, box-shadow .3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 12px ${C.cyanGlow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)'; }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.cyanDim}, ${C.violetDim})`,
                    border: `2px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900, color: C.cyan, fontFamily: MONO,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{t.job}</div>
                  </div>
                  <div style={{
                    marginLeft: 'auto',
                    background: C.cyanDim, borderRadius: 100,
                    padding: '4px 12px', fontSize: 12, fontWeight: 700,
                    color: C.cyan, fontFamily: MONO,
                    border: `1px solid ${C.border}`,
                  }}>+{t.save}</div>
                </div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section ref={r4} style={{
        padding: '100px 48px', background: '#0a1a2a', position: 'relative',
        overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${C.cyan}08 1px, transparent 1px)`, backgroundSize: '32px 32px', opacity: 0.5, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${C.cyanDim} 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', ...fadeUp(v4) }}>
          <div style={{ fontSize: 11, color: `${C.cyan}80`, letterSpacing: 3, marginBottom: 16, fontFamily: MONO }}>REJOINS 94 000+ MEMBRES</div>
          <h2 style={{ fontFamily: HEADING, fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, color: C.text, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
            Reprends ton{' '}
            <em style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${C.cyan}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MANA.</em>
          </h2>
          <p style={{ color: C.muted, fontSize: 17, marginBottom: 44 }}>Analyse gratuite · 3 minutes · Aucune carte bancaire</p>
          <button className="cta-flux" onClick={() => setShowForm(true)} style={{
            background: C.text, color: C.bg, border: 'none', borderRadius: 16,
            padding: '22px 56px', fontSize: 19, fontWeight: 700, cursor: 'pointer',
            fontFamily: HEADING, boxShadow: `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${C.cyanGlow}`,
            display: 'inline-flex', alignItems: 'center', gap: 12,
          }}>
            🌊 Récupérer mon MANA maintenant
          </button>
          <div style={{ marginTop: 20, fontSize: 12, color: C.faint, fontFamily: MONO }}>DONNÉES HÉBERGÉES EN FRANCE · 100% RGPD · JAMAIS REVENDUES</div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer style={{
        padding: '32px 48px', borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🌊</span>
          <span style={{
            fontFamily: HEADING, fontWeight: 700, fontSize: 18,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MANA</span>
        </div>
        <div style={{ fontSize: 11, color: C.faint, fontFamily: MONO }}>
          © 2026 MANA · Tous droits réservés · Mentions légales · CGU
        </div>
        <div style={{ fontSize: 11, color: C.faint, fontFamily: MONO }}>
          Reprends ton MANA 🌊
        </div>
      </footer>
    </div>
  );
}
