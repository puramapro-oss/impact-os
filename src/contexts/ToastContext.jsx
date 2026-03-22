import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#2563eb',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {toasts.map(toast => {
          const Icon = icons[toast.type];
          return (
            <div key={toast.id} style={{
              background: 'var(--bg-card)', border: `1px solid ${colors[toast.type]}`,
              borderRadius: 'var(--border-radius-btn)', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10, minWidth: 300,
              animation: 'slideIn 0.3s ease', boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
            }}>
              <Icon size={18} color={colors[toast.type]} />
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} style={{
                background: 'none', color: 'var(--text-secondary)', padding: 2,
              }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
