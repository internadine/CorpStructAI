import React, { useState, useEffect } from 'react';
import { Company, CompanyType, Person } from '../types';

interface CompanyEditorProps {
  company: Company;
  allCompanies: Company[];
  people: Person[];
  onSave: (company: Company, people: Person[]) => void;
  onDelete: (companyId: string) => void;
  onClose: () => void;
}

const CompanyEditor: React.FC<CompanyEditorProps> = ({ company, allCompanies, people, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Company>({ ...company });
  const [localPeople, setLocalPeople] = useState<Person[]>(people);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('');

  useEffect(() => {
    setFormData({ ...company });
    setLocalPeople(people);
  }, [company, people]);

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
    if (currentParents.includes(parentId)) {
      setFormData({
        ...formData,
        parentIds: currentParents.filter(id => id !== parentId)
      });
    } else {
      setFormData({
        ...formData,
        parentIds: [...currentParents, parentId]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-800 text-lg">Einheit bearbeiten</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* General Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Firmenname</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rechtsform</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as CompanyType })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm"
              >
                {Object.values(CompanyType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
              
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Muttergesellschaften (Holdings)</label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                {allCompanies.filter(c => c.id !== formData.id).length === 0 && (
                  <p className="text-xs text-slate-400">Keine anderen Firmen verfügbar.</p>
                )}
                {allCompanies
                  .filter(c => c.id !== formData.id) // Prevent self-parenting
                  .map(c => {
                    const isSelected = formData.parentIds?.includes(c.id);
                    return (
                      <div 
                        key={c.id} 
                        onClick={() => toggleParent(c.id)}
                        className={`flex items-center p-2 rounded cursor-pointer border transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-transparent hover:bg-slate-100'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                        }`}>
                          {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-slate-700">{c.name}</div>
                          <div className="text-[10px] text-slate-400">{c.type}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Mehrfachauswahl möglich für Holdings.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* People Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">Schlüsselpersonal</label>
            
            <div className="space-y-2 mb-3">
              {localPeople.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                  <div className="text-sm">
                    <span className="font-semibold text-slate-700">{p.name}</span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span className="text-slate-500">{p.role}</span>
                  </div>
                  <button onClick={() => removePerson(p.id)} className="text-red-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {localPeople.length === 0 && <p className="text-sm text-slate-400 italic">Keine Personen zugewiesen.</p>}
            </div>

            <div className="flex gap-2">
              <input 
                placeholder="Name" 
                value={newPersonName}
                onChange={e => setNewPersonName(e.target.value)}
                className="flex-1 p-2 bg-white text-slate-900 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
              />
              <input 
                placeholder="Rolle (z.B. CEO)" 
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

        <div className="p-5 bg-slate-50 border-t border-slate-200 flex justify-between">
          <button 
            onClick={() => onDelete(formData.id)}
            className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded transition-colors"
          >
            Löschen
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded transition-colors"
            >
              Abbrechen
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow-sm hover:bg-blue-700 transition-colors"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditor;