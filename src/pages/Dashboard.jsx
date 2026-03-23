import { useState, useEffect, useRef } from 'react';
import {
  Zap, Clock, Euro, TrendingUp, FileText, Mail,
  ArrowUpRight, ArrowDownRight, Play, CheckCircle, ChevronRight,
  ArrowRight, Sparkles
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { kpis, chartData7Days, chartData6Months, activitesRecentes, planDuJour, currentUser, deals } from '../data/mockData';
import { getGreeting, formatRelativeTime } from '../hooks/useRelativeTime';
import { useToast } from '../contexts/ToastContext';
import MandateModal from '../components/ui/MandateModal';

const iconMap = { Zap, Clock, Euro, TrendingUp, FileText, Mail };
const colorMap = { blue: '#3b82f6', green: '#10b981', gold: '#f59e0b', purple: '#8b5cf6' };

function KPICard({ kpi, index }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * kpi.value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [kpi.value]);

  const Icon = iconMap[kpi.icon];

  return (
    <div ref={ref} className="glass-card" style={{
      padding: 20,
      animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'rgba(245, 158, 11, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color="#f59e0b" />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          color: kpi.variation >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
          fontSize: 13, fontWeight: 600,
        }}>
          {kpi.variation >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(kpi.variation)}%
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
        {kpi.unit === '€' ? `${count.toLocaleString('fr-FR')}€` : `${count}${kpi.unit}`}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{kpi.label}</div>
    </div>
  );
}

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
            {p.name} : {p.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { addToast } = useToast();
  const [actions, setActions] = useState(planDuJour);
  const [mandateDeal, setMandateDeal] = useState(null);
  const [signedDeals, setSignedDeals] = useState([]);

  const handleExecute = (id) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, statut: 'done' } : a));
    addToast('Action exécutée avec succès', 'success');
  };

  const handleAcceptDeal = (deal) => {
    setMandateDeal(deal);
  };

  const handleMandateSuccess = (dealId) => {
    setSignedDeals(prev => [...prev, dealId]);
    addToast('Mandat signé — MANA s\'en occupe !', 'success');
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>
          {getGreeting()}, {currentUser.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Voici un résumé de l'activité de {currentUser.organisation}
        </p>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 24,
      }}>
        {kpis.map((kpi, i) => (
          <KPICard key={i} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Activité sur 7 jours</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="jour" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="taches" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Tâches" />
              <Line type="monotone" dataKey="emails" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Emails" />
              <Line type="monotone" dataKey="docs" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Documents" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Financements 6 mois</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData6Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="mois" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="financements" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Financements (€)" />
              <Bar dataKey="depenses" fill="#2563eb" radius={[4, 4, 0, 0]} name="Dépenses (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mandate Modal */}
      <MandateModal
        isOpen={!!mandateDeal}
        onClose={() => setMandateDeal(null)}
        deal={mandateDeal}
        onSuccess={handleMandateSuccess}
      />

      {/* Deals — Recommandations MANA */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} color="#f59e0b" />
            <h3 style={{ fontSize: 16, margin: 0 }}>Deals détectés par MANA</h3>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {deals.length} opportunités · {deals.reduce((s, d) => s + (d.currentPrice - d.newPrice), 0).toFixed(0)}€/mois d'économies
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {deals.map((deal) => {
            const saving = deal.currentPrice - deal.newPrice;
            const signed = signedDeals.includes(deal.id);
            return (
              <div key={deal.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 12,
                border: `1px solid ${signed ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`,
                background: signed ? 'rgba(16,185,129,0.04)' : 'transparent',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(34,211,238,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>{deal.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{deal.service}</span>
                    <span className="badge badge-gold" style={{ fontSize: 10 }}>{deal.category}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{deal.actionLabel}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 12, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {deal.currentPrice.toFixed(2)}€/mois
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-green)' }}>
                    {deal.newPrice.toFixed(2)}€/mois
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16,185,129,0.08)', borderRadius: 8,
                  padding: '4px 10px', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>
                    −{saving.toFixed(0)}€
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>/mois</div>
                </div>
                {signed ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-green)', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                    <CheckCircle size={16} /> Signé
                  </div>
                ) : (
                  <button
                    onClick={() => handleAcceptDeal(deal)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                  >
                    Accepter <ArrowRight size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12, color: 'var(--text-muted)',
        }}>
          💡 <span>MANA prend <strong style={{ color: '#f59e0b' }}>11%</strong> de l'économie annuelle — <strong>vous gardez 89%</strong>. Aucun frais si aucune économie.</span>
        </div>
      </div>

      {/* Activity + Plan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Activité récente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activitesRecentes.map((a) => {
              const Icon = iconMap[a.icon] || Zap;
              return (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 8,
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${colorMap[a.color] || '#10b981'}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color={colorMap[a.color] || '#10b981'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.message}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {formatRelativeTime(a.time)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Plan du jour</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actions.map((a) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8,
                border: '1px solid var(--border-color)',
                opacity: a.statut === 'done' ? 0.6 : 1,
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, width: 42 }}>
                  {a.heure}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    textDecoration: a.statut === 'done' ? 'line-through' : 'none',
                    color: 'var(--text-primary)',
                  }}>
                    {a.action}
                  </div>
                  <span className={`badge badge-${a.priorite === 'haute' ? 'red' : a.priorite === 'moyenne' ? 'gold' : 'blue'}`}
                    style={{ fontSize: 10, marginTop: 4 }}>
                    {a.priorite}
                  </span>
                </div>
                {a.statut === 'done' ? (
                  <CheckCircle size={18} color="#10b981" />
                ) : (
                  <button onClick={() => handleExecute(a.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>
                    <Play size={12} /> Exécuter
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
