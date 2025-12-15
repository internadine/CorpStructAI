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
  REAL_ESTATE = 'REAL_ESTATE'
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
  type: CompanyType;
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
