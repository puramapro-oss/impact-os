import { useState } from 'react';
import {
  ScrollText, Filter, Download, Bot, User, CheckCircle,
  AlertTriangle, XCircle, Info, Clock
} from 'lucide-react';
import { journalAudit } from '../data/mockData';
import { formatRelativeTime } from '../hooks/useRelativeTime';
import { useToast } from '../contexts/ToastContext';

const niveauIcons = { info: Info, success: CheckCircle, warning: AlertTriangle, error: XCircle };
const niveauColors = { info: '#2563eb', success: '#10b981', warning: '#f59e0b', error: '#ef4444' };

export default function Audit() {
  const { addToast } = useToast();
  const [filterType, setFilterType] = useState('all');
  const [filterNiveau, setFilterNiveau] = useState('all');

  const filtered = journalAudit.filter(e =>
    (filterType === 'all' || e.type === filterType) &&
    (filterNiveau === 'all' || e.niveau === filterNiveau)
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScrollText size={28} color="var(--accent-blue)" />
            Journal d'audit
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Traçabilité complète de toutes les actions — {journalAudit.length} événements
          </p>
        </div>
        <button onClick={() => addToast('Export CSV téléchargé', 'success')} className="btn-secondary">
          <Download size={16} /> Exporter
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['all', 'Tous'], ['ia', 'IA'], ['utilisateur', 'Utilisateurs']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterType(val)}
              className={filterType === val ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: 12 }}>
              {val === 'ia' && <Bot size={12} />}
              {val === 'utilisateur' && <User size={12} />}
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['all', 'Tous niveaux'], ['info', 'Info'], ['success', 'Succès'], ['warning', 'Alerte'], ['error', 'Erreur']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterNiveau(val)}
              className={filterNiveau === val ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: 12 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        <div style={{
          position: 'absolute', left: 11, top: 0, bottom: 0, width: 2,
          background: 'var(--border-color)',
        }} />

        {filtered.map((event, i) => {
          const NiveauIcon = niveauIcons[event.niveau];
          return (
            <div key={event.id} style={{
              position: 'relative', marginBottom: 12,
              animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
            }}>
              <div style={{
                position: 'absolute', left: -32, top: 12,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--bg-primary)',
                border: `2px solid ${niveauColors[event.niveau]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <NiveauIcon size={12} color={niveauColors[event.niveau]} />
              </div>

              <div className="glass-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {event.type === 'ia'
                      ? <Bot size={14} color="var(--accent-green)" />
                      : <User size={14} color="var(--accent-blue)" />
                    }
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{event.utilisateur}</span>
                    <span className={`badge badge-${event.niveau === 'info' ? 'blue' : event.niveau === 'success' ? 'green' : event.niveau === 'warning' ? 'gold' : 'red'}`}
                      style={{ fontSize: 10 }}>
                      {event.action}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {formatRelativeTime(event.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {event.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
