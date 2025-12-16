import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import OrgChart from '../components/OrgChart';
import CompanyEditor from '../components/CompanyEditor';
import AIAssistant from '../components/AIAssistant';
import ChatInterface from '../components/ChatInterface';
import BusinessConsultantChat from '../components/BusinessConsultantChat';
import ProjectManager from '../components/ProjectManager';
import { SubscriptionGate } from '../components/SubscriptionGate';
import { Link } from 'react-router-dom';
import { Company, Person, StructureData, CompanyType, Project, ProjectType, getDefaultNodeTypeForProjectType, getDefaultNodeNameForProjectType } from '../types';
import { getProjects, saveProjectToStorage, deleteProject } from '../services/projectService';

const Dashboard: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBusinessChatOpen, setIsBusinessChatOpen] = useState(false);
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);

  // Load Projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await getProjects();
        if (loadedProjects.length > 0) {
          setProjects(loadedProjects);
          setActiveProjectId(loadedProjects[0].id);
        } else {
          // No projects exist - start with empty list
          setProjects([]);
          setActiveProjectId('');
        }
      } catch (e) {
        console.error("Error loading projects", e);
        setProjects([]);
        setActiveProjectId('');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Auto-Save Effect
  useEffect(() => {
    if (!loading && projects.length > 0 && activeProjectId) {
      const projectToSave = projects.find(p => p.id === activeProjectId);
      if (projectToSave) {
        // Ensure projectType is set before saving (for backward compatibility)
        const projectWithDefaults: Project = {
          ...projectToSave,
          projectType: projectToSave.projectType || ProjectType.CORPORATE_STRUCTURE
        };
        saveProjectToStorage(projectWithDefaults).catch(e => {
          console.error("Error saving:", e);
        });
      }
    }
  }, [projects, activeProjectId, loading]);

  // Clear editing company when switching projects
  useEffect(() => {
    setEditingCompany(null);
  }, [activeProjectId]);

  // Derived Active Data
  // If no active project, create a temporary empty project for rendering
  const activeProjectRaw = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeProject: Project | null = activeProjectRaw ? {
    ...activeProjectRaw,
    projectType: activeProjectRaw.projectType || ProjectType.CORPORATE_STRUCTURE
  } : null;
  const data: StructureData = activeProject?.data || { companies: [], people: [] };

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
    if (!activeProject) return;
    
    const projectType = activeProject.projectType || ProjectType.CORPORATE_STRUCTURE;
    const defaultType = getDefaultNodeTypeForProjectType(projectType);
    const defaultName = getDefaultNodeNameForProjectType(projectType);
    
    const newCompany: Company = {
      id: crypto.randomUUID(),
      name: defaultName,
      type: defaultType,
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

  // Helper to find all descendants recursively using BFS
  const getDescendants = (startId: string, allCompanies: Company[]): string[] => {
    const descendants = new Set<string>();
    const queue = [startId];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
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
    
    const descendants = getDescendants(id, data.companies);
    const idsToDelete = [id, ...descendants];

    const companies = data.companies
      .filter(c => !idsToDelete.includes(c.id))
      .map(c => ({
        ...c,
        parentIds: c.parentIds ? c.parentIds.filter(pid => !idsToDelete.includes(pid)) : []
      }));
    
    const people = data.people.filter(p => !idsToDelete.includes(p.companyId));
    
    updateActiveProjectData({ companies, people });
    setEditingCompany(null);
  };

  const handleClear = () => {
    if (!window.confirm("Wirklich alles leeren?")) return;
    updateActiveProjectData({ companies: [], people: [] });
  };

  // -- Project Management Handlers --

  const handleCreateProject = (name: string, projectType?: ProjectType, country?: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: name,
      lastModified: Date.now(),
      data: { companies: [], people: [] },
      projectType: projectType || ProjectType.CORPORATE_STRUCTURE,
      country: country
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setIsProjectManagerOpen(false);
  };

  const handleDuplicateProject = (id: string) => {
    const original = projects.find(p => p.id === id);
    if (!original) return;
    
    const companyIdMap = new Map<string, string>();
    
    const newCompanies = original.data.companies.map(company => {
      const newId = crypto.randomUUID();
      companyIdMap.set(company.id, newId);
      return {
        ...company,
        id: newId,
        parentIds: company.parentIds.map(parentId => {
          const newParentId = companyIdMap.get(parentId);
          return newParentId || parentId;
        }),
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
      },
      projectType: original.projectType || ProjectType.CORPORATE_STRUCTURE,
      country: original.country
    };
    setProjects(prev => [...prev, copy]);
  };

  const handleDeleteProject = async (id: string) => {
    if (projects.length <= 1) {
      alert("Das letzte Projekt kann nicht gelöscht werden.");
      return;
    }
    if (!window.confirm("Really delete project?")) return;
    
    try {
      await deleteProject(id);
      const newProjects = projects.filter(p => p.id !== id);
      setProjects(newProjects);
      if (activeProjectId === id) {
        setActiveProjectId(newProjects[0].id);
      }
    } catch (e) {
      console.error("Error deleting:", e);
      alert("Error deleting project");
    }
  };

  const handleRenameProject = (name: string) => {
    handleRenameProjectById(activeProjectId, name);
  };

  const handleRenameProjectById = (id: string, name: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { ...p, name: name, lastModified: Date.now() } 
        : p
    ));
  };

  const handleUpdateProject = (id: string, updates: { name?: string; projectType?: ProjectType; country?: string }) => {
    setProjects(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            name: updates.name ?? p.name,
            projectType: updates.projectType ?? p.projectType,
            country: updates.country,
            lastModified: Date.now() 
          } 
        : p
    ));
  };

  // -- Export / Import Handlers --

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
          if(window.confirm("Dies überschreibt das aktuelle Projekt. Fortfahren?")) {
             updateActiveProjectData(parsed);
          }
        } else {
          throw new Error("Ungültiges JSON-Format");
        }
      } catch (err) {
        alert('Error importing: ' + err);
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

      const canvas = await html2canvas(orgChartElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f1f5f9'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text('Detaillierte Strukturinformationen', 20, 20);
      
      let yPos = 30;
      const pageHeight = 210;
      const margin = 20;
      const lineHeight = 8;

      data.companies.forEach((company, index) => {
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

        yPos += lineHeight;
      });

      pdf.save(`${activeProject.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Error creating PDF: ' + error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // If no projects exist, show empty state
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Projects Yet</h2>
          <p className="text-slate-600 mb-6">Create your first project to get started.</p>
          <button
            onClick={() => setIsProjectManagerOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Create Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans">
      {/* Sidebar Panel */}
      <div className="flex flex-col glass-strong h-full relative z-20 w-96 shrink-0 shadow-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Sidebar 
            currentProjectName={activeProject?.name || ''}
            companies={data.companies} 
            people={data.people}
            projectType={activeProject?.projectType}
            onAddCompany={handleAddCompany}
            onSelectCompany={setEditingCompany}
            onClear={handleClear}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onToggleBusinessChat={() => setIsBusinessChatOpen(!isBusinessChatOpen)}
            onToggleArchitect={() => setIsArchitectOpen(!isArchitectOpen)}
            onExportJSON={handleExportJSON}
            onExportPDF={handleExportPDF}
            onImportJSON={handleImportJSON}
            onOpenProjectManager={() => setIsProjectManagerOpen(true)}
            onRenameProject={handleRenameProject}
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
      {editingCompany && activeProject && (
        <CompanyEditor
          company={editingCompany}
          allCompanies={data.companies}
          people={data.people.filter(p => p.companyId === editingCompany.id)}
          onSave={handleSaveCompany}
          projectType={activeProject.projectType}
          onDelete={handleDeleteCompany}
          onClose={() => setEditingCompany(null)}
        />
      )}

      {isChatOpen && (
        <SubscriptionGate
          fallback={
            <div className="fixed bottom-4 right-4 glass-strong rounded-3xl shadow-2xl border border-white/40 p-6 max-w-md z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">Premium Feature</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-700 mb-4">
                Diese Funktion ist nur für Abonnenten verfügbar. Bitte upgraden Sie Ihren Plan, um auf die AI-Beratung zuzugreifen.
              </p>
              <Link
                to="/pricing"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Jetzt upgraden
              </Link>
            </div>
          }
        >
          <ChatInterface 
            structureData={data}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            country={activeProject?.country}
            projectId={activeProjectId}
          />
        </SubscriptionGate>
      )}

      {isBusinessChatOpen && (
        <SubscriptionGate
          fallback={
            <div className="fixed bottom-4 right-4 glass-strong rounded-3xl shadow-2xl border border-white/40 p-6 max-w-md z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">Premium Feature</h3>
                <button
                  onClick={() => setIsBusinessChatOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-slate-700 mb-4">
                Diese Funktion ist nur für Abonnenten verfügbar. Bitte upgraden Sie Ihren Plan, um auf die AI-Beratung zuzugreifen.
              </p>
              <Link
                to="/pricing"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Jetzt upgraden
              </Link>
            </div>
          }
        >
          <BusinessConsultantChat
            structureData={data}
            isOpen={isBusinessChatOpen}
            onClose={() => setIsBusinessChatOpen(false)}
            projectType={activeProject?.projectType}
            country={activeProject?.country}
            projectId={activeProjectId}
          />
        </SubscriptionGate>
      )}

      {isProjectManagerOpen && (
        <ProjectManager 
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => { 
            setActiveProjectId(id); 
            setIsProjectManagerOpen(false); 
          }}
          onCreateProject={handleCreateProject}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProjectById}
          onUpdateProject={handleUpdateProject}
          onClose={() => setIsProjectManagerOpen(false)}
        />
      )}

      {isArchitectOpen && (
        <AIAssistant 
          currentData={data} 
          onStructureGenerated={handleStructureGenerated}
          isApiKeyAvailable={true}
          projectType={activeProject?.projectType}
          isOpen={isArchitectOpen}
          onClose={() => setIsArchitectOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;

