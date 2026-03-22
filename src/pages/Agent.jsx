import { useState } from 'react';
import {
  Bot, Zap, FileText, Layout, Link2, ToggleLeft, ToggleRight,
  Clock, Download, Eye, Mail, HardDrive, Calendar, Heart,
  CreditCard, MessageCircle, CheckCircle, XCircle, Search
} from 'lucide-react';
import { workflows, documentsGeneres, modeles, connecteurs } from '../data/mockData';
import { formatRelativeTime } from '../hooks/useRelativeTime';
import { useToast } from '../contexts/ToastContext';

const iconMap = { Mail, HardDrive, Calendar, Heart, CreditCard, MessageCircle };

export default function Agent() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('workflows');
  const [wfList, setWfList] = useState(workflows);
  const [searchDoc, setSearchDoc] = useState('');

  const tabs = [
    { id: 'workflows', label: 'Workflows actifs', icon: Zap },
    { id: 'documents', label: 'Documents générés', icon: FileText },
    { id: 'modeles', label: 'Modèles', icon: Layout },
    { id: 'connecteurs', label: 'Connecteurs', icon: Link2 },
  ];

  const toggleWorkflow = (id) => {
    setWfList(prev => prev.map(w => w.id === id ? { ...w, actif: !w.actif } : w));
    const wf = wfList.find(w => w.id === id);
    addToast(`Workflow "${wf.nom}" ${wf.actif ? 'désactivé' : 'activé'}`, wf.actif ? 'warning' : 'success');
  };

  const filteredDocs = documentsGeneres.filter(d =>
    d.nom.toLowerCase().includes(searchDoc.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bot size={28} color="#f59e0b" />
          Agent Exécutif
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Vos workflows automatisés, documents générés et connecteurs
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 20px', fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#f59e0b' : 'var(--text-secondary)',
              background: 'transparent', display: 'flex', alignItems: 'center', gap: 6,
              borderBottom: tab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
            }}>
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Workflows */}
      {tab === 'workflows' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {wfList.map(wf => (
            <div key={wf.id} className="glass-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => toggleWorkflow(wf.id)} style={{ background: 'none', padding: 0, flexShrink: 0 }}>
                {wf.actif
                  ? <ToggleRight size={28} color="var(--accent-green)" />
                  : <ToggleLeft size={28} color="var(--text-muted)" />
                }
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, opacity: wf.actif ? 1 : 0.5 }}>{wf.nom}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', opacity: wf.actif ? 1 : 0.5 }}>{wf.description}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 2 }}>
                  <Clock size={12} /> {formatRelativeTime(wf.derniereExec)}
                </div>
                <span className="badge badge-blue" style={{ fontSize: 10 }}>{wf.frequence}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents */}
      {tab === 'documents' && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)', padding: '8px 14px', maxWidth: 320 }}>
            <Search size={16} color="var(--text-secondary)" />
            <input type="text" placeholder="Rechercher un document..." value={searchDoc} onChange={(e) => setSearchDoc(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
          </div>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Document', 'Type', 'Taille', 'Date', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>{doc.nom}</td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-blue" style={{ fontSize: 11 }}>{doc.type}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{doc.taille}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{formatRelativeTime(doc.date)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge badge-${doc.statut === 'Finalisé' ? 'green' : doc.statut === 'Brouillon' ? 'gold' : 'blue'}`} style={{ fontSize: 11 }}>
                        {doc.statut}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => addToast(`${doc.nom} ouvert`, 'info')} className="btn-ghost" style={{ padding: 6 }}><Eye size={14} /></button>
                        <button onClick={() => addToast(`${doc.nom} téléchargé`, 'success')} className="btn-ghost" style={{ padding: 6 }}><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modèles */}
      {tab === 'modeles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {modeles.map(m => (
            <div key={m.id} className="glass-card" style={{ padding: 16, cursor: 'pointer', transition: 'all 0.15s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f59e0b'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              onClick={() => addToast(`Modèle "${m.nom}" chargé`, 'success')}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{m.nom}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-blue" style={{ fontSize: 10 }}>{m.categorie}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.utilisations} utilisations</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connecteurs */}
      {tab === 'connecteurs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {connecteurs.map(c => {
            const Icon = iconMap[c.icon] || Link2;
            return (
              <div key={c.id} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={22} color={c.statut === 'connecte' ? '#10b981' : 'var(--text-muted)'} />
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{c.nom}</span>
                  </div>
                  {c.statut === 'connecte'
                    ? <CheckCircle size={18} color="#10b981" />
                    : <XCircle size={18} color="var(--text-muted)" />
                  }
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{c.description}</p>
                <button
                  onClick={() => addToast(c.statut === 'connecte' ? `${c.nom} déconnecté` : `${c.nom} connecté`, c.statut === 'connecte' ? 'warning' : 'success')}
                  className={c.statut === 'connecte' ? 'btn-secondary' : 'btn-primary'}
                  style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
                >
                  {c.statut === 'connecte' ? 'Déconnecter' : 'Connecter'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
