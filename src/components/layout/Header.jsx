import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { currentUser } from '../../data/mockData';

export default function Header({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    { id: 1, text: 'Dossier CNDS soumis avec succès', time: 'Il y a 2h', read: false },
    { id: 2, text: 'Nouveau membre inscrit via HelloAsso', time: 'Il y a 3h', read: false },
    { id: 3, text: 'Rapport hebdomadaire disponible', time: 'Hier', read: true },
    { id: 4, text: 'Subvention Région AuRA accordée', time: 'Hier', read: true },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      addToast(`Recherche : "${searchValue}"`, 'info');
      setSearchValue('');
    }
  };

  return (
    <header style={{
      height: 64,
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={onMenuToggle}
          className="btn-ghost"
          style={{ display: 'none', padding: 8 }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>
        <form onSubmit={handleSearch} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-btn)', padding: '8px 14px',
          width: 320,
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: 14, width: '100%',
            }}
          />
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={toggleTheme} className="btn-ghost" style={{ padding: 8 }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="btn-ghost"
            style={{ padding: 8, position: 'relative' }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent-red)',
            }} />
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 340, background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-card)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.2s ease',
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color)',
                fontWeight: 600, fontSize: 14,
              }}>
                Notifications
              </div>
              {notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    opacity: n.read ? 0.6 : 1,
                  }}
                  onClick={() => {
                    addToast(n.text, 'info');
                    setShowNotifs(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/profil')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px',
            borderRadius: 'var(--border-radius-btn)',
            background: 'transparent', cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-green), var(--accent-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'white',
          }}>
            {currentUser.initials}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{currentUser.role}</div>
          </div>
        </button>
      </div>
    </header>
  );
}
