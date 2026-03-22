import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, FileCheck, BarChart3, Shield, Sparkles, Network,
  Dribbble, Palette, Heart, Leaf, Wrench, Briefcase, ShoppingBag, GraduationCap,
  Check, ChevronDown, ChevronUp, ArrowRight, Zap, Star, Users, Clock
} from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

function AnimatedStat({ value, suffix, label }) {
  const { count, ref } = useAnimatedCounter(value);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 48, fontWeight: 800, fontFamily: 'var(--font-heading)',
        color: 'var(--accent-green)',
      }}>
        {count.toLocaleString('fr-FR')}{suffix}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

const features = [
  { icon: Bot, title: 'Agent Exécutif', desc: 'Votre assistant IA qui exécute les tâches administratives en autonomie : emails, documents, relances.', color: '#10b981' },
  { icon: FileCheck, title: 'Subventions 1 clic', desc: 'Détection automatique des appels à projets, pré-remplissage des dossiers, soumission guidée.', color: '#2563eb' },
  { icon: BarChart3, title: 'Impact automatique', desc: 'Vos actions sont transformées en indicateurs d\'impact mesurables et exportables.', color: '#f59e0b' },
  { icon: Shield, title: 'Trust Layer', desc: 'Chaque action de l\'IA est traçable, auditable et conforme RGPD. Vous gardez le contrôle.', color: '#8b5cf6' },
  { icon: Sparkles, title: 'RESOUTRE', desc: 'Posez n\'importe quelle question administrative. L\'IA analyse, propose et exécute.', color: '#10b981' },
  { icon: Network, title: 'Impact Network', desc: 'Connectez-vous à l\'écosystème associatif : mutualisez ressources, partagez bonnes pratiques.', color: '#2563eb' },
];

const packs = [
  { icon: Dribbble, title: 'Asso Sportive', desc: 'Licences, calendriers, résultats, CNDS' },
  { icon: Palette, title: 'Culturelle', desc: 'Billetterie, DRAC, droits d\'auteur' },
  { icon: Heart, title: 'Humanitaire', desc: 'Dons, reçus fiscaux, rapports terrain' },
  { icon: Leaf, title: 'Environnement', desc: 'Bilan carbone, ADEME, éco-actions' },
  { icon: Wrench, title: 'Artisan', desc: 'Devis, factures, URSSAF, comptabilité' },
  { icon: Briefcase, title: 'Cabinet', desc: 'Clients, RDV, facturation, relances' },
  { icon: ShoppingBag, title: 'E-commerce', desc: 'Commandes, stock, TVA, SAV automatisé' },
  { icon: GraduationCap, title: 'École', desc: 'Inscriptions, bulletins, paie, subventions' },
];

const temoignages = [
  { nom: 'Marie-Claire Dupont', role: 'Directrice, Association Coup de Pouce Lyon', texte: 'IMPACT OS a transformé notre gestion. On a divisé par 3 le temps passé sur l\'administratif. Les dossiers de subvention se font quasiment tout seuls.', note: 5 },
  { nom: 'François Bertrand', role: 'Président, Club Nautique de Marseille', texte: 'Le RESOUTRE est incroyable. Je pose ma question en français, et j\'ai ma réponse avec les documents pré-remplis en quelques secondes. Un vrai gain de temps.', note: 5 },
  { nom: 'Amina Cissé', role: 'Fondatrice, Solidarité Active Bordeaux', texte: 'Grâce à l\'Impact Network, on a trouvé 3 partenaires et obtenu 12 000€ de financement en 2 mois. L\'IA nous a même aidé à rédiger les dossiers.', note: 5 },
];

const faqItems = [
  { q: 'Est-ce que l\'IA remplace les humains ?', r: 'Non, IMPACT OS automatise les tâches répétitives (emails, documents, rapports) pour vous libérer du temps. Vous gardez le contrôle total grâce au Trust Layer et au mode SAFE.' },
  { q: 'Nos données sont-elles sécurisées ?', r: 'Oui. Hébergement en France, chiffrement AES-256, conformité RGPD native. Chaque action IA est journalisée dans le Journal d\'audit. Vous pouvez exporter ou supprimer vos données à tout moment.' },
  { q: 'Faut-il des compétences techniques ?', r: 'Aucune. L\'interface est conçue pour être utilisable par tous. Le RESOUTRE vous permet de poser vos questions en langage naturel. Notre équipe vous accompagne lors de l\'onboarding.' },
  { q: 'Peut-on essayer gratuitement ?', r: 'Oui, le plan Starter inclut 14 jours d\'essai gratuit sans engagement et sans carte bancaire. Vous pouvez upgrader à tout moment vers Pro ou Enterprise.' },
  { q: 'Quelles intégrations sont disponibles ?', r: 'Gmail, Google Drive, Google Calendar, HelloAsso, Stripe, WhatsApp. D\'autres intégrations arrivent chaque mois (Slack, Notion, Airtable). API ouverte disponible sur le plan Enterprise.' },
  { q: 'Comment fonctionne le support ?', r: 'Starter : support par email sous 48h. Pro : support prioritaire sous 4h + onboarding personnalisé. Enterprise : support dédié avec un customer success manager attitré.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const pricing = [
    {
      nom: 'Starter',
      prix: annual ? 24 : 29,
      desc: 'Pour démarrer l\'automatisation',
      features: ['5 workflows actifs', '100 emails/mois traités', 'RESOUTRE illimité', '1 connecteur', 'Support email', 'Tableau d\'impact basique'],
      cta: 'Démarrer gratuitement',
      popular: false,
    },
    {
      nom: 'Pro',
      prix: annual ? 49 : 59,
      desc: 'Pour les organisations actives',
      features: ['Workflows illimités', 'Emails illimités', 'RESOUTRE + Agent Exécutif', 'Tous les connecteurs', 'Support prioritaire 4h', 'Subventions 1 clic', 'Rapports d\'impact avancés', 'Onboarding personnalisé'],
      cta: 'Choisir Pro',
      popular: true,
    },
    {
      nom: 'Enterprise',
      prix: annual ? 82 : 99,
      desc: 'Pour les grandes structures',
      features: ['Tout Pro inclus', 'API complète', 'SSO / SAML', 'Rôles personnalisés', 'Support dédié CSM', 'Impact Network premium', 'Formation équipe', 'SLA garanti 99.9%'],
      cta: 'Contacter l\'équipe',
      popular: false,
    },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(13, 17, 23, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
              color: 'white',
            }}>IO</div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20 }}>
              IMPACT OS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#features" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Fonctionnalités</a>
            <a href="#pricing" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Tarifs</a>
            <a href="#faq" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>FAQ</a>
            <button onClick={() => navigate('/login')} className="btn-ghost">Connexion</button>
            <button onClick={() => navigate('/register')} className="btn-primary">
              Essai gratuit <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
          fontSize: 13, color: 'var(--accent-green)', fontWeight: 600, marginBottom: 24,
        }}>
          <Zap size={14} />
          Propulsé par l'intelligence artificielle
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)', fontSize: 56, fontWeight: 800,
          lineHeight: 1.1, maxWidth: 800, marginBottom: 24,
        }}>
          L'IA qui gère votre administration et{' '}
          <span style={{ color: 'var(--accent-green)' }}>prouve votre impact</span>
        </h1>
        <p style={{
          fontSize: 18, color: 'var(--text-secondary)', maxWidth: 600, marginBottom: 40, lineHeight: 1.7,
        }}>
          Automatisez 70% de vos tâches administratives. Transformez chaque action en preuve d'impact mesurable.
          Conçu pour les associations et PME françaises.
        </p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 64 }}>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
            Démarrer gratuitement <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ padding: '14px 32px', fontSize: 16 }}>
            Voir la démo
          </button>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48,
          maxWidth: 700,
        }}>
          <AnimatedStat value={2400} suffix="+" label="Organisations actives" />
          <AnimatedStat value={98} suffix="%" label="Taux de satisfaction" />
          <AnimatedStat value={3} suffix="h" label="Gagnées par semaine" />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>Tout ce dont vous avez besoin</h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Six modules puissants qui travaillent ensemble pour automatiser votre quotidien
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card" style={{
                padding: 28, transition: 'transform 0.2s ease, border-color 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = f.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${f.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Packs métiers */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>8 packs métiers spécialisés</h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Des configurations prêtes à l'emploi adaptées à votre secteur d'activité
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {packs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="glass-card" style={{
                padding: 20, textAlign: 'center', cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => navigate('/register')}
              >
                <Icon size={28} color="var(--accent-green)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 15, marginBottom: 6 }}>{p.title}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>Ils nous font confiance</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {temoignages.map((t, i) => (
            <div key={i} className="glass-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {[...Array(t.note)].map((_, j) => (
                  <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                "{t.texte}"
              </p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.nom}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>Tarifs simples et transparents</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: annual ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: annual ? 400 : 600 }}>Mensuel</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: 48, height: 26, borderRadius: 13, padding: 3,
                background: annual ? 'var(--accent-green)' : 'var(--border-color)',
                transition: 'background 0.2s ease', position: 'relative',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                transition: 'transform 0.2s ease',
                transform: annual ? 'translateX(22px)' : 'translateX(0)',
              }} />
            </button>
            <span style={{ fontSize: 14, color: annual ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: annual ? 600 : 400 }}>
              Annuel <span style={{ color: 'var(--accent-green)', fontSize: 12 }}>-17%</span>
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {pricing.map((plan, i) => (
            <div key={i} className="glass-card" style={{
              padding: 32, position: 'relative',
              border: plan.popular ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
              transform: plan.popular ? 'scale(1.02)' : 'none',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent-green)', color: 'white',
                  padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                }}>
                  Le plus populaire
                </div>
              )}
              <h3 style={{ fontSize: 22, marginBottom: 4 }}>{plan.nom}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{plan.desc}</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 44, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{plan.prix}€</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/mois</span>
              </div>
              <button
                onClick={() => navigate('/register')}
                className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', marginBottom: 24, padding: '12px 24px' }}
              >
                {plan.cta}
              </button>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Check size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 40 }}>Questions fréquentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqItems.map((item, i) => (
            <div key={i} className="glass-card" style={{ overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'transparent', color: 'var(--text-primary)',
                  fontSize: 15, fontWeight: 600, textAlign: 'left',
                }}
              >
                {item.q}
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 20px 16px',
                  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
                  animation: 'fadeIn 0.2s ease',
                }}>
                  {item.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px', textAlign: 'center',
        background: 'linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.05))',
      }}>
        <h2 style={{ fontSize: 36, marginBottom: 16 }}>Prêt à transformer votre gestion ?</h2>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Rejoignez 2 400+ organisations qui ont déjà automatisé leur administratif
        </p>
        <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
          Commencer maintenant <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '48px 24px 24px',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6, background: 'var(--accent-green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 11, color: 'white',
              }}>IO</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>IMPACT OS</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              L'IA qui automatise 70% de l'administratif et transforme vos actions en preuves d'impact.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Produit</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="#features" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fonctionnalités</a>
              <a href="#pricing" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Tarifs</a>
              <span onClick={() => navigate('/dashboard')} style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>Démo</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Intégrations</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Ressources</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Documentation</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Blog</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Guides associatifs</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Webinaires</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Légal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Mentions légales</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Politique de confidentialité</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>CGU</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>RGPD</span>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid var(--border-color)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 IMPACT OS. Tous droits réservés.</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fait avec ❤️ à Lyon, France</span>
        </div>
      </footer>
    </div>
  );
}
