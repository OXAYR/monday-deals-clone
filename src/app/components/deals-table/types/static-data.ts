/** @format */

import type { Deal, ColumnConfig } from "./index";

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    key: "expand",
    label: "",
    visible: true,
    width: 50,
    minWidth: 50,
    resizable: false,
  },
  {
    key: "select",
    label: "",
    visible: true,
    width: 60,
    minWidth: 60,
    resizable: false,
  },
  {
    key: "name",
    label: "Deal Name",
    visible: true,
    width: 280,
    minWidth: 200,
    resizable: true,
  },
  {
    key: "stage",
    label: "Stage",
    visible: true,
    width: 160,
    minWidth: 140,
    resizable: true,
  },
  {
    key: "owner",
    label: "Owner",
    visible: true,
    width: 180,
    minWidth: 160,
    resizable: true,
  },
  {
    key: "company",
    label: "Company",
    visible: true,
    width: 200,
    minWidth: 180,
    resizable: true,
  },
  {
    key: "amount",
    label: "Amount",
    visible: true,
    width: 140,
    minWidth: 120,
    resizable: true,
  },
  {
    key: "probability",
    label: "Probability",
    visible: true,
    width: 160,
    minWidth: 140,
    resizable: true,
  },
  {
    key: "closeDate",
    label: "Close Date",
    visible: true,
    width: 140,
    minWidth: 120,
    resizable: true,
  },
  {
    key: "priority",
    label: "Priority",
    visible: true,
    width: 130,
    minWidth: 110,
    resizable: true,
  },
  {
    key: "source",
    label: "Source",
    visible: true,
    width: 120,
    minWidth: 100,
    resizable: true,
  },
  {
    key: "tags",
    label: "Tags",
    visible: true,
    width: 160,
    minWidth: 140,
    resizable: true,
  },
];

/**
 * Sample deals for demonstration and development.
 */
export const SAMPLE_DEALS: Deal[] = [
  {
    id: "1",
    name: "Enterprise Software License - Q1 2024",
    stage: "Negotiation",
    owner: { name: "Sarah Johnson", initials: "SJ" },
    company: "TechCorp Inc.",
    amount: "$125,000",
    probability: 85,
    closeDate: "2024-02-15",
    lastActivity: "2024-01-10",
    priority: "High",
    source: "Website",
    tags: ["Enterprise", "Software", "Multi-Year"],
    contact: {
      name: "John Smith",
      email: "john.smith@techcorp.com",
      phone: "+1 (555) 123-4567",
    },
    description:
      "Multi-year enterprise software licensing deal for their global operations with advanced security features.",
    activities: [
      {
        type: "Meeting",
        description: "Product demo with technical team",
        date: "2024-01-10",
      },
      {
        type: "Call",
        description: "Follow-up call with CTO",
        date: "2024-01-08",
      },
      {
        type: "Email",
        description: "Sent proposal and pricing",
        date: "2024-01-05",
      },
    ],
    files: [
      { name: "Proposal_TechCorp_v2.pdf", size: "2.4 MB" },
      { name: "Technical_Requirements.docx", size: "1.1 MB" },
    ],
  },
  {
    id: "2",
    name: "Marketing Automation Platform - Growth Plan",
    stage: "Qualified",
    owner: { name: "Mike Chen", initials: "MC" },
    company: "StartupXYZ",
    amount: "$45,000",
    probability: 60,
    closeDate: "2024-03-01",
    lastActivity: "2024-01-08",
    priority: "Medium",
    source: "Referral",
    tags: ["Marketing", "SaaS", "Automation"],
    contact: {
      name: "Lisa Wong",
      email: "lisa@startupxyz.com",
      phone: "+1 (555) 987-6543",
    },
    description:
      "Marketing automation platform for lead nurturing and customer engagement campaigns, focusing on growth.",
    activities: [
      {
        type: "Email",
        description: "Sent case studies and ROI analysis",
        date: "2024-01-08",
      },
      {
        type: "Call",
        description: "Discovery call with marketing team",
        date: "2024-01-06",
      },
    ],
    files: [
      { name: "ROI_Analysis_StartupXYZ.xlsx", size: "856 KB" },
      { name: "Case_Studies.pdf", size: "3.2 MB" },
    ],
  },
  {
    id: "3",
    name: "Custom Development Project - Revamp",
    stage: "Proposal",
    owner: { name: "Emily Rodriguez", initials: "ER" },
    company: "Global Solutions Ltd",
    amount: "$89,000",
    probability: 70,
    closeDate: "2024-02-28",
    lastActivity: "2024-01-09",
    priority: "High",
    source: "Cold Outreach",
    tags: ["Development", "Custom", "Web App"],
    contact: {
      name: "David Wilson",
      email: "david@globalsolutions.com",
      phone: "+1 (555) 456-7890",
    },
    description:
      "Custom web application development with advanced features and a complete UI/UX revamp.",
    activities: [
      {
        type: "Meeting",
        description: "Requirements gathering session",
        date: "2024-01-09",
      },
    ],
    files: [{ name: "Project_Scope.pdf", size: "1.8 MB" }],
  },
  {
    id: "4",
    name: "Cloud Infrastructure Setup - Migration",
    stage: "New",
    owner: { name: "David Kim", initials: "DK" },
    company: "MedTech Solutions",
    amount: "$67,000",
    probability: 30,
    closeDate: "2024-04-15",
    lastActivity: "2024-01-05",
    priority: "Medium",
    source: "Trade Show",
    tags: ["Cloud", "Infrastructure", "AWS"],
    contact: {
      name: "Jennifer Lee",
      email: "jennifer@medtech.com",
      phone: "+1 (555) 234-5678",
    },
    description:
      "Complete cloud infrastructure migration and setup on AWS for enhanced scalability.",
    activities: [
      { type: "Call", description: "Initial consultation", date: "2024-01-05" },
    ],
    files: [],
  },
  {
    id: "5",
    name: "Data Analytics Platform - FinanceFirst",
    stage: "Won",
    owner: { name: "Lisa Wang", initials: "LW" },
    company: "FinanceFirst Bank",
    amount: "$156,000",
    probability: 100,
    closeDate: "2024-01-15",
    lastActivity: "2024-01-15",
    priority: "Critical",
    source: "Partnership",
    tags: ["Analytics", "Finance", "Reporting"],
    contact: {
      name: "Robert Chen",
      email: "robert@financefirst.com",
      phone: "+1 (555) 345-6789",
    },
    description:
      "Advanced data analytics platform for financial reporting and compliance.",
    activities: [
      { type: "Meeting", description: "Contract signing", date: "2024-01-15" },
    ],
    files: [{ name: "Signed_Contract.pdf", size: "3.2 MB" }],
  },
  {
    id: "6",
    name: "Mobile App Development - RetailChain",
    stage: "Lost",
    owner: { name: "Tom Wilson", initials: "TW" },
    company: "RetailChain Corp",
    amount: "$78,000",
    probability: 0,
    closeDate: "2024-01-30",
    lastActivity: "2024-01-30",
    priority: "Low",
    source: "Website",
    tags: ["Mobile", "Retail", "Customer App"],
    contact: {
      name: "Maria Garcia",
      email: "maria@retailchain.com",
      phone: "+1 (555) 567-8901",
    },
    description:
      "Mobile application for retail customer engagement and loyalty program.",
    activities: [
      { type: "Email", description: "Final follow-up", date: "2024-01-30" },
    ],
    files: [],
  },
];

/**
 * Options for deal stages, used in select dropdowns.
 */
export const stageOptions = [
  { value: "New", label: "New", color: "#64748b" },
  { value: "Qualified", label: "Qualified", color: "#3b82f6" },
  { value: "Proposal", label: "Proposal", color: "#f59e0b" },
  { value: "Negotiation", label: "Negotiation", color: "#ef4444" },
  { value: "Won", label: "Won", color: "#10b981" },
  { value: "Lost", label: "Lost", color: "#6b7280" },
];

/**
 * Options for deal priorities, used in select dropdowns.
 */
export const priorityOptions = [
  { value: "Low", label: "Low", color: "#10b981" },
  { value: "Medium", label: "Medium", color: "#f59e0b" },
  { value: "High", label: "High", color: "#ef4444" },
  { value: "Critical", label: "Critical", color: "#dc2626" },
];
