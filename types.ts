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

export interface Person {
  id: string;
  name: string;
  role: string;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  parentIds: string[]; // Changed from parentId to parentIds for multiple holdings
  description?: string;
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
}

export interface D3Node extends HierarchyPointNode<Company & { people: Person[] }> {
  x0?: number;
  y0?: number;
}
