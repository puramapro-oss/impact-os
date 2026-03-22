import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('sophie.martin@aigles-lyon.fr');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Veuillez saisir votre email'); return; }
    if (!password.trim()) { setError('Veuillez saisir votre mot de passe'); return; }
    setError('');
    navigate('/dashboard');
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
            background: 'var(--accent-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 20, color: 'white',
          }}>IO</div>
          <h1 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>Connexion</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Accédez à votre espace IMPACT OS
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 28 }}>
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
            <span style={{ fontSize: 13, color: 'var(--accent-green)', cursor: 'pointer' }}>Mot de passe oublié ?</span>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 15 }}>
            Se connecter <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Pas encore de compte ?{' '}
          <span onClick={() => navigate('/register')} style={{ color: 'var(--accent-green)', cursor: 'pointer', fontWeight: 600 }}>
            Créer un compte
          </span>
        </p>
      </div>
    </div>
  );
}
