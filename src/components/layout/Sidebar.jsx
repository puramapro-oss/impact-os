import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Mail, Bot, BarChart3, Users,
  FolderOpen, ScrollText, Settings, User, ChevronLeft, ChevronRight,
  Sparkles, LogOut, Zap
} from 'lucide-react';

const navGroups = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
      { to: '/resoutre', icon: Sparkles, label: 'RESOUTRE' },
      { to: '/inbox', icon: Mail, label: 'Inbox IA' },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { to: '/agent', icon: Bot, label: 'Agent Exécutif' },
      { to: '/impact', icon: BarChart3, label: 'Impact & Financement' },
      { to: '/membres', icon: Users, label: 'Membres' },
      { to: '/documents', icon: FolderOpen, label: 'Documents' },
    ],
  },
  {
    label: 'Système',
    items: [
      { to: '/audit', icon: ScrollText, label: 'Journal d\'audit' },
      { to: '/parametres', icon: Settings, label: 'Paramètres' },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 100,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0 16px' : '0 20px',
        gap: 10,
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.3)',
        }}>
          ✨
        </div>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 18,
            color: 'var(--text-primary)', whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            LUMIOS
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 16 }}>
            {!collapsed && (
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: 1,
                padding: '4px 12px', marginBottom: 4,
              }}>
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: collapsed ? '10px 0' : '10px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--border-radius-btn)',
                    color: isActive ? '#f59e0b' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                    marginBottom: 2,
                  }}
                  title={collapsed ? item.label : undefined}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse button */}
      <div style={{
        padding: 8,
        borderTop: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 'var(--border-radius-btn)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: 14,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
