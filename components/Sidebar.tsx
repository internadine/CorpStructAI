import React, { useRef, useState, useEffect } from 'react';
import { Company, CompanyType, Person } from '../types';

interface SidebarProps {
  currentProjectName: string;
  companies: Company[];
  people: Person[];
  onAddCompany: () => void;
  onSelectCompany: (c: Company) => void;
  onClear: () => void;
  onToggleChat: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onOpenProjectManager: () => void;
  onRenameProject: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentProjectName,
  companies, 
  people, 
  onAddCompany, 
  onSelectCompany, 
  onClear, 
  onToggleChat,
  onExportJSON,
  onImportJSON,
  onOpenProjectManager,
  onRenameProject
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProjectName);
  
  // Sync if prop changes
  useEffect(() => {
    setTempName(currentProjectName);
  }, [currentProjectName]);

  const handleNameSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tempName.trim()) {
      onRenameProject(tempName);
      setIsEditingName(false);
    }
  };

  const getPeopleCount = (companyId: string) => people.filter(p => p.companyId === companyId).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportJSON(e.target.files[0]);
      e.target.value = ''; // Reset
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Updated Header with Project Context */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">Aktuelles Projekt</p>
            {isEditingName ? (
              <form onSubmit={handleNameSubmit}>
                <input 
                  autoFocus
                  className="w-full bg-white border border-blue-400 rounded px-1 py-0.5 text-sm font-bold text-slate-800 outline-none"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onBlur={() => handleNameSubmit()}
                />
              </form>
            ) : (
              <h1 
                onClick={() => setIsEditingName(true)}
                className="font-bold text-base text-slate-800 truncate cursor-text hover:bg-slate-100 hover:text-blue-700 rounded px-1 -ml-1 transition-colors"
                title="Klicken zum Umbenennen"
              >
                {currentProjectName}
              </h1>
            )}
          </div>
          <button 
            onClick={onOpenProjectManager}
            className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-white hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm"
            title="Projekte verwalten"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gesellschaften</h2>
          <div className="flex gap-2 items-center">
            <button onClick={onClear} className="text-[10px] text-red-400 hover:text-red-600 hover:underline">
              Leeren
            </button>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{companies.length}</span>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-400 text-sm">Noch keine Firmen.</p>
            <p className="text-slate-400 text-xs mt-1">Nutzen Sie die KI oder fügen Sie manuell hinzu.</p>
          </div>
        ) : (
          companies.map(c => (
            <div 
              key={c.id} 
              onClick={() => onSelectCompany(c)}
              className="group p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-sm text-slate-700 group-hover:text-indigo-700">{c.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${c.type.includes('Holding') ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                  <span className="truncate max-w-[120px]">{c.type}</span>
                </div>
              </div>
              <div className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">
                {getPeopleCount(c.id)} <span className="text-[10px]">Pers.</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
        <button 
          onClick={onAddCompany}
          className="w-full py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-sm font-medium shadow-sm transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Firma manuell hinzufügen
        </button>

        <button 
          onClick={onToggleChat}
          className="w-full py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          Steuer- & Rechts-Chat
        </button>

        {/* Data Management Section */}
        <div className="pt-2 border-t border-slate-200 mt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Import / Export</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onExportJSON} className="py-2 px-2 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export JSON
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="py-2 px-2 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import JSON
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
