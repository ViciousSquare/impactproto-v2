import { z } from "zod";

// Enums
export enum VerificationType {
  SelfReported = "self-reported",
  Verified = "verified",
  Audited = "audited"
}

export enum ImpactGrade {
  APlus = "A+",
  A = "A",
  AMinus = "A-",
  BPlus = "B+",
  B = "B",
  BMinus = "B-",
  CPlus = "C+",
  C = "C",
  CMinus = "C-",
  D = "D",
  F = "F"
}

// Types for frontend usage
export type Sector = 
  | "Food Security" 
  | "Housing" 
  | "Education" 
  | "Environment" 
  | "Health & Wellbeing"
  | "Health"
  | "Economic Development"
  | "Social Services"
  | "Arts & Culture";

export type Region = 
  | "National" 
  | "Ontario" 
  | "Quebec" 
  | "British Columbia" 
  | "Alberta" 
  | "Atlantic"
  | "Prairies" 
  | "Northern";

export type SDG = 
  | "SDG 1: No Poverty"
  | "SDG 2: Zero Hunger"
  | "SDG 3: Good Health"
  | "SDG 4: Quality Education"
  | "SDG 5: Gender Equality"
  | "SDG 6: Clean Water"
  | "SDG 7: Affordable and Clean Energy"
  | "SDG 8: Decent Work and Economic Growth"
  | "SDG 9: Industry, Innovation and Infrastructure"
  | "SDG 10: Reduced Inequalities"
  | "SDG 11: Sustainable Cities and Communities"
  | "SDG 12: Responsible Consumption"
  | "SDG 13: Climate Action"
  | "SDG 14: Life Below Water"
  | "SDG 15: Life on Land"
  | "SDG 16: Peace, Justice and Strong Institutions"
  | "SDG 17: Partnerships for the Goals";

export type Demographic = 
  | "Children & Youth"
  | "Seniors"
  | "Indigenous Communities"
  | "Newcomers"
  | "Women & Girls"
  | "LGBTQ+"
  | "Persons with Disabilities"
  | "Low Income"
  | "Rural Communities";

// Interface for leaderboard items
export interface LeaderboardItem {
  id: number;
  rank: number;
  name: string;
  sector: Sector;
  logo?: string;
  impactScore: number;
  yearlyChange: number;
  socialROI: number;
  region: Region;
  impactGrade: ImpactGrade;
  verificationType: VerificationType;
  organizationSize?: 'small' | 'medium' | 'large'; // Added organization size
}

export type BusinessType = 
  | "Non-Profit" 
  | "Corporate" 
  | "Government" 
  | "Academic" 
  | "Social Enterprise";

// Interface for Solution Finder items
export interface SolutionItem {
  id: number;
  name: string;
  organizationName: string;
  icon: string;
  sector: Sector;
  businessType: BusinessType;
  region: Region;
  description: string;
  peopleReached: number;
  socialROI: number;
  impactGrade: ImpactGrade;
  verificationType: VerificationType;
  effectiveness: number;
  tags: string[];
}

// Interface for Organization Profile
export interface OrganizationProfile {
  id: number;
  name: string;
  logo?: string;
  mission: string;
  sector: Sector;
  region: Region;
  established?: number;
  impactScore: number;
  impactGrade: ImpactGrade;
  verificationType: VerificationType;
  yearlyChange: number;
  sdgAlignment: SDG[];
  metrics: {
    reportingQuality: number;
    reach: number;
    socialROI: number;
    outcomeEffectiveness: number;
    transparencyGovernance: number;
  };
  stats: {
    peopleReached: string;
    socialROI: number;
    programs: number;
    funding: string;
    programAllocation: number;
  };
  yearlyTrend: number[];
  topPrograms: {
    name: string;
    peopleReached: number;
    socialROI: number;
    impactGrade: ImpactGrade;
  }[];
  organizationSize?: 'small' | 'medium' | 'large'; // Added organization size
}

// Interface for trending stats
export interface TrendingItem {
  id: number;
  name: string;
  change: number;
}

// Interface for platform statistics
export interface PlatformStatistics {
  organizationCount: number;
  programCount: number;
  impactValue: number;
}

// Form schemas 
export const searchFormSchema = z.object({
  query: z.string().optional(),
  sector: z.string().optional(),
  region: z.string().optional(),
  sdg: z.string().optional(),
  organizationSize: z.string().optional(), // Added organization size
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export const solutionSearchSchema = z.object({
  query: z.string().optional(),
  sector: z.string().optional(),
  region: z.string().optional(),
  businessType: z.string().optional(),
  sdg: z.string().optional(),
  demographic: z.string().optional(),
  organizationSize: z.string().optional(), // Added organization size
});

export type SolutionSearchValues = z.infer<typeof solutionSearchSchema>;

// Filter options
export const SECTOR_OPTIONS = [
  { value: "all", label: "All Sectors" },
  { value: "Food Security", label: "Food Security" },
  { value: "Housing", label: "Housing" },
  { value: "Education", label: "Education" },
  { value: "Environment", label: "Environment" },
  { value: "Health & Wellbeing", label: "Health & Wellbeing" },
  { value: "Economic Development", label: "Economic Development" },
  { value: "Social Services", label: "Social Services" },
  { value: "Arts & Culture", label: "Arts & Culture" },
];

export const REGION_OPTIONS = [
  { value: "all", label: "All Regions" },
  { value: "National", label: "National" },
  { value: "Ontario", label: "Ontario" },
  { value: "Quebec", label: "Quebec" },
  { value: "British Columbia", label: "British Columbia" },
  { value: "Alberta", label: "Alberta" },
  { value: "Atlantic", label: "Atlantic" },
  { value: "Prairies", label: "Prairies" },
  { value: "Northern", label: "Northern" },
];

export const SDG_OPTIONS = [
  { value: "all", label: "All SDGs" },
  { value: "SDG 1", label: "No Poverty" },
  { value: "SDG 2", label: "Zero Hunger" },
  { value: "SDG 3", label: "Good Health" },
  { value: "SDG 4", label: "Quality Education" },
  { value: "SDG 5", label: "Gender Equality" },
  { value: "SDG 6", label: "Clean Water" },
  { value: "SDG 7", label: "Affordable and Clean Energy" },
  { value: "SDG 8", label: "Decent Work and Economic Growth" },
  { value: "SDG 9", label: "Industry, Innovation and Infrastructure" },
  { value: "SDG 10", label: "Reduced Inequalities" },
  { value: "SDG 11", label: "Sustainable Cities and Communities" },
  { value: "SDG 12", label: "Responsible Consumption" },
  { value: "SDG 13", label: "Climate Action" },
  { value: "SDG 14", label: "Life Below Water" },
  { value: "SDG 15", label: "Life on Land" },
  { value: "SDG 16", label: "Peace, Justice and Strong Institutions" },
  { value: "SDG 17", label: "Partnerships for the Goals" },
];

export const DEMOGRAPHIC_OPTIONS = [
  { value: "all", label: "All Demographics" },
  { value: "Children & Youth", label: "Children & Youth" },
  { value: "Seniors", label: "Seniors" },
  { value: "Indigenous Communities", label: "Indigenous Communities" },
  { value: "Newcomers", label: "Newcomers" },
  { value: "Women & Girls", label: "Women & Girls" },
  { value: "LGBTQ+", label: "LGBTQ+" },
  { value: "Persons with Disabilities", label: "Persons with Disabilities" },
  { value: "Low Income", label: "Low Income" },
  { value: "Rural Communities", label: "Rural Communities" },
];

export const BUSINESS_TYPE_OPTIONS = [
  { value: "all", label: "All Business Types" },
  { value: "Non-Profit", label: "Non-Profit" },
  { value: "Corporate", label: "Corporate" },
  { value: "Government", label: "Government" },
  { value: "Academic", label: "Academic" },
  { value: "Social Enterprise", label: "Social Enterprise" }
];

export const ORGANIZATION_SIZE_OPTIONS = [
  { value: "all", label: "All Sizes" },
  { value: "large", label: "Large (250+ employees)" },
  { value: "medium", label: "Medium (50-249 employees)" },
  { value: "small", label: "Small (1-49 employees)" }
];