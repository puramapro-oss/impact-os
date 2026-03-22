import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Award, Clock,
  BarChart3, FileText, Settings, Save
} from 'lucide-react';
import { currentUser } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Profil() {
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    prenom: 'Sophie',
    nom: 'Martin',
    email: currentUser.email,
    telephone: '06 12 34 56 78',
    ville: 'Lyon',
    bio: 'Présidente de l\'Association Sportive Les Aigles de Lyon depuis 2022. Passionnée de sport et d\'engagement associatif.',
  });

  const stats = [
    { icon: BarChart3, label: 'Tâches ce mois', value: '47' },
    { icon: Clock, label: 'Heures économisées', value: '28h' },
    { icon: FileText, label: 'Documents générés', value: '156' },
    { icon: Award, label: 'Score impact', value: '94/100' },
  ];

  const activite = [
    { action: 'Dossier CNDS soumis', date: 'Il y a 2h' },
    { action: 'Rapport Q1 téléchargé', date: 'Il y a 4h' },
    { action: 'Mode IA changé en SAFE', date: 'Hier' },
    { action: 'Workflow relances activé', date: 'Hier' },
    { action: 'Nouveau membre validé', date: 'Il y a 2 jours' },
    { action: 'Export comptable effectué', date: 'Il y a 3 jours' },
    { action: 'Connexion depuis Lyon', date: 'Il y a 3 jours' },
    { action: 'Paramètres de notification modifiés', date: 'Il y a 5 jours' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Mon profil</h1>
      </div>

      {/* Profile header */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24, display: 'flex', gap: 24 }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 800, color: 'white', flexShrink: 0,
        }}>
          {currentUser.initials}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 24, marginBottom: 4 }}>{currentUser.name}</h2>
          <p style={{ fontSize: 14, color: '#f59e0b', fontWeight: 600, marginBottom: 4 }}>{currentUser.role}</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{currentUser.organisation}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Mail size={12} /> {currentUser.email}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} /> Lyon, France
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} /> Membre depuis 2022
            </span>
          </div>
        </div>
        <span className="badge badge-gold">Plan {currentUser.plan} 🔥</span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <Icon size={20} color="#f59e0b" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Edit form */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Modifier le profil</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              ['Prénom', 'prenom', 'text'],
              ['Nom', 'nom', 'text'],
              ['Email', 'email', 'email'],
              ['Téléphone', 'telephone', 'tel'],
              ['Ville', 'ville', 'text'],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-secondary)' }}>{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{
                    width: '100%', padding: '8px 12px', background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
                    color: 'var(--text-primary)', fontSize: 13,
                  }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4, color: 'var(--text-secondary)' }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                style={{
                  width: '100%', padding: '8px 12px', background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
                  color: 'var(--text-primary)', fontSize: 13, minHeight: 80, resize: 'vertical',
                }} />
            </div>
          </div>
          <button onClick={() => addToast('Profil mis à jour', 'success')} className="btn-primary" style={{ marginTop: 16 }}>
            <Save size={16} /> Enregistrer
          </button>
        </div>

        {/* Activity */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Activité récente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activite.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: 6,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 13 }}>{a.action}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.date}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Préférences</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13 }}>Mode sombre</span>
              <button onClick={toggleTheme} style={{
                width: 44, height: 24, borderRadius: 12, padding: 2,
                background: theme === 'dark' ? 'var(--accent-green)' : 'var(--border-color)',
                transition: 'background 0.2s ease',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'white',
                  transition: 'transform 0.2s ease',
                  transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
