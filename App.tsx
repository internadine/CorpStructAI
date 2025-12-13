import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OrgChart from './components/OrgChart';
import CompanyEditor from './components/CompanyEditor';
import AIAssistant from './components/AIAssistant';
import ChatInterface from './components/ChatInterface';
import ProjectManager from './components/ProjectManager';
import { Company, Person, StructureData, CompanyType, Project } from './types';

// Initial Demo Data (German)
const INITIAL_DATA: StructureData = {
  companies: [
    { id: '1', name: 'Global Invest Holding', type: CompanyType.HOLDING, parentIds: [] },
    { id: '2', name: 'Tech Solutions GmbH', type: CompanyType.GMBH, parentIds: ['1'] },
    { id: '3', name: 'Immobilien Verwaltung KG', type: CompanyType.KG, parentIds: ['1'] },
    { id: '4', name: 'Innovations UG', type: CompanyType.UG, parentIds: ['2'] },
  ],
  people: [
    { id: 'p1', name: 'Dr. Alice Müller', role: 'GF', companyId: '1' },
    { id: 'p2', name: 'Bob Schmidt', role: 'CTO', companyId: '2' },
    { id: 'p3', name: 'Charlie Tag', role: 'Verwalter', companyId: '3' },
  ]
};

const INITIAL_PROJECT: Project = {
  id: 'default',
  name: 'Beispiel Struktur',
  lastModified: Date.now(),
  data: INITIAL_DATA
};

const App: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Load / Init Logic
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('corpStructProjects');
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        setProjects(parsed);
        if (parsed.length > 0) {
          setActiveProjectId(parsed[0].id);
        } else {
          // Initialize if array empty
          setProjects([INITIAL_PROJECT]);
          setActiveProjectId(INITIAL_PROJECT.id);
        }
      } else {
        // Migration Check: Do we have old single-file data?
        const oldData = localStorage.getItem('corpStructData');
        if (oldData) {
          const parsedOld = JSON.parse(oldData);
          const migratedProject: Project = {
            id: crypto.randomUUID(),
            name: 'Importierte Struktur',
            lastModified: Date.now(),
            data: parsedOld
          };
          setProjects([migratedProject]);
          setActiveProjectId(migratedProject.id);
          localStorage.removeItem('corpStructData'); // Cleanup
        } else {
          // Fresh start
          setProjects([INITIAL_PROJECT]);
          setActiveProjectId(INITIAL_PROJECT.id);
        }
      }
    } catch (e) {
      console.error("Fehler beim Laden der Daten", e);
      setProjects([INITIAL_PROJECT]);
      setActiveProjectId(INITIAL_PROJECT.id);
    }
  }, []);

  // Auto-Save Effect
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('corpStructProjects', JSON.stringify(projects));
    }
  }, [projects]);

  // Derived Active Data
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || INITIAL_PROJECT;
  const data = activeProject.data;

  // -- Data Modification Helpers --
  
  const updateActiveProjectData = (newData: StructureData) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId 
        ? { ...p, data: newData, lastModified: Date.now() } 
        : p
    ));
  };

  const handleStructureGenerated = (newData: StructureData) => {
    updateActiveProjectData(newData);
  };

  const handleAddCompany = () => {
    const newCompany: Company = {
      id: crypto.randomUUID(),
      name: 'Neue Firma',
      type: CompanyType.GMBH,
      parentIds: []
    };
    const newData = { ...data, companies: [...data.companies, newCompany] };
    updateActiveProjectData(newData);
    setEditingCompany(newCompany);
  };

  const handleSaveCompany = (updatedCompany: Company, updatedPeople: Person[]) => {
    // Update Company
    const companies = data.companies.map(c => c.id === updatedCompany.id ? updatedCompany : c);
    // Update People
    const otherPeople = data.people.filter(p => p.companyId !== updatedCompany.id);
    const newData = {
      companies,
      people: [...otherPeople, ...updatedPeople]
    };
    updateActiveProjectData(newData);
  };

  // Helper to find all descendants recursively using BFS to avoid recursion stack overflow and handle cycles
  const getDescendants = (startId: string, allCompanies: Company[]): string[] => {
    const descendants = new Set<string>();
    const queue = [startId];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      // Find children safely (handle potential missing parentIds)
      const children = allCompanies.filter(c => c.parentIds?.includes(currentId));
      
      for (const child of children) {
        if (!descendants.has(child.id)) {
            descendants.add(child.id);
            queue.push(child.id);
        }
      }
    }
    return Array.from(descendants);
  };

  const handleDeleteCompany = (id: string) => {
    if (!window.confirm("Sind Sie sicher? Dies löscht die Firma und ALLE untergeordneten Firmen (rekursiv).")) return;
    
    // 1. Identify all nodes to delete (target + recursive children)
    const descendants = getDescendants(id, data.companies);
    const idsToDelete = [id, ...descendants];

    // 2. Filter companies
    const companies = data.companies
      .filter(c => !idsToDelete.includes(c.id)) // Remove deleted companies
      .map(c => ({
        ...c,
        // Remove deleted companies from parentIds of survivors (e.g. if a survivor had multiple parents, one of which was deleted)
        parentIds: c.parentIds ? c.parentIds.filter(pid => !idsToDelete.includes(pid)) : []
      }));
    
    // 3. Filter people
    const people = data.people.filter(p => !idsToDelete.includes(p.companyId));
    
    updateActiveProjectData({ companies, people });
    setEditingCompany(null);
  };

  const handleClear = () => {
    if (!window.confirm("Wirklich alles leeren?")) return;
    updateActiveProjectData({ companies: [], people: [] });
  };

  // -- Project Management Handlers --

  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: name,
      lastModified: Date.now(),
      data: { companies: [], people: [] }
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setIsProjectManagerOpen(false);
  };

  const handleDuplicateProject = (id: string) => {
    const original = projects.find(p => p.id === id);
    if (!original) return;
    
    const copy: Project = {
      ...original,
      id: crypto.randomUUID(),
      name: `${original.name} (Kopie)`,
      lastModified: Date.now()
    };
    setProjects(prev => [...prev, copy]);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert("Das letzte Projekt kann nicht gelöscht werden.");
      return;
    }
    if (!window.confirm("Projekt wirklich löschen?")) return;
    
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    if (activeProjectId === id) {
      setActiveProjectId(newProjects[0].id);
    }
  };

  const handleRenameProject = (name: string) => {
    // Renames ACTIVE project
    handleRenameProjectById(activeProjectId, name);
  };

  const handleRenameProjectById = (id: string, name: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { ...p, name: name, lastModified: Date.now() } 
        : p
    ));
  };

  // -- Export / Import Handlers (Single Project context) --

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeProject.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result) as StructureData;
        
        if (Array.isArray(parsed.companies) && Array.isArray(parsed.people)) {
          // Import into CURRENT project
          if(window.confirm("Dies überschreibt das aktuelle Projekt. Fortfahren?")) {
             updateActiveProjectData(parsed);
          }
        } else {
          throw new Error("Ungültiges JSON-Format");
        }
      } catch (err) {
        alert('Fehler beim Importieren: ' + err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans">
      {/* Sidebar Panel */}
      <div className="flex flex-col border-r border-slate-200 bg-white h-full relative z-20 w-96 shrink-0 shadow-lg">
        <Sidebar 
          currentProjectName={activeProject.name}
          companies={data.companies} 
          people={data.people}
          onAddCompany={handleAddCompany}
          onSelectCompany={setEditingCompany}
          onClear={handleClear}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          onOpenProjectManager={() => setIsProjectManagerOpen(true)}
          onRenameProject={handleRenameProject}
        />
        <div className="p-4 bg-slate-50 border-t border-slate-200">
           <AIAssistant 
             currentData={data} 
             onStructureGenerated={handleStructureGenerated}
             isApiKeyAvailable={!!process.env.API_KEY}
           />
        </div>
      </div>

      {/* Main Visual Canvas */}
      <main className="flex-1 relative overflow-hidden bg-slate-100 p-4">
        <OrgChart 
          companies={data.companies} 
          people={data.people}
          onNodeClick={setEditingCompany}
        />
      </main>

      {/* Overlays */}
      {editingCompany && (
        <CompanyEditor
          company={editingCompany}
          allCompanies={data.companies}
          people={data.people.filter(p => p.companyId === editingCompany.id)}
          onSave={handleSaveCompany}
          onDelete={handleDeleteCompany}
          onClose={() => setEditingCompany(null)}
        />
      )}

      <ChatInterface 
        structureData={data}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {isProjectManagerOpen && (
        <ProjectManager 
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => { setActiveProjectId(id); setIsProjectManagerOpen(false); }}
          onCreateProject={handleCreateProject}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProjectById}
          onClose={() => setIsProjectManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;