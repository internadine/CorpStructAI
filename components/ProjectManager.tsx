import React, { useState } from 'react';
import { Project, ProjectType } from '../types';

interface ProjectManagerProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, projectType?: ProjectType, country?: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onUpdateProject?: (id: string, updates: { name?: string; projectType?: ProjectType; country?: string }) => void;
  onClose: () => void;
}

const COUNTRIES: { code: string; name: string }[] = [
  { code: '', name: 'Not specified' },
  { code: 'DE', name: 'Germany' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'ZA', name: 'South Africa' }
];

const getCountryName = (code?: string): string => {
  if (!code) return 'Not specified';
  return COUNTRIES.find(c => c.code === code)?.name || code;
};

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  [ProjectType.CORPORATE_STRUCTURE]: 'Corporate Structure',
  [ProjectType.TEAM_STRUCTURE]: 'Team Structure',
  [ProjectType.M_A_SCENARIOS]: 'M&A Scenarios',
  [ProjectType.STARTUP_EQUITY]: 'Startup Equity',
  [ProjectType.FAMILY_BUSINESS]: 'Family Business',
  [ProjectType.COMPLIANCE_GOVERNANCE]: 'Compliance & Governance',
  [ProjectType.INTERNATIONAL_STRUCTURE]: 'International Structure',
  [ProjectType.PARTNERSHIP_JV]: 'Partnership & JV',
  [ProjectType.INVESTMENT_FUND]: 'Investment Fund',
  [ProjectType.NONPROFIT]: 'Non-Profit',
  [ProjectType.REAL_ESTATE]: 'Immobilien'
};

const getProjectTypeLabel = (projectType?: ProjectType): string => {
  if (!projectType) return PROJECT_TYPE_LABELS[ProjectType.CORPORATE_STRUCTURE];
  return PROJECT_TYPE_LABELS[projectType] || projectType;
};

const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
  onUpdateProject,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<ProjectType>(ProjectType.CORPORATE_STRUCTURE);
  const [newProjectCountry, setNewProjectCountry] = useState<string>('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Settings editing state
  const [settingsProjectId, setSettingsProjectId] = useState<string | null>(null);
  const [settingsName, setSettingsName] = useState('');
  const [settingsType, setSettingsType] = useState<ProjectType>(ProjectType.CORPORATE_STRUCTURE);
  const [settingsCountry, setSettingsCountry] = useState<string>('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim(), newProjectType, newProjectCountry || undefined);
      setNewProjectName('');
      setNewProjectType(ProjectType.CORPORATE_STRUCTURE);
      setNewProjectCountry('');
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

  const openSettings = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSettingsProjectId(project.id);
    setSettingsName(project.name);
    setSettingsType(project.projectType || ProjectType.CORPORATE_STRUCTURE);
    setSettingsCountry(project.country || '');
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsProjectId && settingsName.trim()) {
      if (onUpdateProject) {
        onUpdateProject(settingsProjectId, {
          name: settingsName.trim(),
          projectType: settingsType,
          country: settingsCountry || undefined
        });
      } else {
        // Fallback to just renaming if onUpdateProject is not provided
        onRenameProject(settingsProjectId, settingsName.trim());
      }
      setSettingsProjectId(null);
    }
  };

  const closeSettings = () => {
    setSettingsProjectId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/40">
        {/* Header */}
        <div className="p-6 border-b border-white/20 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-slate-800 text-xl">My Structures</h2>
            <p className="text-slate-700 text-sm mt-1">Manage different scenarios and clients.</p>
          </div>
          
          {!isCreating ? (
            <button 
              onClick={() => { setIsCreating(true); setNewProjectName(''); setNewProjectType(ProjectType.CORPORATE_STRUCTURE); setNewProjectCountry(''); }}
              className="px-4 py-2 glass border border-indigo-400/50 bg-indigo-600/60 text-white text-sm font-medium rounded-xl hover:bg-indigo-600/80 transition-all shadow-lg flex items-center gap-2 backdrop-blur-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsCreating(false)} className="text-sm text-slate-700 hover:text-slate-900 font-medium">Cancel</button>
            </div>
          )}
        </div>

        {/* Creation Form */}
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="p-4 border-b border-white/20 space-y-3 glass">
            <div className="flex gap-2">
              <input 
                autoFocus
                type="text"
                placeholder="Enter project name..."
                className="flex-1 px-4 py-2 rounded-xl border border-white/30 focus:ring-2 focus:ring-indigo-400/50 outline-none text-sm glass text-slate-900 backdrop-blur-xl"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!newProjectName.trim()}
                className="px-4 py-2 glass border border-indigo-400/50 bg-indigo-600/60 text-white text-sm font-medium rounded-xl hover:bg-indigo-600/80 disabled:opacity-50 backdrop-blur-xl"
              >
                Create
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Project Type</label>
                <select
                  value={newProjectType}
                  onChange={e => setNewProjectType(e.target.value as ProjectType)}
                  className="w-full px-4 py-2 rounded-xl border border-white/30 text-sm glass text-slate-900 backdrop-blur-xl focus:ring-2 focus:ring-indigo-400/50 outline-none"
                >
                  {Object.values(ProjectType).map(type => (
                    <option key={type} value={type}>{PROJECT_TYPE_LABELS[type]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Country (for Tax/Legal)</label>
                <select
                  value={newProjectCountry}
                  onChange={e => setNewProjectCountry(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-white/30 text-sm glass text-slate-900 backdrop-blur-xl focus:ring-2 focus:ring-indigo-400/50 outline-none"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {getProjectTypeLabel(project.projectType)}
                  </span>
                  {project.country && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      {getCountryName(project.country)}
                    </span>
                  )}
                  {activeProjectId === project.id && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
                  )}
                </div>
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
                    onClick={(e) => openSettings(project, e)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Settings"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDuplicateProject(project.id); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Duplicate"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
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

      {/* Settings Modal */}
      {settingsProjectId && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={closeSettings}
        >
          <div 
            className="glass-strong rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-white/20">
              <h3 className="font-bold text-slate-800 text-lg">Project Settings</h3>
              <p className="text-slate-600 text-sm mt-1">Edit project details</p>
            </div>
            
            <form onSubmit={saveSettings} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/30 text-sm glass text-slate-900 backdrop-blur-xl focus:ring-2 focus:ring-indigo-400/50 outline-none"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Project Type</label>
                <select
                  value={settingsType}
                  onChange={(e) => setSettingsType(e.target.value as ProjectType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/30 text-sm glass text-slate-900 backdrop-blur-xl focus:ring-2 focus:ring-indigo-400/50 outline-none"
                >
                  {Object.values(ProjectType).map(type => (
                    <option key={type} value={type}>{PROJECT_TYPE_LABELS[type]}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Country (for Tax/Legal advice)</label>
                <select
                  value={settingsCountry}
                  onChange={(e) => setSettingsCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/30 text-sm glass text-slate-900 backdrop-blur-xl focus:ring-2 focus:ring-indigo-400/50 outline-none"
                >
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSettings}
                  className="flex-1 px-4 py-2.5 glass border border-white/30 text-slate-700 text-sm font-medium hover:bg-white/30 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!settingsName.trim()}
                  className="flex-1 px-4 py-2.5 glass border border-indigo-400/50 bg-indigo-600/60 text-white text-sm font-medium rounded-xl hover:bg-indigo-600/80 disabled:opacity-50 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;