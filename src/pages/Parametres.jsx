import { useState } from 'react';
import {
  Settings, Building2, Bell, Shield, Users, CreditCard,
  AlertTriangle, Save, Bot
} from 'lucide-react';
import { currentUser } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

export default function Parametres() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('general');
  const [modeIA, setModeIA] = useState(currentUser.modeIA);
  const [form, setForm] = useState({
    nomOrga: currentUser.organisation,
    email: currentUser.email,
    adresse: '12 rue de la République, 69001 Lyon',
    siret: '123 456 789 00012',
    notifEmail: true,
    notifPush: true,
    notifSMS: false,
    notifResume: true,
    auth2FA: true,
    sessionTimeout: '30',
    ipWhitelist: false,
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'organisation', label: 'Organisation', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'securite', label: 'Sécurité', icon: Shield },
    { id: 'membres', label: 'Membres', icon: Users },
    { id: 'facturation', label: 'Facturation', icon: CreditCard },
    { id: 'danger', label: 'Zone danger', icon: AlertTriangle },
  ];

  const modesIA = [
    { id: 'SAFE', label: 'SAFE', desc: 'L\'IA propose, vous validez chaque action', color: '#10b981' },
    { id: 'AUTOPILOT', label: 'AUTOPILOT', desc: 'L\'IA exécute les tâches à faible risque automatiquement', color: '#f59e0b' },
    { id: 'FULL', label: 'FULL', desc: 'L\'IA exécute toutes les tâches en autonomie complète', color: '#ef4444' },
  ];

  const handleSave = () => addToast('Paramètres enregistrés', 'success');

  const Toggle = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12, padding: 2,
      background: checked ? 'var(--accent-green)' : 'var(--border-color)',
      transition: 'background 0.2s ease', flexShrink: 0,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', background: 'white',
        transition: 'transform 0.2s ease',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
      }} />
    </button>
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Settings size={28} color="var(--text-secondary)" />
          Paramètres
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 'var(--border-radius-btn)', fontSize: 13,
                background: tab === t.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                color: tab === t.id ? 'var(--accent-green)' : t.id === 'danger' ? 'var(--accent-red)' : 'var(--text-secondary)',
                fontWeight: tab === t.id ? 600 : 400, textAlign: 'left',
              }}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          {tab === 'general' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Paramètres généraux</h3>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Bot size={16} /> Mode de l'IA
                </h4>
                <div style={{ display: 'flex', gap: 12 }}>
                  {modesIA.map(mode => (
                    <button key={mode.id} onClick={() => { setModeIA(mode.id); addToast(`Mode IA changé en ${mode.id}`, mode.id === 'FULL' ? 'warning' : 'success'); }}
                      style={{
                        flex: 1, padding: 16, borderRadius: 'var(--border-radius-card)',
                        border: `2px solid ${modeIA === mode.id ? mode.color : 'var(--border-color)'}`,
                        background: modeIA === mode.id ? `${mode.color}10` : 'transparent',
                        textAlign: 'left', transition: 'all 0.2s ease',
                      }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: mode.color, marginBottom: 4, fontFamily: 'var(--font-heading)' }}>
                        {mode.label}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Langue</label>
                  <select style={{
                    width: '100%', padding: '10px 14px', background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}>
                    <option>Français</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Fuseau horaire</label>
                  <select style={{
                    width: '100%', padding: '10px 14px', background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
                    color: 'var(--text-primary)', fontSize: 14,
                  }}>
                    <option>Europe/Paris (UTC+1)</option>
                    <option>Europe/London (UTC+0)</option>
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary" style={{ marginTop: 20 }}>
                <Save size={16} /> Enregistrer
              </button>
            </div>
          )}

          {tab === 'organisation' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Organisation</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {[
                  ['Nom de l\'organisation', 'nomOrga'],
                  ['Email de contact', 'email'],
                  ['Adresse', 'adresse'],
                  ['SIRET', 'siret'],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                    <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
                        color: 'var(--text-primary)', fontSize: 14,
                      }} />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary" style={{ marginTop: 20 }}><Save size={16} /> Enregistrer</button>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  ['Notifications par email', 'notifEmail', 'Recevoir les alertes par email'],
                  ['Notifications push', 'notifPush', 'Recevoir les notifications dans le navigateur'],
                  ['Notifications SMS', 'notifSMS', 'Recevoir les alertes critiques par SMS'],
                  ['Résumé quotidien', 'notifResume', 'Recevoir un résumé chaque matin à 9h'],
                ].map(([label, key, desc]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
                    </div>
                    <Toggle checked={form[key]} onChange={(v) => { setForm({ ...form, [key]: v }); addToast(`${label} ${v ? 'activées' : 'désactivées'}`, 'info'); }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'securite' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Sécurité</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Authentification 2FA</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Ajouter une couche de sécurité supplémentaire</div>
                  </div>
                  <Toggle checked={form.auth2FA} onChange={(v) => { setForm({ ...form, auth2FA: v }); addToast(`2FA ${v ? 'activée' : 'désactivée'}`, v ? 'success' : 'warning'); }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Timeout de session (minutes)</label>
                  <select value={form.sessionTimeout} onChange={(e) => setForm({ ...form, sessionTimeout: e.target.value })}
                    style={{
                      width: 200, padding: '10px 14px', background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
                      color: 'var(--text-primary)', fontSize: 14,
                    }}>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="480">8 heures</option>
                  </select>
                </div>
                <button onClick={() => addToast('Mot de passe modifié', 'success')} className="btn-secondary">Changer le mot de passe</button>
              </div>
            </div>
          )}

          {tab === 'membres' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Gestion des membres</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Gérez les rôles et permissions des membres de votre équipe.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { nom: 'Sophie Martin', role: 'Administrateur', email: 'sophie.martin@aigles-lyon.fr' },
                  { nom: 'Emma Petit', role: 'Éditeur', email: 'emma.petit@email.fr' },
                  { nom: 'Hugo Bernard', role: 'Éditeur', email: 'hugo.bernard@email.fr' },
                  { nom: 'Jade Michel', role: 'Lecteur', email: 'jade.michel@email.fr' },
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{m.nom}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.email}</div>
                    </div>
                    <span className={`badge badge-${m.role === 'Administrateur' ? 'green' : m.role === 'Éditeur' ? 'blue' : 'gold'}`}>{m.role}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => addToast('Invitation envoyée', 'success')} className="btn-primary" style={{ marginTop: 16 }}>Inviter un membre</button>
            </div>
          )}

          {tab === 'facturation' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>Facturation</h3>
              <div className="glass-card" style={{ padding: 16, marginBottom: 16, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>Plan Pro</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Facturé mensuellement</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-green)' }}>59€<span style={{ fontSize: 14, fontWeight: 400 }}>/mois</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { date: '01/03/2026', montant: '59,00€', statut: 'Payée' },
                  { date: '01/02/2026', montant: '59,00€', statut: 'Payée' },
                  { date: '01/01/2026', montant: '59,00€', statut: 'Payée' },
                  { date: '01/12/2025', montant: '59,00€', statut: 'Payée' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: 13 }}>{f.date}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{f.montant}</span>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>{f.statut}</span>
                    <button onClick={() => addToast('Facture téléchargée', 'success')} className="btn-ghost" style={{ padding: 4, fontSize: 12 }}>Télécharger</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'danger' && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--accent-red)' }}>Zone danger</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--accent-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Exporter toutes les données</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Télécharger une archive complète de vos données</div>
                  </div>
                  <button onClick={() => addToast('Export en cours de préparation...', 'info')} className="btn-secondary" style={{ fontSize: 12 }}>Exporter</button>
                </div>
                <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--accent-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-red)' }}>Supprimer l'organisation</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Cette action est irréversible et supprimera toutes vos données</div>
                  </div>
                  <button onClick={() => addToast('Veuillez confirmer par email', 'error')}
                    style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-btn)', background: 'var(--accent-red)', color: 'white', fontSize: 12, fontWeight: 600 }}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
