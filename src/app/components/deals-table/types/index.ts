/**
 * Type definitions for the Deals Table system
 * Centralized type management following TypeScript best practices
 *
 * @format
 */

export interface Deal {
  id: string;
  name: string;
  stage: "New" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost";
  owner: {
    name: string;
    avatar?: string;
    initials: string;
  };
  company: string;
  amount: string;
  probability: number;
  closeDate: string;
  lastActivity: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  source: string;
  tags: string[];
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
  description?: string;
  activities?: Array<{
    type: string;
    description: string;
    date: string;
  }>;
  files?: Array<{
    name: string;
    size: string;
  }>;
}

export interface ColumnConfig {
  key: keyof Deal | "select" | "expand" | "actions";
  label: string;
  visible: boolean;
  width: number;
  minWidth: number;
  resizable: boolean;
}

export interface SortConfig {
  key: keyof Deal;
  direction: "asc" | "desc";
  priority: number;
}

export interface FilterConfig {
  stages: string[];
  priorities: string[];
  owners: string[];
  sources: string[];
  amountRange: { min: number; max: number };
  searchTerm: string;
}
