import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', organisation: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) navigate('/dashboard');
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

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 28 }}>
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

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15 }}>
            Créer mon compte <ArrowRight size={18} />
          </button>
        </form>

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
