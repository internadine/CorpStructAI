import React, { useState, useEffect } from 'react';
import { Company, CompanyType, Person, CompanyResource, ProjectType, getNodeTypesForProjectType } from '../types';

interface CompanyEditorProps {
  company: Company;
  allCompanies: Company[];
  people: Person[];
  onSave: (company: Company, people: Person[]) => void;
  onDelete: (companyId: string) => void;
  onClose: () => void;
  projectType?: ProjectType;
}

const getLabelsForProjectType = (projectType?: ProjectType) => {
  const labels = {
    entityName: 'Company Name',
    entityType: 'Legal Form',
    personLabel: 'Key Personnel',
    personName: 'Name',
    personRole: 'Role (e.g. CEO)',
    businessPurpose: 'Business Purpose',
    resources: 'Company Resources (Buildings, etc.)',
    parentLabel: 'Parent Companies'
  };

  if (!projectType || projectType === ProjectType.CORPORATE_STRUCTURE) {
    return labels;
  }

  const labelMap: Record<ProjectType, Partial<typeof labels>> = {
    [ProjectType.TEAM_STRUCTURE]: {
      entityName: 'Team Name',
      entityType: 'Team Type',
      personLabel: 'Team Members',
      personName: 'Name',
      personRole: 'Role (e.g. Team Lead)',
      businessPurpose: 'Team Purpose/Goals',
      resources: 'Team Resources',
      parentLabel: 'Parent Teams/Departments'
    },
    [ProjectType.M_A_SCENARIOS]: {
      entityName: 'Company Name',
      entityType: 'Legal Form',
      personLabel: 'Key Personnel',
      businessPurpose: 'Business Purpose',
      parentLabel: 'Acquirer/Parent Companies'
    },
    [ProjectType.STARTUP_EQUITY]: {
      entityName: 'Company Name',
      personLabel: 'Founders/Investors',
      personRole: 'Role (e.g. Founder, Investor)',
      businessPurpose: 'Business Purpose',
      parentLabel: 'Ownership'
    },
    [ProjectType.FAMILY_BUSINESS]: {
      entityName: 'Company Name',
      personLabel: 'Family Members',
      personRole: 'Role (e.g. MD, Successor)',
      businessPurpose: 'Business Purpose',
      parentLabel: 'Parent Structures'
    },
    [ProjectType.COMPLIANCE_GOVERNANCE]: {
      entityName: 'Organizational Unit',
      personLabel: 'Key Personnel',
      personRole: 'Role (e.g. Board, Compliance Officer)',
      businessPurpose: 'Purpose/Function',
      parentLabel: 'Parent Units'
    },
    [ProjectType.INTERNATIONAL_STRUCTURE]: {
      entityName: 'Company Name',
      personLabel: 'Key Personnel',
      businessPurpose: 'Business Purpose',
      parentLabel: 'Parent Companies'
    },
    [ProjectType.PARTNERSHIP_JV]: {
      entityName: 'Partnership/JV Name',
      personLabel: 'Partners',
      personRole: 'Role (e.g. Partner, JV Manager)',
      businessPurpose: 'Partnership Purpose',
      parentLabel: 'Participating Partners'
    },
    [ProjectType.INVESTMENT_FUND]: {
      entityName: 'Fund/Company Name',
      personLabel: 'Key Personnel',
      personRole: 'Role (e.g. GP, LP, Portfolio Manager)',
      businessPurpose: 'Investment Strategy',
      parentLabel: 'Parent Structures'
    },
    [ProjectType.NONPROFIT]: {
      entityName: 'Organization Name',
      personLabel: 'Key Personnel',
      personRole: 'Role (e.g. Board, Program Director)',
      businessPurpose: 'Organization Purpose',
      parentLabel: 'Parent Organizations'
    },
    [ProjectType.REAL_ESTATE]: {
      entityName: 'Real Estate Company',
      personLabel: 'Key Personnel',
      personRole: 'Role (e.g. Manager, Asset Manager)',
      businessPurpose: 'Real Estate Portfolio',
      parentLabel: 'Parent Structures'
    },
    [ProjectType.PRINCE2_PROJECT]: {
      entityName: 'Work Package/Product Name',
      entityType: 'Type (Work Package, Product, Stage)',
      personLabel: 'Team Members',
      personName: 'Name',
      personRole: 'Role (e.g. Project Manager, Team Manager)',
      businessPurpose: 'Purpose/Description',
      resources: 'Resources',
      parentLabel: 'Parent Work Packages/Stages'
    },
    [ProjectType.PSMI_PROJECT]: {
      entityName: 'Work Package/Deliverable Name',
      entityType: 'Type (Work Package, Deliverable, Milestone)',
      personLabel: 'Team Members',
      personName: 'Name',
      personRole: 'Role (e.g. Project Manager, Team Lead)',
      businessPurpose: 'Purpose/Description',
      resources: 'Resources',
      parentLabel: 'Parent Work Packages/Phases'
    },
    [ProjectType.CORPORATE_STRUCTURE]: labels
  };

  return { ...labels, ...(labelMap[projectType] || {}) };
};

const CompanyEditor: React.FC<CompanyEditorProps> = ({ company, allCompanies, people, onSave, onDelete, onClose, projectType }) => {
  const [formData, setFormData] = useState<Company>({ ...company });
  const [localPeople, setLocalPeople] = useState<Person[]>(people);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('');
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState('');
  const [newResourceValue, setNewResourceValue] = useState('');
  
  const labels = getLabelsForProjectType(projectType);
  const availableTypes = getNodeTypesForProjectType(projectType);

  useEffect(() => {
    setFormData({ ...company });
    setLocalPeople(people);
  }, [company, people]);

  const addResource = () => {
    if (newResourceName && newResourceType) {
      const resources = formData.companyResources || [];
      const newResource: CompanyResource = {
        id: crypto.randomUUID(),
        name: newResourceName,
        type: newResourceType,
        value: newResourceValue ? parseFloat(newResourceValue) : undefined
      };
      setFormData({
        ...formData,
        companyResources: [...resources, newResource]
      });
      setNewResourceName('');
      setNewResourceType('');
      setNewResourceValue('');
    }
  };

  const removeResource = (id: string) => {
    const resources = formData.companyResources || [];
    setFormData({
      ...formData,
      companyResources: resources.filter(r => r.id !== id)
    });
  };

  const handleSave = () => {
    onSave(formData, localPeople);
    onClose();
  };

  const addPerson = () => {
    if (newPersonName && newPersonRole) {
      setLocalPeople([...localPeople, {
        id: crypto.randomUUID(),
        name: newPersonName,
        role: newPersonRole,
        companyId: company.id
      }]);
      setNewPersonName('');
      setNewPersonRole('');
    }
  };

  const removePerson = (id: string) => {
    setLocalPeople(localPeople.filter(p => p.id !== id));
  };

  const toggleParent = (parentId: string) => {
    const currentParents = formData.parentIds || [];
    const currentOwnership = formData.parentOwnership || {};
    
    if (currentParents.includes(parentId)) {
      // Remove parent and its ownership percentage
      const newOwnership = { ...currentOwnership };
      delete newOwnership[parentId];
      setFormData({
        ...formData,
        parentIds: currentParents.filter(id => id !== parentId),
        parentOwnership: newOwnership
      });
    } else {
      // Add parent with default 100% ownership (if it's the only parent) or 0%
      const newOwnership = { ...currentOwnership };
      if (currentParents.length === 0) {
        newOwnership[parentId] = 100;
      } else {
        newOwnership[parentId] = 0;
      }
      setFormData({
        ...formData,
        parentIds: [...currentParents, parentId],
        parentOwnership: newOwnership
      });
    }
  };

  const updateOwnershipPercentage = (parentId: string, percentage: number) => {
    const currentOwnership = formData.parentOwnership || {};
    setFormData({
      ...formData,
      parentOwnership: {
        ...currentOwnership,
        [parentId]: Math.max(0, Math.min(100, percentage))
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/40">
        <div className="p-5 border-b border-white/20 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-lg">Edit {labels.entityName}</h2>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* General Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">{labels.entityName}</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 glass border border-white/30 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-white/50 outline-none backdrop-blur-xl"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">{labels.entityType}</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 glass border border-white/30 text-slate-900 rounded-xl text-sm backdrop-blur-xl"
              >
                {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">Node Color (optional)</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={formData.color || '#2563eb'}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10 rounded border border-slate-300 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={formData.color || ''}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#2563eb"
                  className="flex-1 p-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {formData.color && (
                  <button 
                    onClick={() => setFormData({ ...formData, color: undefined })}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded text-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-700 mt-1">Hex color for node display</p>
            </div>
              
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-2">{labels.parentLabel}</label>
              <div className="glass border border-white/30 rounded-xl p-3 max-h-60 overflow-y-auto space-y-3 backdrop-blur-xl">
                {allCompanies.filter(c => c.id !== formData.id).length === 0 && (
                  <p className="text-xs text-slate-700">No other {labels.plural.toLowerCase()} available.</p>
                )}
                {allCompanies
                  .filter(c => c.id !== formData.id) // Prevent self-parenting
                  .map(c => {
                    const isSelected = formData.parentIds?.includes(c.id);
                    const ownership = formData.parentOwnership?.[c.id] ?? 0;
                    return (
                      <div 
                        key={c.id}
                        className={`rounded-xl border transition-all ${
                          isSelected 
                            ? 'glass-strong border-blue-400/50 bg-blue-500/20' 
                            : 'glass border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div 
                          onClick={() => toggleParent(c.id)}
                          className="flex items-center p-2 cursor-pointer"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 flex-shrink-0 ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                          }`}>
                            {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div className="flex-1 text-sm">
                            <div className="font-medium text-slate-700">{c.name}</div>
                            <div className="text-[10px] text-slate-700">{c.type}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="px-2 pb-2 pt-1 border-t border-blue-200">
                            <label className="block text-[10px] font-medium text-slate-600 mb-1">
                              Ownership Percentage (%)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={ownership}
                                onChange={(e) => updateOwnershipPercentage(c.id, parseFloat(e.target.value) || 0)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0"
                              />
                              <span className="text-xs text-slate-700">%</span>
                              {ownership > 0 && (
                                <span className="text-xs text-emerald-600 font-medium ml-auto">
                                  {ownership.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <p className="text-[10px] text-slate-700 mt-1">Multiple selection possible. Enter ownership percentages.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Business Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">{labels.businessPurpose}</label>
              <textarea 
                value={formData.businessJustification || ''}
                onChange={e => setFormData({ ...formData, businessJustification: e.target.value })}
                placeholder="Description of business purpose..."
                className="w-full p-2.5 glass border border-white/30 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-400/50 outline-none resize-none h-24 backdrop-blur-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">Financial Resources (EUR)</label>
              <input 
                type="number" 
                value={formData.financialResources || ''}
                onChange={e => setFormData({ ...formData, financialResources: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="0"
                min="0"
                step="0.01"
                  className="w-full p-2.5 glass border border-white/30 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-white/50 outline-none backdrop-blur-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase mb-1">Notes for Consultancy</label>
              <textarea 
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes for AI consultancy (e.g. AZAV-certified, 50 employees, ISO 9001 certified, special tax arrangements...)"
                className="w-full p-2.5 glass border border-white/30 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-400/50 outline-none resize-none h-24 backdrop-blur-xl"
              />
              <p className="text-[10px] text-slate-700 mt-1">These notes will be considered by both business and legal consultants when providing advice.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Company Resources Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase mb-3">{labels.resources}</label>
            
            <div className="space-y-2 mb-3">
              {(formData.companyResources || []).map(r => (
                <div key={r.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-700">{r.name}</span>
                    <span className="text-slate-600 mx-1">•</span>
                    <span className="text-slate-700">{r.type}</span>
                    {r.value && (
                      <>
                        <span className="text-slate-600 mx-1">•</span>
                        <span className="text-emerald-600 font-medium">
                          {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: true }).format(r.value)}
                        </span>
                      </>
                    )}
                  </div>
                  <button onClick={() => removeResource(r.id)} className="text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {(formData.companyResources || []).length === 0 && <p className="text-sm text-slate-600 italic">No resources assigned.</p>}
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  placeholder="Name (e.g. Building Berlin)" 
                  value={newResourceName}
                  onChange={e => setNewResourceName(e.target.value)}
                  className="flex-1 p-2 glass border border-white/30 text-slate-900 rounded-lg text-sm outline-none focus:border-white/50 focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
                />
                <input 
                  placeholder="Type (e.g. Building)" 
                  value={newResourceType}
                  onChange={e => setNewResourceType(e.target.value)}
                  className="w-32 p-2 bg-white text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <input 
                  type="number"
                  placeholder="Value (EUR, optional)" 
                  value={newResourceValue}
                  onChange={e => setNewResourceValue(e.target.value)}
                  min="0"
                  step="0.01"
                  className="flex-1 p-2 glass border border-white/30 text-slate-900 rounded-lg text-sm outline-none focus:border-white/50 focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
                />
                <button 
                  onClick={addResource}
                  disabled={!newResourceName || !newResourceType}
                  className="px-3 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* People Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase mb-3">{labels.personLabel}</label>
            
            <div className="space-y-2 mb-3">
              {localPeople.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-700">{p.name}</span>
                    <span className="text-slate-600 mx-1">•</span>
                    <span className="text-slate-700">{p.role}</span>
                  </div>
                  <button onClick={() => removePerson(p.id)} className="text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {localPeople.length === 0 && <p className="text-sm text-slate-600 italic">No people assigned.</p>}
            </div>

            <div className="flex gap-2">
              <input 
                placeholder={labels.personName} 
                value={newPersonName}
                onChange={e => setNewPersonName(e.target.value)}
                className="flex-1 p-2 glass border border-white/30 text-slate-900 rounded-lg text-sm outline-none focus:border-white/50 focus:ring-2 focus:ring-white/30 backdrop-blur-xl"
              />
              <input 
                placeholder={labels.personRole} 
                value={newPersonRole}
                onChange={e => setNewPersonRole(e.target.value)}
                className="w-32 p-2 bg-white text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
              />
              <button 
                onClick={addPerson}
                disabled={!newPersonName || !newPersonRole}
                className="px-3 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-100 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-white/20 flex justify-between">
          <button 
            onClick={() => onDelete(formData.id)}
            className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow-sm hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditor;