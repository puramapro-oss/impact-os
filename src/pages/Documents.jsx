import { useState } from 'react';
import {
  FolderOpen, File, Upload, Download, Eye, Trash2,
  Search, ChevronRight, ChevronDown, Plus
} from 'lucide-react';
import { documentsArborescence } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

export default function Documents() {
  const { addToast } = useToast();
  const [expandedFolders, setExpandedFolders] = useState(['Administratif']);
  const [selectedFolder, setSelectedFolder] = useState('Administratif');
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const toggleFolder = (folder) => {
    setExpandedFolders(prev =>
      prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]
    );
    setSelectedFolder(folder);
  };

  const allDocs = Object.entries(documentsArborescence).flatMap(([folder, docs]) =>
    docs.map((doc, i) => ({ id: `${folder}-${i}`, nom: doc, dossier: folder, taille: `${(Math.random() * 5 + 0.2).toFixed(1)} Mo`, date: `${Math.floor(Math.random() * 28 + 1)}/03/2026` }))
  );

  const filteredDocs = allDocs.filter(d =>
    d.dossier === selectedFolder && d.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
            <FolderOpen size={28} color="var(--accent-blue)" />
            Documents
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {allDocs.length} documents dans {Object.keys(documentsArborescence).length} dossiers
          </p>
        </div>
        <button onClick={() => addToast('Sélectionnez un fichier à importer', 'info')} className="btn-primary">
          <Upload size={16} /> Importer
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
        {/* Sidebar arborescence */}
        <div className="glass-card" style={{ padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '8px 12px', letterSpacing: 1 }}>
            Dossiers
          </div>
          {Object.keys(documentsArborescence).map(folder => (
            <button key={folder} onClick={() => toggleFolder(folder)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', borderRadius: 6, background: selectedFolder === folder ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                color: selectedFolder === folder ? '#f59e0b' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: selectedFolder === folder ? 600 : 400,
                transition: 'all 0.15s ease', textAlign: 'left',
              }}
            >
              {expandedFolders.includes(folder) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <FolderOpen size={16} />
              {folder}
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                {documentsArborescence[folder].length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addToast('Fichier importé avec succès', 'success'); }}
            style={{
              border: `2px dashed ${dragOver ? '#f59e0b' : 'var(--border-color)'}`,
              borderRadius: 'var(--border-radius-card)', padding: 24,
              textAlign: 'center', marginBottom: 16, transition: 'all 0.2s ease',
              background: dragOver ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
            }}
          >
            <Upload size={24} color={dragOver ? '#f59e0b' : 'var(--text-muted)'} style={{ marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Glissez-déposez vos fichiers ici ou{' '}
              <span style={{ color: '#f59e0b', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => addToast('Sélectionnez un fichier', 'info')}>
                parcourez
              </span>
            </p>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-btn)', padding: '8px 14px',
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input type="text" placeholder="Rechercher dans ce dossier..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 14, width: '100%' }} />
          </div>

          {/* Table */}
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Document', 'Taille', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <File size={16} color="var(--text-secondary)" />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{doc.nom}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{doc.taille}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{doc.date}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => addToast(`${doc.nom} ouvert`, 'info')} className="btn-ghost" style={{ padding: 6 }}><Eye size={14} /></button>
                        <button onClick={() => addToast(`${doc.nom} téléchargé`, 'success')} className="btn-ghost" style={{ padding: 6 }}><Download size={14} /></button>
                        <button onClick={() => addToast(`${doc.nom} supprimé`, 'warning')} className="btn-ghost" style={{ padding: 6 }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
