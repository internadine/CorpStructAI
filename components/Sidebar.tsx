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
  onToggleBusinessChat: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
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
  onToggleBusinessChat,
  onExportJSON,
  onExportPDF,
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
    <div className="w-full h-full flex flex-col">
      {/* Updated Header with Project Context */}
      <div className="p-4 border-b border-white/20 flex flex-col gap-3">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4 pb-4 border-b border-white/20">
          <img 
            src="/orgphant-logo.png" 
            alt="OrgPhant Logo" 
            className="h-24 w-auto object-contain drop-shadow-2xl"
          />
        </div>
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-2">
            <p className="text-[10px] uppercase font-bold text-slate-700 mb-0.5 tracking-wider">Aktuelles Projekt</p>
            {isEditingName ? (
              <form onSubmit={handleNameSubmit}>
                <input 
                  autoFocus
                  className="w-full glass border border-white/30 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-white/50"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onBlur={() => handleNameSubmit()}
                />
              </form>
            ) : (
              <h1 
                onClick={() => setIsEditingName(true)}
                className="font-bold text-base text-slate-800 truncate cursor-text hover:bg-white/20 hover:text-blue-600 rounded-lg px-2 py-1 -ml-2 transition-all"
                title="Klicken zum Umbenennen"
              >
                {currentProjectName}
              </h1>
            )}
          </div>
          <button 
            onClick={onOpenProjectManager}
            className="p-2 glass border border-white/30 text-slate-700 rounded-lg hover:bg-white/30 hover:text-indigo-600 transition-all shadow-sm"
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
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gesellschaften</h2>
          <div className="flex gap-2 items-center">
            <button onClick={onClear} className="text-[10px] text-red-500 hover:text-red-700 hover:underline font-medium">
              Leeren
            </button>
            <span className="text-xs glass border border-white/20 px-2 py-0.5 rounded-full text-slate-800 font-semibold">{companies.length}</span>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-white/30 rounded-xl glass">
            <p className="text-slate-700 text-sm font-medium">Noch keine Firmen.</p>
            <p className="text-slate-600 text-xs mt-1">Nutzen Sie die KI oder fügen Sie manuell hinzu.</p>
          </div>
        ) : (
          companies.map(c => (
            <div 
              key={c.id} 
              onClick={() => onSelectCompany(c)}
              className="group p-3 rounded-xl glass border border-white/30 hover:border-white/50 hover:bg-white/30 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="font-semibold text-sm text-slate-800 group-hover:text-indigo-700">{c.name}</div>
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${c.type.includes('Holding') ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                  <span className="truncate max-w-[120px]">{c.type}</span>
                </div>
              </div>
              <div className="text-xs glass border border-white/20 text-slate-700 px-2 py-1 rounded-lg font-medium">
                {getPeopleCount(c.id)} <span className="text-[10px]">Pers.</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/20 space-y-3">
        <button 
          onClick={onAddCompany}
          className="w-full py-2.5 glass border border-white/30 hover:border-white/50 text-slate-800 rounded-xl text-sm font-medium shadow-sm transition-all hover:bg-white/30 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Firma manuell hinzufügen
        </button>

        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={onToggleChat}
            className="w-full py-2.5 glass border border-indigo-300/50 hover:border-indigo-400/70 text-indigo-800 rounded-xl text-sm font-medium shadow-sm transition-all hover:bg-indigo-500/20 flex items-center justify-center gap-2 backdrop-blur-xl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            Steuer- & Rechts-Chat
          </button>
          
          <button 
            onClick={onToggleBusinessChat}
            className="w-full py-2.5 glass border border-emerald-300/50 hover:border-emerald-400/70 text-emerald-800 rounded-xl text-sm font-medium shadow-sm transition-all hover:bg-emerald-500/20 flex items-center justify-center gap-2 backdrop-blur-xl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Business-Berater
          </button>
        </div>

        {/* Data Management Section */}
        <div className="pt-2 border-t border-white/20 mt-2">
          <p className="text-[10px] font-bold text-slate-700 uppercase mb-2">Import / Export</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onExportPDF} className="py-2 px-2 glass border border-white/30 rounded-lg text-xs text-slate-700 hover:bg-white/30 flex items-center justify-center gap-2 shadow-sm transition-all">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Export PDF
            </button>
            <button onClick={onExportJSON} className="py-2 px-2 glass border border-white/30 rounded-lg text-xs text-slate-700 hover:bg-white/30 flex items-center justify-center gap-2 shadow-sm transition-all">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export JSON
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="py-2 px-2 glass border border-white/30 rounded-lg text-xs text-slate-700 hover:bg-white/30 flex items-center justify-center gap-2 shadow-sm col-span-2 transition-all">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
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
