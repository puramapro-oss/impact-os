import { useState } from 'react';
import {
  BarChart3, Euro, FileText, TrendingUp, Target,
  Download, Eye, Clock, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { indicateursImpact, subventions, chartData6Months } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

const COLORS = ['#10b981', '#2563eb', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

const rapports = [
  { id: 1, nom: 'Rapport d\'impact Q1 2026', date: 'Mars 2026', pages: 24, statut: 'Finalisé' },
  { id: 2, nom: 'Bilan social annuel 2025', date: 'Janvier 2026', pages: 42, statut: 'Finalisé' },
  { id: 3, nom: 'Rapport ESS trimestriel', date: 'Février 2026', pages: 18, statut: 'Finalisé' },
  { id: 4, nom: 'Évaluation programme jeunesse', date: 'Mars 2026', pages: 15, statut: 'Brouillon' },
  { id: 5, nom: 'Rapport partenariats 2025', date: 'Décembre 2025', pages: 28, statut: 'Finalisé' },
  { id: 6, nom: 'Bilan carbone associatif', date: 'Janvier 2026', pages: 12, statut: 'Finalisé' },
  { id: 7, nom: 'Rapport d\'activité annuel', date: 'Février 2026', pages: 36, statut: 'En cours' },
  { id: 8, nom: 'Évaluation satisfaction membres', date: 'Mars 2026', pages: 8, statut: 'Brouillon' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
            {p.name} : {typeof p.value === 'number' ? p.value.toLocaleString('fr-FR') : p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Impact() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('impact');

  const tabs = [
    { id: 'impact', label: 'Tableau d\'impact', icon: BarChart3 },
    { id: 'subventions', label: 'Subventions', icon: Euro },
    { id: 'rapports', label: 'Rapports', icon: FileText },
  ];

  const pieData = indicateursImpact.map(i => ({ name: i.label, value: i.valeur }));

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart3 size={28} color="var(--accent-gold)" />
          Impact & Financement
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Mesurez votre impact social et gérez vos financements
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 20px', fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--accent-green)' : 'var(--text-secondary)',
              background: 'transparent', display: 'flex', alignItems: 'center', gap: 6,
              borderBottom: tab === t.id ? '2px solid var(--accent-green)' : '2px solid transparent',
            }}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'impact' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {indicateursImpact.map((ind, i) => (
              <div key={ind.id} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{ind.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: ind.tendance >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}>
                    {ind.tendance >= 0 ? '+' : ''}{ind.tendance}%
                  </span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>
                  {ind.valeur.toLocaleString('fr-FR')} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>{ind.unite}</span>
                </div>
                <div style={{ background: 'var(--bg-primary)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min((ind.valeur / ind.objectif) * 100, 100)}%`,
                    height: '100%', borderRadius: 4,
                    background: COLORS[i % COLORS.length],
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Objectif : {ind.objectif.toLocaleString('fr-FR')} {ind.unite}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Évolution du score d'impact</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData6Months}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="mois" stroke="var(--text-secondary)" fontSize={12} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="impact" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Score impact" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Répartition</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'subventions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {subventions.map(sub => (
            <div key={sub.id} className="glass-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{sub.nom}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Échéance : {new Date(sub.echeance).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-green)' }}>
                    {sub.montant.toLocaleString('fr-FR')}€
                  </div>
                  <span className={`badge badge-${sub.statut === 'Accordée' ? 'green' : sub.statut === 'Soumis' ? 'blue' : sub.statut === 'En cours' ? 'gold' : 'purple'}`}>
                    {sub.statut}
                  </span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{
                  width: `${sub.progression}%`, height: '100%', borderRadius: 4,
                  background: sub.statut === 'Accordée' ? '#10b981' : sub.statut === 'Soumis' ? '#2563eb' : '#f59e0b',
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub.organisme}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub.progression}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'rapports' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {rapports.map(r => (
            <div key={r.id} className="glass-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <FileText size={20} color="var(--accent-green)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{r.nom}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.date} — {r.pages} pages</div>
              </div>
              <span className={`badge badge-${r.statut === 'Finalisé' ? 'green' : r.statut === 'En cours' ? 'gold' : 'blue'}`} style={{ fontSize: 10 }}>
                {r.statut}
              </span>
              <button onClick={() => addToast(`${r.nom} téléchargé`, 'success')} className="btn-ghost" style={{ padding: 6 }}>
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
