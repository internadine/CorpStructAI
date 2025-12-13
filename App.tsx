import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OrgChart from './components/OrgChart';
import CompanyEditor from './components/CompanyEditor';
import AIAssistant from './components/AIAssistant';
import ChatInterface from './components/ChatInterface';
import BusinessConsultantChat from './components/BusinessConsultantChat';
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
  const [isBusinessChatOpen, setIsBusinessChatOpen] = useState(false);

  // Load / Init Logic
  useEffect(() => {
    try {
      // Check for new OrgPhant data first
      const storedProjects = localStorage.getItem('orgphantProjects');
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
        // Migration: Check for old CorpStruct data
        const oldProjects = localStorage.getItem('corpStructProjects');
        if (oldProjects) {
          const parsed = JSON.parse(oldProjects);
          setProjects(parsed);
          if (parsed.length > 0) {
            setActiveProjectId(parsed[0].id);
          } else {
            setProjects([INITIAL_PROJECT]);
            setActiveProjectId(INITIAL_PROJECT.id);
          }
          // Migrate to new key
          localStorage.setItem('orgphantProjects', oldProjects);
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
      localStorage.setItem('orgphantProjects', JSON.stringify(projects));
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

  const handleNodePositionUpdate = (companyId: string, position: { x: number; y: number }) => {
    const companies = data.companies.map(c => 
      c.id === companyId 
        ? { ...c, customPosition: position }
        : c
    );
    updateActiveProjectData({ ...data, companies });
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
    
    // Deep copy with new IDs for all companies and people
    const companyIdMap = new Map<string, string>(); // old ID -> new ID
    
    const newCompanies = original.data.companies.map(company => {
      const newId = crypto.randomUUID();
      companyIdMap.set(company.id, newId);
      return {
        ...company,
        id: newId,
        // Update parentIds to use new company IDs
        parentIds: company.parentIds.map(parentId => {
          // Find the new ID for this parent, or keep original if not found (shouldn't happen)
          const newParentId = companyIdMap.get(parentId);
          return newParentId || parentId;
        }),
        // Update parentOwnership keys to use new company IDs
        parentOwnership: company.parentOwnership ? 
          Object.fromEntries(
            Object.entries(company.parentOwnership).map(([parentId, percentage]) => {
              const newParentId = companyIdMap.get(parentId);
              return [newParentId || parentId, percentage];
            })
          ) : undefined
      };
    });
    
    const newPeople = original.data.people.map(person => {
      const newCompanyId = companyIdMap.get(person.companyId);
      return {
        ...person,
        id: crypto.randomUUID(),
        companyId: newCompanyId || person.companyId
      };
    });
    
    const copy: Project = {
      id: crypto.randomUUID(),
      name: `${original.name} (Kopie)`,
      lastModified: Date.now(),
      data: {
        companies: newCompanies,
        people: newPeople
      }
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

  const handleExportPDF = async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const orgChartElement = document.querySelector('.OrgChart') || 
                              document.querySelector('main');
      
      if (!orgChartElement) {
        alert('Org Chart nicht gefunden');
        return;
      }

      // Capture the org chart
      const canvas = await html2canvas(orgChartElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f1f5f9'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add org chart image
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Add a second page with detailed company information
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Detaillierte Unternehmensinformationen', 20, 20);
      
      let yPos = 30;
      const pageHeight = 210; // A4 landscape height in mm
      const margin = 20;
      const lineHeight = 8;

      data.companies.forEach((company, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${index + 1}. ${company.name}`, margin, yPos);
        yPos += lineHeight;

        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        pdf.text(`Rechtsform: ${company.type}`, margin, yPos);
        yPos += lineHeight;

        if (company.businessJustification) {
          const justification = pdf.splitTextToSize(
            `Unternehmensgegenstand: ${company.businessJustification}`,
            imgWidth - 2 * margin
          );
          pdf.text(justification, margin, yPos);
          yPos += justification.length * lineHeight;
        }

        if (company.financialResources) {
          const formatted = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
          }).format(company.financialResources);
          pdf.text(`Finanzielle Ressourcen: ${formatted}`, margin, yPos);
          yPos += lineHeight;
        }

        if (company.companyResources && company.companyResources.length > 0) {
          pdf.text('Unternehmensressourcen:', margin, yPos);
          yPos += lineHeight;
          company.companyResources.forEach(resource => {
            let resourceText = `  • ${resource.name} (${resource.type})`;
            if (resource.value) {
              const formatted = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true
              }).format(resource.value);
              resourceText += ` - ${formatted}`;
            }
            const resourceLines = pdf.splitTextToSize(resourceText, imgWidth - 2 * margin);
            pdf.text(resourceLines, margin, yPos);
            yPos += resourceLines.length * lineHeight;
          });
        }

        const companyPeople = data.people.filter(p => p.companyId === company.id);
        if (companyPeople.length > 0) {
          pdf.text('Schlüsselpersonal:', margin, yPos);
          yPos += lineHeight;
          companyPeople.forEach(person => {
            pdf.text(`  • ${person.name} - ${person.role}`, margin, yPos);
            yPos += lineHeight;
          });
        }

        yPos += lineHeight; // Space between companies
      });

      // Save the PDF
      pdf.save(`${activeProject.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('PDF Export Fehler:', error);
      alert('Fehler beim Erstellen der PDF: ' + error);
    }
  };

  return (
    <div className="flex h-screen w-full font-sans">
      {/* Sidebar Panel */}
      <div className="flex flex-col glass-strong h-full relative z-20 w-96 shrink-0 shadow-2xl">
        <Sidebar 
          currentProjectName={activeProject.name}
          companies={data.companies} 
          people={data.people}
          onAddCompany={handleAddCompany}
          onSelectCompany={setEditingCompany}
          onClear={handleClear}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleBusinessChat={() => setIsBusinessChatOpen(!isBusinessChatOpen)}
          onExportJSON={handleExportJSON}
          onExportPDF={handleExportPDF}
          onImportJSON={handleImportJSON}
          onOpenProjectManager={() => setIsProjectManagerOpen(true)}
          onRenameProject={handleRenameProject}
        />
        <div className="p-4 border-t border-white/20">
           <AIAssistant 
             currentData={data} 
             onStructureGenerated={handleStructureGenerated}
             isApiKeyAvailable={!!(process.env?.API_KEY || process.env?.GEMINI_API_KEY || (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || (typeof import.meta !== 'undefined' && (import.meta as any).env?.GEMINI_API_KEY))}
           />
        </div>
      </div>

      {/* Main Visual Canvas */}
      <main className="flex-1 relative overflow-hidden p-4">
        <OrgChart 
          companies={data.companies} 
          people={data.people}
          onNodeClick={setEditingCompany}
          onNodePositionUpdate={handleNodePositionUpdate}
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

      <BusinessConsultantChat 
        structureData={data}
        isOpen={isBusinessChatOpen}
        onClose={() => setIsBusinessChatOpen(false)}
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