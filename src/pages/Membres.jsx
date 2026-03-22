import { useState } from 'react';
import { Users, Search, Grid3X3, List, Mail, Phone, Clock, Award } from 'lucide-react';
import { membres } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/ui/Modal';

export default function Membres() {
  const { addToast } = useToast();
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedMembre, setSelectedMembre] = useState(null);

  const filtered = membres.filter(m =>
    `${m.prenom} ${m.nom} ${m.email} ${m.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (m) => `${m.prenom[0]}${m.nom[0]}`;
  const colors = ['#10b981', '#2563eb', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];
  const getColor = (id) => colors[id % colors.length];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={28} color="var(--accent-purple)" />
            Membres & Bénévoles
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{membres.length} membres enregistrés</p>
        </div>
        <button onClick={() => addToast('Formulaire d\'ajout ouvert', 'info')} className="btn-primary">
          Ajouter un membre
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-btn)', padding: '8px 14px', width: 320,
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input type="text" placeholder="Rechercher un membre..." value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setView('grid')} className="btn-ghost"
            style={{ padding: 8, color: view === 'grid' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
            <Grid3X3 size={18} />
          </button>
          <button onClick={() => setView('list')} className="btn-ghost"
            style={{ padding: 8, color: view === 'list' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
            <List size={18} />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {filtered.map(m => (
            <div key={m.id} className="glass-card" style={{ padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
              onClick={() => setSelectedMembre(m)}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = getColor(m.id)}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
                background: `linear-gradient(135deg, ${getColor(m.id)}, ${getColor(m.id + 2)})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: 'white',
              }}>
                {getInitials(m)}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{m.prenom} {m.nom}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{m.role}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                <span className={`badge badge-${m.statut === 'Actif' ? 'green' : 'red'}`} style={{ fontSize: 10 }}>{m.statut}</span>
                <span className={`badge badge-${m.cotisation === 'À jour' ? 'green' : m.cotisation === 'En retard' ? 'gold' : 'red'}`} style={{ fontSize: 10 }}>
                  {m.cotisation}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Membre', 'Rôle', 'Email', 'Téléphone', 'Statut', 'Cotisation', 'Bénévolat'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                  onClick={() => setSelectedMembre(m)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${getColor(m.id)}, ${getColor(m.id + 2)})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0,
                      }}>{getInitials(m)}</div>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{m.prenom} {m.nom}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{m.role}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{m.email}</td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{m.telephone}</td>
                  <td style={{ padding: '10px 16px' }}><span className={`badge badge-${m.statut === 'Actif' ? 'green' : 'red'}`} style={{ fontSize: 10 }}>{m.statut}</span></td>
                  <td style={{ padding: '10px 16px' }}><span className={`badge badge-${m.cotisation === 'À jour' ? 'green' : m.cotisation === 'En retard' ? 'gold' : 'red'}`} style={{ fontSize: 10 }}>{m.cotisation}</span></td>
                  <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{m.heuresBenevolat}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Member Modal */}
      <Modal isOpen={!!selectedMembre} onClose={() => setSelectedMembre(null)} title="Profil membre" width={500}>
        {selectedMembre && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: `linear-gradient(135deg, ${getColor(selectedMembre.id)}, ${getColor(selectedMembre.id + 2)})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, color: 'white',
              }}>
                {getInitials(selectedMembre)}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selectedMembre.prenom} {selectedMembre.nom}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{selectedMembre.role}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Mail size={14} /> {selectedMembre.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Phone size={14} /> {selectedMembre.telephone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Clock size={14} /> Inscrit le {new Date(selectedMembre.dateInscription).toLocaleDateString('fr-FR')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Award size={14} /> {selectedMembre.heuresBenevolat}h de bénévolat
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className={`badge badge-${selectedMembre.statut === 'Actif' ? 'green' : 'red'}`}>{selectedMembre.statut}</span>
              <span className={`badge badge-${selectedMembre.cotisation === 'À jour' ? 'green' : selectedMembre.cotisation === 'En retard' ? 'gold' : 'red'}`}>{selectedMembre.cotisation}</span>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Historique récent</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Participation entraînement samedi', 'Cotisation réglée par CB', 'Inscription tournoi inter-clubs', 'Bénévolat journée portes ouvertes'].map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '6px 10px', background: 'var(--bg-primary)', borderRadius: 6 }}>
                  {a}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => { addToast('Email envoyé', 'success'); }} className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                Envoyer un email
              </button>
              <button onClick={() => { addToast('Profil modifié', 'info'); }} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}>
                Modifier
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
