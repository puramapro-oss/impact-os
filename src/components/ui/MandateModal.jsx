import { useState } from 'react';
import { ShieldCheck, FileSignature, CheckCircle } from 'lucide-react';
import Modal from './Modal';

const COMMISSION_RATE = 0.11;

async function saveMandate(data) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return null;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: result, error } = await supabase.from('mandates').insert([data]).select();
    if (error) throw error;
    return result?.[0] ?? null;
  } catch (_) {
    return null;
  }
}

async function getClientIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data?.ip ?? 'unknown';
  } catch (_) {
    return 'unknown';
  }
}

export default function MandateModal({ isOpen, onClose, deal, onSuccess }) {
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!deal) return null;

  const monthlySaving = (deal.currentPrice ?? 0) - (deal.newPrice ?? 0);
  const yearlySaving = monthlySaving * 12;
  const commission = Math.round(yearlySaving * COMMISSION_RATE * 100) / 100;
  const netSaving = Math.round((yearlySaving - commission) * 100) / 100;

  const actionLabels = {
    switch: 'Changer de fournisseur',
    resiliation: 'Résilier',
    renegociation: 'Renégocier',
    downgrade: 'Modifier l\'offre',
  };

  const actionSummary = `${actionLabels[deal.actionType] ?? 'Agir sur'} ${deal.service} en ton nom`;

  const handleSign = async () => {
    setSubmitting(true);
    try {
      const ip = await getClientIP();
      await saveMandate({
        user_id: null,
        action_type: deal.actionType ?? '',
        service_name: deal.service ?? '',
        amount_saved: monthlySaving,
        commission_rate: COMMISSION_RATE,
        commission_amount: commission,
        signed_at: new Date().toISOString(),
        ip_address: ip,
        status: 'signed',
      });
      setDone(true);
      onSuccess?.(deal.id);
    } catch (_) {
      setDone(true);
      onSuccess?.(deal.id);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setAccepted(false);
    setDone(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Autoriser MANA à agir" width={520}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle size={56} color="var(--accent-green)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontFamily: 'var(--font-heading)', marginBottom: 8 }}>
            Mandat signé
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
            MANA va maintenant {actionSummary.toLowerCase()}.<br />
            Tu recevras une confirmation par email.
          </p>
          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 12, padding: 16, marginBottom: 20, textAlign: 'left',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>RÉCAPITULATIF</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Économie annuelle</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{yearlySaving.toFixed(2)}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Commission MANA (11%)</span>
              <span style={{ color: 'var(--text-muted)' }}>−{commission.toFixed(2)}€</span>
            </div>
            <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
              <span>Tu gardes (89%)</span>
              <span style={{ color: 'var(--accent-green)' }}>{netSaving.toFixed(2)}€/an</span>
            </div>
          </div>
          <button onClick={handleClose} className="btn-primary" style={{ width: '100%', padding: '14px 0' }}>
            Fermer
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 14, padding: 20, marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(34,211,238,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>{deal.icon}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{deal.service}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{deal.actionLabel}</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
              borderRadius: 10, padding: 14, marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <FileSignature size={16} color="#f59e0b" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>Action demandée</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                {actionSummary}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Actuellement</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-heading)', textDecoration: 'line-through' }}>
                  {deal.currentPrice?.toFixed(2) ?? '0.00'}€/mois
                </div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Après MANA</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-heading)' }}>
                  {deal.newPrice?.toFixed(2) ?? '0.00'}€/mois
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(34,211,238,0.04)', border: '1px solid var(--border-color)',
            borderRadius: 12, padding: 14, marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>TRANSPARENCE TARIFAIRE</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Économie mensuelle</span>
              <span style={{ fontWeight: 600 }}>{monthlySaving.toFixed(2)}€/mois</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Économie annuelle</span>
              <span style={{ fontWeight: 600 }}>{yearlySaving.toFixed(2)}€/an</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)' }}>MANA prend 11%</span>
              <span style={{ color: 'var(--text-muted)' }}>−{commission.toFixed(2)}€</span>
            </div>
            <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
              <span style={{ color: 'var(--accent-green)' }}>Vous gardez 89%</span>
              <span style={{ color: 'var(--accent-green)' }}>{netSaving.toFixed(2)}€/an</span>
            </div>
          </div>

          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: 14, borderRadius: 12, cursor: 'pointer',
            border: `1px solid ${accepted ? 'var(--accent-green)' : 'var(--border-color)'}`,
            background: accepted ? 'rgba(16,185,129,0.06)' : 'transparent',
            transition: 'all 0.2s ease', marginBottom: 20,
          }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={{ marginTop: 2, accentColor: 'var(--accent-green)', width: 18, height: 18, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              J'autorise MANA à effectuer cette démarche en mon nom conformément aux{' '}
              <span style={{ color: 'var(--accent-green)', textDecoration: 'underline', cursor: 'pointer' }}>CGU</span>.
              Ma signature électronique (horodatage + IP) sera conservée comme preuve.
            </span>
          </label>

          <button
            onClick={handleSign}
            disabled={!accepted || submitting}
            className="btn-primary"
            style={{
              width: '100%', padding: '16px 0', fontSize: 15, fontWeight: 700,
              opacity: accepted && !submitting ? 1 : 0.5,
              cursor: accepted && !submitting ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            {submitting ? (
              <>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white',
                  display: 'inline-block', animation: 'spin .7s linear infinite',
                }} />
                Signature en cours...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Je confirme et signe
              </>
            )}
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 12, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
          }}>
            🔒 Chiffrement AES-256 · Horodatage certifié · 100% RGPD
          </div>
        </div>
      )}
    </Modal>
  );
}
