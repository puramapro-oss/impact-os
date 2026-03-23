import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Veuillez saisir votre email'); return; }
    if (!password.trim()) { setError('Veuillez saisir votre mot de passe'); return; }
    try {
      setLoading(true);
      setError('');
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.message ?? '';
      if (msg.includes('Invalid login')) setError('Email ou mot de passe incorrect');
      else setError(msg || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err) {
      setError(err?.message ?? 'Erreur de connexion Google');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
          }}>✨</div>
          <h1 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Connexion</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Accédez à votre espace MANA
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

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: 13, color: 'var(--accent-red)',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Adresse email</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', background: 'var(--bg-input)',
                border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
              }}>
                <Mail size={16} color="var(--text-secondary)" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14 }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Mot de passe</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', background: 'var(--bg-input)',
                border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
              }}>
                <Lock size={16} color="var(--text-secondary)" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  style={{ flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14 }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ background: 'none', color: 'var(--text-secondary)', padding: 0 }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-green)' }} />
                Se souvenir de moi
              </label>
              <span style={{ fontSize: 13, color: '#f59e0b', cursor: 'pointer' }}>Mot de passe oublié ?</span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Connexion...' : 'Se connecter'} <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Pas encore de compte ?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 600 }}>
            Créer un compte
          </span>
        </p>
      </div>
    </div>
  );
}
