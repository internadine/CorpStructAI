import { HierarchyPointNode } from 'd3';

export enum CompanyType {
  HOLDING = 'Holding',
  GMBH = 'GmbH',
  UG = 'UG (haftungsbeschränkt)',
  KG = 'KG',
  GMBH_CO_KG = 'GmbH & Co. KG',
  AG = 'AG',
  STIFTUNG = 'Stiftung',
  EINZEL = 'Einzelunternehmen',
  SONSTIGE = 'Sonstige'
}

export enum ProjectType {
  CORPORATE_STRUCTURE = 'CORPORATE_STRUCTURE',
  TEAM_STRUCTURE = 'TEAM_STRUCTURE',
  M_A_SCENARIOS = 'M_A_SCENARIOS',
  STARTUP_EQUITY = 'STARTUP_EQUITY',
  FAMILY_BUSINESS = 'FAMILY_BUSINESS',
  COMPLIANCE_GOVERNANCE = 'COMPLIANCE_GOVERNANCE',
  INTERNATIONAL_STRUCTURE = 'INTERNATIONAL_STRUCTURE',
  PARTNERSHIP_JV = 'PARTNERSHIP_JV',
  INVESTMENT_FUND = 'INVESTMENT_FUND',
  NONPROFIT = 'NONPROFIT',
  REAL_ESTATE = 'REAL_ESTATE',
  PRINCE2_PROJECT = 'PRINCE2_PROJECT',
  PSMI_PROJECT = 'PSMI_PROJECT'
}

export enum TeamType {
  TEAM = 'Team',
  DEPARTMENT = 'Department',
  SQUAD = 'Squad',
  CHAPTER = 'Chapter',
  TRIBE = 'Tribe',
  WORKSTREAM = 'Workstream',
  UNIT = 'Unit'
}

export interface Person {
  id: string;
  name: string;
  role: string;
  companyId: string;
}

export interface CompanyResource {
  id: string;
  name: string; // e.g., "Gebäude Berlin", "Büro München"
  type: string; // e.g., "Gebäude", "Büro", "Lager"
  value?: number; // Value in EUR
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType | string; // Allow string for project-type-specific types (TeamType, etc.)
  parentIds: string[]; // Changed from parentId to parentIds for multiple holdings
  parentOwnership?: { [parentId: string]: number }; // Beteiligungsverhältnisse in Prozent (0-100)
  description?: string;
  color?: string; // Hex color code for custom node coloring
  businessJustification?: string; // Unternehmensgegenstand
  financialResources?: number; // Financial resources in EUR
  companyResources?: CompanyResource[]; // Buildings, offices, etc.
  customPosition?: { x: number; y: number }; // Custom position for drag and drop
}

export interface StructureData {
  companies: Company[];
  people: Person[];
}

export interface Project {
  id: string;
  name: string;
  lastModified: number;
  data: StructureData;
  projectType?: ProjectType; // Optional for backward compatibility, defaults to CORPORATE_STRUCTURE
  country?: string; // Country code (ISO 3166-1 alpha-2) for tax and legal consultancy context
}

export interface D3Node extends HierarchyPointNode<Company & { people: Person[] }> {
  x0?: number;
  y0?: number;
}

export type ChatType = 'business' | 'legal';

export type MemoryCategory = 
  | 'corporate_structure' 
  | 'team_structure' 
  | 'decisions' 
  | 'preferences' 
  | 'constraints' 
  | 'relationships' 
  | 'other';

export interface Memory {
  id: string;
  fact: string;
  category: MemoryCategory;
  importance: number; // 1-5
  createdAt: number;
  sourceChat: ChatType;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant';
  text: string;
  content?: string; // For compatibility with OpenRouter format
}

export interface Conversation {
  id: string;
  messages: ChatMessage[];
  chatType: ChatType;
  createdAt: number;
  extracted: boolean;
}

// Helper function to get node types for a project type
export const getNodeTypesForProjectType = (projectType?: ProjectType): string[] => {
  if (!projectType || projectType === ProjectType.CORPORATE_STRUCTURE) {
    return Object.values(CompanyType);
  }
  
  switch (projectType) {
    case ProjectType.TEAM_STRUCTURE:
      return Object.values(TeamType);
    case ProjectType.PRINCE2_PROJECT:
      return ['Project Stage', 'Work Package', 'Product', 'Team', 'Deliverable'];
    case ProjectType.PSMI_PROJECT:
      return ['Project Phase', 'Milestone', 'Deliverable', 'Work Package', 'Stakeholder Group'];
    default:
      // For other project types, use CompanyType as fallback but allow custom strings
      return Object.values(CompanyType);
  }
};

// Helper function to get default node type for a project type
export const getDefaultNodeTypeForProjectType = (projectType?: ProjectType): string => {
  if (!projectType || projectType === ProjectType.CORPORATE_STRUCTURE) {
    return CompanyType.GMBH;
  }
  
  switch (projectType) {
    case ProjectType.TEAM_STRUCTURE:
      return TeamType.TEAM;
    case ProjectType.PRINCE2_PROJECT:
      return 'Work Package';
    case ProjectType.PSMI_PROJECT:
      return 'Work Package';
    default:
      return CompanyType.GMBH;
  }
};

// Helper function to get node labels (singular/plural) for a project type
export const getNodeLabelForProjectType = (projectType?: ProjectType): { singular: string; plural: string; addButton: string } => {
  if (!projectType || projectType === ProjectType.CORPORATE_STRUCTURE) {
    return { singular: 'Company', plural: 'Companies', addButton: 'Add Company Manually' };
  }
  
  switch (projectType) {
    case ProjectType.TEAM_STRUCTURE:
      return { singular: 'Team', plural: 'Teams', addButton: 'Add Team Manually' };
    case ProjectType.M_A_SCENARIOS:
      return { singular: 'Company', plural: 'Companies', addButton: 'Add Company Manually' };
    case ProjectType.STARTUP_EQUITY:
      return { singular: 'Company', plural: 'Companies', addButton: 'Add Company Manually' };
    case ProjectType.FAMILY_BUSINESS:
      return { singular: 'Company', plural: 'Companies', addButton: 'Add Company Manually' };
    case ProjectType.COMPLIANCE_GOVERNANCE:
      return { singular: 'Unit', plural: 'Units', addButton: 'Add Unit Manually' };
    case ProjectType.INTERNATIONAL_STRUCTURE:
      return { singular: 'Company', plural: 'Companies', addButton: 'Add Company Manually' };
    case ProjectType.PARTNERSHIP_JV:
      return { singular: 'Partnership', plural: 'Partnerships', addButton: 'Add Partnership Manually' };
    case ProjectType.INVESTMENT_FUND:
      return { singular: 'Fund', plural: 'Funds', addButton: 'Add Fund Manually' };
    case ProjectType.NONPROFIT:
      return { singular: 'Organization', plural: 'Organizations', addButton: 'Add Organization Manually' };
    case ProjectType.REAL_ESTATE:
      return { singular: 'Company', plural: 'Companies', addButton: 'Add Company Manually' };
    case ProjectType.PRINCE2_PROJECT:
      return { singular: 'Work Package', plural: 'Work Packages', addButton: 'Add Work Package Manually' };
    case ProjectType.PSMI_PROJECT:
      return { singular: 'Work Package', plural: 'Work Packages', addButton: 'Add Work Package Manually' };
    default:
      return { singular: 'Node', plural: 'Nodes', addButton: 'Add Node Manually' };
  }
};

// Helper function to get default node name for a project type
export const getDefaultNodeNameForProjectType = (projectType?: ProjectType): string => {
  if (!projectType || projectType === ProjectType.CORPORATE_STRUCTURE) {
    return 'Neue Firma';
  }
  
  switch (projectType) {
    case ProjectType.TEAM_STRUCTURE:
      return 'New Team';
    case ProjectType.PRINCE2_PROJECT:
      return 'New Work Package';
    case ProjectType.PSMI_PROJECT:
      return 'New Work Package';
    default:
      return 'New Node';
  }
};
