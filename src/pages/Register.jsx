import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, ArrowRight, Check, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Field({ label, name, type = 'text', icon, placeholder, value, error, onChange }) {
  const Icon = icon;
  const id = `register-${name}`;
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', background: 'var(--bg-input)',
        border: `1px solid ${error ? 'var(--accent-red)' : 'var(--border-color)'}`,
        borderRadius: 'var(--border-radius-btn)',
      }}>
        <Icon size={16} color="var(--text-secondary)" />
        <input
          id={id} name={name} type={type} value={value} onChange={onChange}
          aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined}
          placeholder={placeholder}
          style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14 }}
        />
      </div>
      {error && <span id={`${id}-error`} style={{ fontSize: 11, color: 'var(--accent-red)', marginTop: 4, display: 'block' }}>{error}</span>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', organisation: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const submitting = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

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
    if (submitting.current) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    submitting.current = true;
    setLoading(true);
    try {
      const registrationEmail = form.email.trim();
      const { data, error } = await signUp(registrationEmail, form.password, {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        organisation: form.organisation.trim(),
      });
      if (!mounted.current) return;
      if (error) {
        setErrors({ general: error.message });
      } else if (data?.session) {
        navigate('/dashboard', { replace: true });
      } else {
        setConfirmationEmail(registrationEmail);
      }
    } catch {
      if (mounted.current) setErrors({ general: 'L’inscription a échoué. Vous pouvez réessayer.' });
    } finally {
      submitting.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  function bindField(name) {
    return {
      name, value: form[name], error: errors[name],
      onChange(event) {
        const value = event.currentTarget.value;
        setForm(previous => ({ ...previous, [name]: value }));
      },
    };
  }

  const pwdChecks = [
    { label: '8 caractères minimum', ok: form.password.length >= 8 },
    { label: 'Une majuscule', ok: /[A-Z]/.test(form.password) },
    { label: 'Un chiffre', ok: /\d/.test(form.password) },
  ];

  if (confirmationEmail) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
            background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={32} color="#10b981" />
          </div>
          <h1 style={{ fontSize: 28, marginBottom: 12, fontFamily: 'var(--font-heading)' }}>Compte créé !</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
            Un email de confirmation a été envoyé à <strong style={{ color: 'var(--text-primary)' }}>{confirmationEmail}</strong>.
            Vérifiez votre boîte de réception pour activer votre compte LUMIOS.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>
            Aller à la connexion <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

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
          {errors.general && (
            <div role="alert" style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 16,
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: 13, color: 'var(--accent-red)',
            }}>
              {errors.general}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Prénom" {...bindField('prenom')} icon={User} placeholder="Sophie" />
            <Field label="Nom" {...bindField('nom')} icon={User} placeholder="Martin" />
          </div>
          <Field label="Email professionnel" {...bindField('email')} type="email" icon={Mail} placeholder="sophie@association.fr" />
          <Field label="Nom de l'organisation" {...bindField('organisation')} icon={Building2} placeholder="Les Aigles de Lyon" />
          <Field label="Mot de passe" {...bindField('password')} type="password" icon={Lock} placeholder="Minimum 8 caractères" />

          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            {pwdChecks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: c.ok ? '#10b981' : 'var(--text-muted)' }}>
                <Check size={12} /> {c.label}
              </div>
            ))}
          </div>

          <Field label="Confirmer le mot de passe" {...bindField('confirmPassword')} type="password" icon={Lock} placeholder="Confirmez votre mot de passe" />

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20, cursor: 'pointer' }}>
            <input type="checkbox" required style={{ accentColor: '#f59e0b', marginTop: 2 }} />
            <span>J'accepte les <span style={{ color: '#f59e0b' }}>Conditions Générales d'Utilisation</span> et la <span style={{ color: '#f59e0b' }}>Politique de Confidentialité</span></span>
          </label>

          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Création...</> : <>Créer mon compte <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Déjà un compte ?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 600 }}>
            Se connecter
          </span>
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
