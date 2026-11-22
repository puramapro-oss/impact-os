import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createPasswordClient } from '../../lib/supabase';
import { createPasswordSecurity, securitySessionIdentity } from '../../lib/passwordSecurity';

const fieldStyle = {
  display: 'block', width: '100%', marginTop: 6, padding: '10px 14px',
  color: 'var(--text-primary)', background: 'var(--bg-input)',
  border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
};

function SessionDuration() {
  return <div>
    <label htmlFor="security-session-timeout">Durée de session</label>
    <select id="security-session-timeout" disabled defaultValue="" aria-describedby="security-session-note" style={fieldStyle}>
      <option value="">Non vérifiée</option>
    </select>
    <p id="security-session-note" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
      La durée et l’expiration sont définies par le fournisseur d’authentification. Aucun réglage serveur n’est disponible depuis cet écran.
    </p>
  </div>;
}

function AnonymousSecurity() {
  return <section>
    <h3 style={{ fontSize: 18, marginBottom: 20 }}>Sécurité</h3>
    <p id="security-unavailable">
      Sans connexion, ces réglages ne sont pas reliés au compte. Aucun mot de passe n’est modifié depuis cet écran.
    </p>
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h4>Authentification 2FA</h4>
        <p>État du compte non vérifié</p>
        <button type="button" disabled aria-label="Authentification 2FA" aria-describedby="security-unavailable" className="btn-secondary">Configuration indisponible</button>
      </div>
      <SessionDuration />
      <button type="button" disabled aria-describedby="security-unavailable" className="btn-secondary">Changer le mot de passe</button>
      <a href="/login">Se connecter pour gérer le mot de passe</a>
    </div>
  </section>;
}

function ConnectedSecurity({ userId, session, getCurrentSession }) {
  const controller = useRef(null);
  const inFlight = useRef(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [nonce, setNonce] = useState('');
  const [needsNonce, setNeedsNonce] = useState(false);
  // Capture once for this account/session view. Token refreshes of the same
  // session do not replace an operation's credentials halfway through it.
  const [capturedSession, setCapturedSession] = useState(session);

  const clearFields = () => {
    setCurrentPassword(''); setPassword(''); setConfirmation(''); setNonce('');
  };

  useEffect(() => {
    let mounted = true;
    const security = createPasswordSecurity({
      session: capturedSession, getCurrentSession, createClient: createPasswordClient, userId,
    });
    controller.current = security;
    const readStatus = async () => {
      try {
        const next = await security.status();
        if (mounted && security.isActive()) { setStatus(next); setError(''); }
      } catch {
        if (mounted && security.isActive()) setError('Le compte ne peut pas être vérifié. Réessayez ou reconnectez-vous.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void readStatus();
    return () => { mounted = false; security.dispose(); };
  }, [userId, capturedSession, getCurrentSession, attempt]);

  async function run(action) {
    if (inFlight.current || !controller.current?.isActive()) return;
    const security = controller.current;
    inFlight.current = true;
    setBusy(true); setError(''); setNotice('');
    try {
      await action(security);
    } catch {
      if (security.isActive()) setError('Résultat non confirmé. Vérifiez les champs et votre connexion, puis réessayez.');
    } finally {
      inFlight.current = false;
      if (security.isActive()) setBusy(false);
    }
  }

  const submit = event => {
    event.preventDefault();
    if (inFlight.current) return;
    if (!currentPassword || password.length < 8 || password !== confirmation || password === currentPassword) {
      setError('Saisissez le mot de passe actuel et deux nouveaux mots de passe identiques, de huit caractères minimum et différents du précédent.');
      return;
    }
    if (needsNonce && !nonce.trim()) { setError('Saisissez le code de confirmation reçu.'); return; }
    void run(async security => {
      const result = await security.changePassword({ currentPassword, password, confirmation, nonce });
      if (!security.isActive()) return;
      if (result.needsNonce) {
        setNeedsNonce(true); setNonce('');
        setError(result.invalidNonce ? 'Code refusé ou expiré. Demandez un nouveau code.' : 'Le fournisseur demande une confirmation supplémentaire. Demandez un code ci-dessous.');
      } else if (result.changed) {
        clearFields(); setNeedsNonce(false); setOpened(false);
        setNotice('Le fournisseur a confirmé le changement de votre mot de passe.');
      }
    });
  };

  const sendCode = () => void run(async security => {
    await security.requestCode();
    if (security.isActive()) setNotice('La demande de code a été acceptée. Consultez le moyen de contact confirmé de votre compte.');
  });

  const verifiedTotp = status?.factors.filter(factor => factor.factor_type === 'totp' && factor.status === 'verified').length;
  return <section>
    <h3 style={{ fontSize: 18, marginBottom: 20 }}>Sécurité du compte</h3>
    {loading && <p role="status">Vérification du compte…</p>}
    {error && <p role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {!loading && <button type="button" className="btn-secondary" disabled={busy} onClick={() => {
      clearFields(); setOpened(false); setNotice(''); setError(''); setStatus(null);
      setCapturedSession(session); setLoading(true); setBusy(false); setNeedsNonce(false); setAttempt(value => value + 1);
    }}>Actualiser les réglages</button>}
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h4>Authentification 2FA</h4>
        <p>{status ? `Applications TOTP vérifiées sur ce compte : ${verifiedTotp}.` : 'État du compte non vérifié'}</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          L’ajout, la suppression et la vérification 2FA à la connexion ne sont pas disponibles ici. Cette lecture ne confirme pas les règles d’accès du serveur.
        </p>
        <button type="button" disabled aria-label="Authentification 2FA" className="btn-secondary">Configuration indisponible</button>
      </div>
      <SessionDuration />
      {!opened && <button type="button" className="btn-secondary" disabled={!status || loading || busy} onClick={() => {
        setOpened(true); setError(''); setNotice('');
      }}>Changer le mot de passe</button>}
      {opened && <form onSubmit={submit} noValidate aria-label="Changer le mot de passe">
        <fieldset disabled={busy} style={{ display: 'grid', gap: 16, border: 0, padding: 0, margin: 0 }}>
          <label htmlFor="security-current-password">Mot de passe actuel
            <input id="security-current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} style={fieldStyle} />
          </label>
          <label htmlFor="security-new-password">Nouveau mot de passe
            <input id="security-new-password" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} style={fieldStyle} />
          </label>
          <label htmlFor="security-confirm-password">Confirmer le nouveau mot de passe
            <input id="security-confirm-password" type="password" autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} style={fieldStyle} />
          </label>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Huit caractères minimum. Les exigences supplémentaires du fournisseur restent applicables.</p>
          {needsNonce && <div style={{ display: 'grid', gap: 12 }}>
            <button type="button" onClick={sendCode} className="btn-secondary">Envoyer un code de confirmation</button>
            <label htmlFor="security-password-code">Code de confirmation
              <input id="security-password-code" autoComplete="one-time-code" value={nonce} onChange={event => setNonce(event.target.value)} style={fieldStyle} />
            </label>
          </div>}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn-primary">{busy ? 'Vérification…' : 'Confirmer le changement'}</button>
            <button type="button" className="btn-secondary" onClick={() => {
              clearFields(); setOpened(false); setNeedsNonce(false); setError(''); setNotice('');
            }}>Annuler</button>
          </div>
        </fieldset>
      </form>}
    </div>
  </section>;
}

export default function AccountSecurity() {
  const { user, session, getCurrentSession } = useAuth() || {};
  return user?.id ? <ConnectedSecurity key={`${user.id}:${securitySessionIdentity(session)}`} userId={user.id} session={session} getCurrentSession={getCurrentSession} /> : <AnonymousSecurity />;
}
