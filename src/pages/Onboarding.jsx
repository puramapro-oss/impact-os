import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, Target, ArrowRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

const STEPS = [
  { key: 'organisation', label: 'Votre organisation', icon: Building2 },
  { key: 'equipe', label: 'Votre équipe', icon: Users },
  { key: 'objectifs', label: 'Vos objectifs', icon: Target },
];

const OBJECTIFS = [
  'Réduire mes charges', 'Négocier mes contrats', 'Piloter mon budget',
  'Automatiser ma gestion', 'Suivre mes mandats', 'Obtenir des financements',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    organisation: '',
    type_org: 'association',
    nb_membres: '',
    objectifs: [],
  });

  const handleFinish = async () => {
    try {
      setLoading(true);
      await supabase.auth.updateUser({
        data: {
          organisation: form.organisation,
          type_org: form.type_org,
          nb_membres: form.nb_membres,
          objectifs: form.objectifs,
          onboarding_done: true,
        },
      });
      navigate('/dashboard', { replace: true });
    } catch {
      navigate('/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const toggleObjectif = (obj) => {
    setForm((prev) => ({
      ...prev,
      objectifs: prev.objectifs.includes(obj)
        ? prev.objectifs.filter((o) => o !== obj)
        : [...prev.objectifs, obj],
    }));
  };

  const canNext = step === 0
    ? form.organisation.trim().length > 0
    : step === 1
      ? true
      : form.objectifs.length > 0;

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: 'var(--bg-input)',
    border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-btn)',
    color: 'var(--text-primary)', fontSize: 14,
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
            Bienvenue{user?.user_metadata?.prenom ? `, ${user.user_metadata.prenom}` : ''} !
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Configurons votre espace MANA en 3 étapes
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? '#22D3EE' : 'var(--border-color)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            {(() => { const Icon = STEPS[step].icon; return <Icon size={20} color="#22D3EE" />; })()}
            <h2 style={{ fontSize: 18, fontFamily: 'var(--font-heading)' }}>{STEPS[step].label}</h2>
          </div>

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Nom de l'organisation
                </label>
                <input value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                  placeholder="Les Aigles de Lyon" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Type</label>
                <select value={form.type_org} onChange={(e) => setForm({ ...form, type_org: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="association">Association</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="collectivite">Collectivité</option>
                  <option value="independant">Indépendant</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Nombre de membres (facultatif)
              </label>
              <input type="number" value={form.nb_membres}
                onChange={(e) => setForm({ ...form, nb_membres: e.target.value })}
                placeholder="ex: 120" style={inputStyle} />
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {OBJECTIFS.map((obj) => {
                const selected = form.objectifs.includes(obj);
                return (
                  <button key={obj} type="button" onClick={() => toggleObjectif(obj)} style={{
                    padding: '8px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                    background: selected ? 'rgba(34, 211, 238, 0.15)' : 'var(--bg-input)',
                    border: `1px solid ${selected ? '#22D3EE' : 'var(--border-color)'}`,
                    color: selected ? '#22D3EE' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                  }}>
                    {selected && <Check size={14} />} {obj}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            {step > 0 ? (
              <button type="button" className="btn-ghost" onClick={() => setStep(step - 1)}
                style={{ fontSize: 14 }}>
                Retour
              </button>
            ) : <div />}

            {step < 2 ? (
              <button type="button" className="btn-primary" disabled={!canNext}
                onClick={() => setStep(step + 1)}
                style={{ padding: '10px 24px', fontSize: 14, opacity: canNext ? 1 : 0.5 }}>
                Suivant <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" className="btn-primary" disabled={!canNext || loading}
                onClick={handleFinish}
                style={{ padding: '10px 24px', fontSize: 14, opacity: canNext && !loading ? 1 : 0.5 }}>
                {loading ? 'Chargement...' : 'Accéder à MANA'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
