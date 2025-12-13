import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectManagerProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onClose: () => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const startEditing = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditName(project.name);
  };

  const saveEditing = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editingProjectId && editName.trim()) {
      onRenameProject(editingProjectId, editName.trim());
      setEditingProjectId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/40">
        {/* Header */}
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-slate-800 text-xl">Meine Strukturen</h2>
            <p className="text-slate-700 text-sm mt-1">Verwalten Sie verschiedene Szenarien und Mandanten.</p>
          </div>
          
          {!isCreating ? (
            <button 
              onClick={() => { setIsCreating(true); setNewProjectName(''); }}
              className="px-4 py-2 glass border border-indigo-400/50 bg-indigo-600/60 text-white text-sm font-medium rounded-xl hover:bg-indigo-600/80 transition-all shadow-lg flex items-center gap-2 backdrop-blur-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Neues Projekt
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsCreating(false)} className="text-sm text-slate-700 hover:text-slate-900 font-medium">Abbrechen</button>
            </div>
          )}
        </div>

        {/* Creation Form */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="p-4 border-b border-white/20 flex gap-2 glass">
            <input 
              autoFocus
              type="text"
              placeholder="Projektname eingeben..."
              className="flex-1 px-4 py-2 rounded-xl border border-white/30 focus:ring-2 focus:ring-indigo-400/50 outline-none text-sm glass text-slate-900 backdrop-blur-xl"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!newProjectName.trim()}
              className="px-4 py-2 glass border border-indigo-400/50 bg-indigo-600/60 text-white text-sm font-medium rounded-xl hover:bg-indigo-600/80 disabled:opacity-50 backdrop-blur-xl"
            >
              Erstellen
            </button>
          </form>
        )}

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`relative group p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-lg flex flex-col ${
                activeProjectId === project.id 
                  ? 'glass-strong border-indigo-400/60 ring-4 ring-indigo-400/20' 
                  : 'glass border-white/30 hover:border-white/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center glass border border-white/20 ${
                  activeProjectId === project.id ? 'text-indigo-600' : 'text-slate-600'
                }`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                {activeProjectId === project.id && (
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Aktiv</span>
                )}
              </div>
              
              {editingProjectId === project.id ? (
                <form onSubmit={saveEditing} onClick={e => e.stopPropagation()} className="mb-1">
                  <input 
                    autoFocus
                    className="w-full glass border border-white/30 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 outline-none backdrop-blur-xl"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    onBlur={() => saveEditing()}
                  />
                </form>
              ) : (
                <h3 className="font-bold text-slate-800 truncate mb-1 pr-8">{project.name}</h3>
              )}
              
                <p className="text-xs text-slate-700 mb-4">
                {new Date(project.lastModified).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              
              <div className="mt-auto flex gap-2 pt-3 border-t border-white/20">
                <div className="text-xs text-slate-800 flex-1">
                  {project.data.companies.length} Firmen • {project.data.people.length} Pers.
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => startEditing(project, e)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Umbenennen"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDuplicateProject(project.id); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Duplizieren"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Löschen"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 glass border border-white/30 text-slate-700 text-sm font-medium hover:bg-white/30 rounded-xl transition-all backdrop-blur-xl"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;