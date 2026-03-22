import { useState } from 'react';
import { Mail, CheckCircle, Edit3, Archive, AlertCircle, Clock } from 'lucide-react';
import { emails } from '../data/mockData';
import { formatRelativeTime } from '../hooks/useRelativeTime';
import { useToast } from '../contexts/ToastContext';

export default function Inbox() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('traiter');
  const [mailList, setMailList] = useState(emails);
  const [selected, setSelected] = useState(null);

  const tabs = [
    { id: 'traiter', label: 'À traiter', count: mailList.filter(m => m.categorie === 'traiter').length },
    { id: 'traites', label: 'Traités', count: mailList.filter(m => m.categorie === 'traites').length },
    { id: 'archives', label: 'Archives', count: mailList.filter(m => m.categorie === 'archives').length },
  ];

  const filtered = mailList.filter(m => m.categorie === tab);

  const handleAction = (emailId, action) => {
    if (action === 'valider') {
      setMailList(prev => prev.map(m => m.id === emailId ? { ...m, categorie: 'traites' } : m));
      addToast('Email traité et archivé', 'success');
    } else if (action === 'archiver') {
      setMailList(prev => prev.map(m => m.id === emailId ? { ...m, categorie: 'archives' } : m));
      addToast('Email archivé', 'info');
    } else {
      addToast(`Action "${action}" exécutée`, 'success');
    }
    setSelected(null);
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mail size={28} color="var(--accent-blue)" />
          Inbox IA
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Vos emails analysés, résumés et priorisés par l'IA
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }}
            style={{
              padding: '10px 20px', fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#f59e0b' : 'var(--text-secondary)',
              background: 'transparent',
              borderBottom: tab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
              transition: 'all 0.15s ease',
            }}>
            {t.label}
            <span style={{
              marginLeft: 8, padding: '2px 8px', borderRadius: 10,
              background: tab === t.id ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
              fontSize: 11, fontWeight: 600,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        {/* Email list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center' }}>
              <Archive size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Aucun email dans cette catégorie</p>
            </div>
          ) : filtered.map(email => (
            <div key={email.id} onClick={() => setSelected(email)}
              className="glass-card" style={{
                padding: 16, cursor: 'pointer',
                borderColor: selected?.id === email.id ? 'var(--accent-green)' : 'var(--border-color)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { if (selected?.id !== email.id) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={(e) => { if (selected?.id !== email.id) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {!email.lu && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)' }} />}
                  <span style={{ fontSize: 14, fontWeight: email.lu ? 400 : 600 }}>{email.expediteur}</span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(email.date)}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{email.objet}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {email.resume}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span className={`badge badge-${email.priorite === 'haute' ? 'red' : email.priorite === 'moyenne' ? 'gold' : 'blue'}`}>
                  {email.priorite}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Email detail */}
        {selected && (
          <div className="glass-card" style={{ padding: 24, animation: 'fadeIn 0.3s ease', position: 'sticky', top: 88, alignSelf: 'start' }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{selected.objet}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{selected.expediteur}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>&lt;{selected.email}&gt;</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRelativeTime(selected.date)}</span>
            </div>

            <div style={{
              padding: 16, borderRadius: 8, marginBottom: 16,
              background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={14} /> Résumé IA
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.resume}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Actions suggérées par l'IA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.actions.map((action, i) => (
                  <button key={i} onClick={() => handleAction(selected.id, action.toLowerCase())}
                    className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                    <CheckCircle size={14} color="#10b981" />
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleAction(selected.id, 'valider')} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <CheckCircle size={16} /> Valider
              </button>
              <button onClick={() => addToast('Modification enregistrée', 'info')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                <Edit3 size={16} /> Modifier
              </button>
              <button onClick={() => handleAction(selected.id, 'archiver')} className="btn-ghost" style={{ padding: '10px 16px' }}>
                <Archive size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
