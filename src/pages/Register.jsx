import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', organisation: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = 'Prénom requis';
    if (!form.nom.trim()) e.nom = 'Nom requis';
    if (!form.email.trim()) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.organisation.trim()) e.organisation = 'Organisation requise';
    if (!form.password) e.password = 'Mot de passe requis';
    else if (form.password.length < 8) e.password = '8 caractères minimum';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      setLoading(true);
      setGlobalError('');
      await signUpWithEmail(form.email, form.password, {
        prenom: form.prenom,
        nom: form.nom,
        organisation: form.organisation,
      });
      navigate('/onboarding');
    } catch (err) {
      const msg = err?.message ?? '';
      if (msg.includes('already registered')) setGlobalError('Cet email est déjà utilisé');
      else setGlobalError(msg || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGlobalError('');
      await signInWithGoogle();
    } catch (err) {
      setGlobalError(err?.message ?? 'Erreur de connexion Google');
    }
  };

  const pwdChecks = [
    { label: '8 caractères minimum', ok: form.password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(form.password) },
    { label: 'Un chiffre', ok: /\d/.test(form.password) },
  ];

  const Field = ({ label, field, type = 'text', icon: Icon, placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', background: 'var(--bg-input)',
        border: `1px solid ${errors[field] ? 'var(--accent-red)' : 'var(--border-color)'}`,
        borderRadius: 'var(--border-radius-btn)',
      }}>
        <Icon size={16} color="var(--text-secondary)" />
        <input
          type={field.includes('password') || field.includes('Password') ? (showPwd ? 'text' : 'password') : type}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          placeholder={placeholder}
          style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14 }}
        />
      </div>
      {errors[field] && <span style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 4, display: 'block' }}>{errors[field]}</span>}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
          }}>✨</div>
          <h1 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Créer un compte</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            14 jours d'essai gratuit — Sans carte bancaire
          </p>
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <button type="button" onClick={handleGoogle} style={{
            width: '100%', padding: '12px 24px', borderRadius: 'var(--border-radius-btn)',
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'border-color 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          </div>

          {globalError && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 16,
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: 13, color: 'var(--accent-red)',
            }}>
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Prénom" field="prenom" icon={User} placeholder="Sophie" />
            <Field label="Nom" field="nom" icon={User} placeholder="Martin" />
          </div>
          <Field label="Email professionnel" field="email" type="email" icon={Mail} placeholder="sophie@association.fr" />
          <Field label="Nom de l'organisation" field="organisation" icon={Building2} placeholder="Les Aigles de Lyon" />
          <Field label="Mot de passe" field="password" icon={Lock} placeholder="Minimum 8 caractères" />

          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            {pwdChecks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: c.ok ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                <Check size={12} /> {c.label}
              </div>
            ))}
          </div>

          <Field label="Confirmer le mot de passe" field="confirmPassword" icon={Lock} placeholder="Confirmez votre mot de passe" />

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20, cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#f59e0b', marginTop: 2 }} />
            <span>J'accepte les <span style={{ color: '#f59e0b' }}>Conditions Générales d'Utilisation</span> et la <span style={{ color: '#f59e0b' }}>Politique de Confidentialité</span></span>
          </label>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Création...' : 'Créer mon compte'} <ArrowRight size={18} />
          </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Déjà un compte ?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 600 }}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}
