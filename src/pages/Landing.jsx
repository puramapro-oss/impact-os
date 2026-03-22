import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════
   FLUX — Landing page · Partie 1 : Nav + Hero + Ticker
   Design : Nuit profonde × Cyan eau × Violet énergie
═══════════════════════════════════════════════════ */
const HEADING = "'Cormorant Garamond', serif";
const BODY = "'DM Sans', sans-serif";
const MONO = "'Courier New', monospace";

const C = {
  bg: '#050810',
  bgCard: '#0a1020',
  cyan: '#6EE7F7',
  cyanDim: 'rgba(110,231,247,0.08)',
  cyanGlow: 'rgba(110,231,247,0.25)',
  violet: '#818CF8',
  violetDim: 'rgba(129,140,248,0.08)',
  violetGlow: 'rgba(129,140,248,0.25)',
  text: '#f0f6fc',
  muted: 'rgba(240,246,252,0.5)',
  faint: 'rgba(240,246,252,0.25)',
  border: 'rgba(110,231,247,0.1)',
  borderHot: 'rgba(110,231,247,0.25)',
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

export default function Landing() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const r1 = useRef(), r2 = useRef(), r3 = useRef();
  const v1 = useVisible(r1), v2 = useVisible(r2), v3 = useVisible(r3);

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
          }}>FLUX</span>
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
          <button className="cta-flux" onClick={() => navigate('/register')} style={{
            background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
            color: C.bg, border: 'none', borderRadius: 10, padding: '8px 22px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: BODY,
            boxShadow: `0 4px 20px ${C.cyanGlow}`,
          }}>Libère ton flux</button>
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
              ✦ 94 000 Français optimisent déjà avec FLUX
            </div>
            <h1 style={{
              ...fadeUp(mounted, '0.1s'),
              fontFamily: HEADING, fontSize: 'clamp(42px,5vw,68px)',
              fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em',
              color: C.text, marginBottom: 24,
            }}>
              Libère ton{' '}
              <em style={{
                fontStyle: 'italic',
                background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>flux</em>
              <br />financier.
            </h1>
            <p style={{
              ...fadeUp(mounted, '0.2s'),
              fontSize: 18, color: C.muted, lineHeight: 1.8,
              marginBottom: 36, maxWidth: 460, fontFamily: BODY,
            }}>
              FLUX analyse tous tes abonnements et trouve automatiquement les offres moins chères.{' '}
              <strong style={{ color: C.text }}>Gratuit. 3 minutes. Résultat garanti.</strong>
            </p>
            <div style={fadeUp(mounted, '0.3s')}>
              <button className="cta-flux" onClick={() => navigate('/register')} style={{
                background: `linear-gradient(135deg, ${C.cyan}, ${C.violet})`,
                color: C.bg, border: 'none', borderRadius: 16,
                padding: '20px 44px', fontSize: 18, fontWeight: 700,
                cursor: 'pointer', fontFamily: HEADING, letterSpacing: '-0.01em',
                boxShadow: `0 8px 32px ${C.cyanGlow}`,
                display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16,
              }}>
                🌊 Voir mes économies — Gratuit
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
              🌊 487€ gaspillés/mois en moyenne &nbsp;·&nbsp;
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
              { icon: '🤖', title: 'FLUX analyse tout', desc: 'Notre IA compare 200+ offres pour trouver les moins chères.' },
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
            <button className="cta-flux" onClick={() => navigate('/register')} style={{
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
              { name: 'Sarah M.', job: 'Infirmière, Lyon', save: '213€/mois', text: "En 3 minutes, FLUX a trouvé 9 abonnements que j'avais oubliés. Incroyable.", avatar: 'SM' },
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

      {/* ── PLACEHOLDER — Partie 3 à venir (CTA final + Footer complet) ── */}

      {/* ── FOOTER MINIMAL ───────────────────────────────── */}
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
          }}>FLUX</span>
        </div>
        <div style={{ fontSize: 11, color: C.faint, fontFamily: MONO }}>
          © 2026 FLUX · Tous droits réservés · Mentions légales · CGU
        </div>
        <div style={{ fontSize: 11, color: C.faint, fontFamily: MONO }}>
          Libère ton flux 🌊
        </div>
      </footer>
    </div>
  );
}
