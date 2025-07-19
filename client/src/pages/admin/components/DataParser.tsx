import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Helper function to generate a comprehensive plainTextSummary from available data
function generateOrganizationSummary(data: any): string {
  const parts = [];

  // Basic info
  if (data.organization_name && data.sector) {
    parts.push(`${data.organization_name} is a ${data.sector} organization${data.year_established ? ` founded in ${data.year_established}` : ''}.`);
  }

  // Mission and impact
  if (data.methodology_summary) {
    parts.push(data.methodology_summary);
  }

  // Executive summary from impact analysis
  if (data.impact_analysis?.executive_summary) {
    parts.push(data.impact_analysis.executive_summary);
  }

  // Key strengths
  if (Array.isArray(data.impact_analysis?.key_strengths) && data.impact_analysis.key_strengths.length > 0) {
    parts.push(`Key strengths: ${data.impact_analysis.key_strengths.join(', ')}.`);
  }

  // Impact metrics
  if (typeof data.impact_iq_score === 'number') {
    parts.push(`The organization has an Impact IQ Score of ${data.impact_iq_score}${data.grade ? ` (Grade: ${data.grade})` : ''}.`);
  }

  // Programs
  if (Array.isArray(data.programs) && data.programs.length > 0) {
    const totalReached = data.programs.reduce((sum: number, p: any) => sum + (p.people_reached || 0), 0);
    if (totalReached > 0) {
      parts.push(`Through ${data.programs.length} program(s), they've reached approximately ${totalReached} beneficiaries.`);
    }
  }

  // Financial summary
  if (data.financials) {
    const financialPoints = [];
    if (data.financials.revenue) {
      financialPoints.push(`annual revenue of $${data.financials.revenue}`);
    }
    if (data.financials.program_expenses_pct) {
      financialPoints.push(`${data.financials.program_expenses_pct}% spent on programs`);
    }
    if (financialPoints.length > 0) {
      parts.push(`Financial snapshot: ${financialPoints.join(', ')}.`);
    }
  }

  // If no content was generated, use a basic fallback
  if (parts.length === 0) {
    return data.impact_analysis?.executive_summary || "";
  }

  return parts.join(' ');
}
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface OrganizationPreview {
  id?: number;
  name: string;
  sector: string;
  sdgAlignment: string[];
  region: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  bestContact: string;
  mission: string;
  description: string;
  executiveSummary: string;
  keyStrengths: string[];
  areasForDevelopment: string[];
  sectorPosition: string;
  impactScore: number;
  impactGrade: string;
  impactComponents: {
    innovation: number;
    quality: number;
    scalability: number;
    sustainability: number;
  };
  verificationType: string;
  yearFounded: number;
  employeeCount: number;
  programCount: number;
  beneficiariesReached: number;
  plainTextSummary: string; // Part of the JSON structure now
  programs: {
    name: string;
    description: string;
    metrics: string;
    beneficiaries: string;
    startYear: number;
    status: string;
  }[];
  metrics: {
    name: string;
    value: string;
    unit: string;
    year: number;
    category: string;
  }[];
  partners: {
    name: string;
    role: string;
  }[];
}

const DataParser = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("json-parser");
  const [jsonInput, setJsonInput] = useState("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isDataParsing, setIsDataParsing] = useState(false);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [previewOrganization, setPreviewOrganization] = useState<OrganizationPreview | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define parse response type
  type ParseJsonResponse = {
    parsed: boolean;
    data?: {
      organization_name?: string;
      sector?: string;
      sdg_alignment?: string[];
      region?: string;
      website?: string;
      best_contact?: {
        name?: string;
        email?: string;
        role?: string;
      };
      contact_info?: string;
      methodology_summary?: string;
      methodology_source?: string;
      reports_documents_used?: Array<{
        file_name: string;
        type: string;
        date: string;
      }>;
      impact_analysis?: {
        executive_summary?: string;
        key_strengths?: string[];
        areas_for_development?: string[];
        sector_positioning?: string;
        conclusion?: string;
      };
      impact_iq_score?: number;
      grade?: string;
      reporting_quality?: number;
      outcome_effectiveness?: number;
      reach?: number;
      est_social_roi?: number;
      transparency_governance?: number;
      verification_level?: string;
      year_established?: number;
      key_insights_about_org?: string[];
      admin_notes?: string;
      recommendations?: string[];
      financials?: {
        revenue?: number;
        expenditures?: number;
        program_expenses_pct?: number;
        fundraising_pct?: number;
        admin_pct?: number;
        surplus?: number;
        funding_sources?: {
          institutional?: number;
          individual?: number;
          government?: number;
          other?: number;
        };
      };
      programs?: Array<{
        name: string;
        effectiveness: string;
        people_reached?: number;
        social_roi?: string;
        score: string;
        sdgs?: string[];
      }>;
      key_statistics_kpis?: string[];
      key_target_members_partners?: Array<{
        name: string;
        type: string;
        role: string;
      }>;
    };
    error?: string;
  };

  // Parse JSON mutation
  const parseJsonMutation = useMutation({
    mutationFn: async (jsonData: string) => {
      try {
        // First try to clean any HTML/unwanted content
        let cleanJson = jsonData;

        // If we detect HTML content, try to extract JSON
        if (cleanJson.includes('<!DOCTYPE') || cleanJson.includes('<html')) {
          const jsonStart = cleanJson.indexOf('{');
          const jsonEnd = cleanJson.lastIndexOf('}');
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            cleanJson = cleanJson.slice(jsonStart, jsonEnd + 1);
          }
        }

        // Parse the cleaned JSON
        const parsedData = JSON.parse(cleanJson);

        // Extract what we can, use defaults for missing fields
        const organization = {
          organization_name: parsedData.organization_name || parsedData.name || "Unnamed Organization",
          sector: parsedData.sector || "Other",
          region: parsedData.region || "National",
          sdg_alignment: parsedData.sdg_alignment || [],
          year_established: parsedData.year_established || new Date().getFullYear(),
          contact_info: parsedData.contact_info || "",
          website: parsedData.website || "",
          impact_iq_score: parsedData.impact_iq_score || 75,
          grade: parsedData.grade || "B",
          reporting_quality: parsedData.reporting_quality || 15,
          reach: parsedData.reach || 15,
          est_social_roi: parsedData.est_social_roi || 3.5,
          outcome_effectiveness: parsedData.outcome_effectiveness || 15,
          transparency_governance: parsedData.transparency_governance || 15,
          verification_level: parsedData.verification_level || "Self-Reported",
          methodology_source: parsedData.methodology_source || "Organization Data",
          methodology_summary: parsedData.methodology_summary || "Organization measures impact through standard metrics and reporting.",
        };

        // Call API with validated JSON
        const response = await fetch('/api/organizations/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ jsonData: organization })
        });

        // If we get HTML instead of JSON, create a basic response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          return {
            parsed: true,
            data: organization,
            error: null
          };
        }

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API Error: ${errorData}`);
        }

        return response.json();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`JSON Parsing Error: ${error.message}`);
        }
        throw error;
      }

      // Remove any BOM or hidden characters
      fixedJson = fixedJson.replace(/^\uFEFF/, '');

      // If JSON appears truncated, try to complete it
      const openBraces = (fixedJson.match(/\{/g) || []).length;
      const closeBraces = (fixedJson.match(/\}/g) || []).length;
      if (openBraces > closeBraces) {
        fixedJson += "}".repeat(openBraces - closeBraces);
      }

      // If JSON ends with a comma, remove it
      fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');

      // If JSON appears to be truncated, try to complete it
      if (fixedJson.split('{').length > fixedJson.split('}').length) {
        fixedJson += '}';
      }
      if (fixedJson.split('[').length > fixedJson.split(']').length) {
        fixedJson += ']';
      }

      try {
        // Parse the JSON first to validate
        const parsed = JSON.parse(fixedJson);

        // Ensure required fields exist
        if (!parsed.organization_name || !parsed.sector || !parsed.region) {
          throw new Error("Missing required fields: organization_name, sector, and region are required");
        }

        return apiRequest<ParseJsonResponse>("POST", "/api/organizations/parse", { jsonData: fixedJson });
      } catch (error) {
        throw new Error(`JSON parsing failed: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
      }
    },
    onSuccess: (data) => {
      if (data.data) {
        // Create a preview model with all available data
        const preview: OrganizationPreview = {
          name: data.data.organization_name || "",
          sector: data.data.sector || "",
          sdgAlignment: Array.isArray(data.data.sdg_alignment) ? data.data.sdg_alignment : [],
          region: data.data.region || "",
          website: data.data.website || "",
          contactEmail: data.data.contact_info?.email || data.data.contact_email || "",
          contactPhone: data.data.contact_info?.phone || data.data.contactPhone || "",
          bestContact: data.data.best_contact?.name || "",
          mission: data.data.methodology_summary || data.data.mission || "",
          description: data.data.description || "",
          executiveSummary: data.data.impact_analysis?.executive_summary || "",
          keyStrengths: data.data.impact_analysis?.key_strengths || [],
          areasForDevelopment: data.data.impact_analysis?.areas_for_development || [],
          sectorPosition: data.data.impact_analysis?.sector_positioning || "",
          impactScore: data.data.impact_iq_score || 0,
          impactGrade: data.data.grade || "N/A",
          impactComponents: {
            innovation: data.data.reporting_quality || 0,
            quality: data.data.outcome_effectiveness || 0,
            scalability: data.data.reach || 0,
            sustainability: data.data.transparency_governance || 0
          },
          verificationType: data.data.verification_level || "self-reported",
          yearFounded: data.data.year_established || new Date().getFullYear(),
          employeeCount: data.data.employee_count || 0,
          programCount: (data.data.programs || []).length,
          beneficiariesReached: data.data.total_beneficiaries || 0,
          stats: {
            peopleReached: data.data.total_beneficiaries?.toLocaleString() + ' annually' || 'N/A',
            socialROI: data.data.est_social_roi || 0,
            programs: (data.data.programs || []).length,
            funding: data.data.financials?.revenue ? `$${(data.data.financials.revenue/1000000).toFixed(1)}M` : 'N/A',
            programAllocation: data.data.financials?.program_expenses_pct || 0
          },
          programs: data.data.programs?.map(p => ({
            name: p.name,
            description: p.description || "",
            metrics: p.metrics || "",
            beneficiaries: p.people_reached?.toString() || "",
            startYear: p.start_year || new Date().getFullYear(),
            status: p.status || "active",
            peopleReached: p.people_reached || 0,
            socialROI: parseFloat(p.social_roi) || 0,
            impactGrade: p.score || 'N/A'
          })) || [],
          metrics: {
            reportingQuality: data.data.reporting_quality || 0,
            reach: data.data.reach || 0,
            socialROI: data.data.est_social_roi || 0,
            outcomeEffectiveness: data.data.outcome_effectiveness || 0,
            transparencyGovernance: data.data.transparency_governance || 0
          },
          plainTextSummary: generateOrganizationSummary(data.data),
        };

        // Set preview organization
        setPreviewOrganization(preview);
        setShowPreviewDialog(true);

        toast({
          title: "JSON parsed successfully",
          description: "Organization data has been extracted and is ready for preview.",
        });
      } else {
        toast({
          title: "JSON parsing failed",
          description: data.error || "Invalid JSON format. Please check the input and try again.",
          variant: "destructive",
        });
      }
      setIsDataParsing(false);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setParsingError(errorMessage);
      toast({
        title: "JSON Parsing Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsDataParsing(false);
    },
  });

  // Define file upload response type
  type FileUploadResponse = {
    parsed: boolean;
    jsonData?: string;
    error?: string;
  };

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest<FileUploadResponse>("POST", "/api/organizations/upload", formData);
    },
    onSuccess: (data) => {
      if (data.parsed) {
        setJsonInput(data.jsonData || "");
        toast({
          title: "File uploaded",
          description: "File content has been loaded and is ready for parsing.",
        });
      } else {
        toast({
          title: "Upload failed",
          description: data.error || "Could not process the file. Please check the format.",
          variant: "destructive",
        });
      }
      setIsFileUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      setIsFileUploading(false);
    },
  });

  // Define import response type
  type ImportResponse = {
    id?: number;
    name: string;
  };

  // Define batch import response type
  type BatchImportResponse = {
    successful: number;
    failed: number;
    errors?: Array<{ index: number; error: string }>;
  };

  // Import data mutation
  const importDataMutation = useMutation({
    mutationFn: async (orgData: OrganizationPreview) => {
      return apiRequest<ImportResponse>("POST", "/api/organizations", orgData);
    },
    onSuccess: async (data) => {
      toast({
        title: "Organization imported",
        description: `${data.name} has been successfully added to the platform.`,
      });

      // Reset the form
      setJsonInput("");
      setShowPreviewDialog(false);
      setPreviewOrganization(null);

      // Invalidate all relevant queries
      // Invalidate and refetch all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['/api/organizations'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/statistics'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/organizations/featured'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/trending'] }),
        queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] })
      ]);
      
      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['/api/organizations'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['/api/statistics'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['/api/organizations/featured'], type: 'active' })
      ]);
    },
    onError: (error) => {
      toast({
        title: "Import failed",
        description: "Could not import the organization data. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Batch import mutation
  const batchImportMutation = useMutation({
    mutationFn: async (jsonData: string) => {
      const organizations = JSON.parse(jsonData);
      return apiRequest<BatchImportResponse>("POST", "/api/organizations/batch", { organizations });
    },
    onSuccess: (response) => {
      toast({
        title: "Batch import completed",
        description: `Successfully imported ${response.successful} organizations. Failed: ${response.failed}.`,
      });

      // Reset the form
      setJsonInput("");

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
    },
    onError: (error) => {
      toast({
        title: "Batch import failed",
        description: "Could not process the batch import. Please check the JSON format.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "The selected file exceeds the 5MB limit.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsFileUploading(true);
    uploadFileMutation.mutate(formData);
  };

  const handleParseJson = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter JSON data to parse.",
        variant: "destructive",
      });
      return;
    }

    // Validate JSON format before attempting to parse
    try {
      // First try to parse the JSON
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        // If parsing fails, try to identify where the error occurred
        const error = e as Error;
        let errorMessage = error.message;

        if (error.message.includes('Unexpected token')) {
          const match = error.message.match(/position (\d+)/);
          if (match) {
            const position = parseInt(match[1]);
            const context = jsonInput.substring(Math.max(0, position - 20), Math.min(jsonInput.length, position + 20));
            errorMessage = `JSON syntax error near: "...${context}..."`;
          }
        }

        throw new Error(errorMessage);
      }

      setParsingError(null);

      // For batch import, validate array structure
      if (activeTab === 'batch-import') {
        if (!Array.isArray(parsedData)) {
          throw new Error("Batch import requires a JSON array of organizations.");
        }
      } else {
        // For single organization import, validate required fields
        if (!parsedData.organization_name) {
          throw new Error("Missing required field: organization_name");
        }
        if (!parsedData.sector) {
          throw new Error("Missing required field: sector");
        }
        if (!parsedData.region) {
          throw new Error("Missing required field: region");
        }
      }

      // Validate data structure and handle missing fields gracefully
      const validationWarnings = [];

      // Check for malformed arrays
      if (parsedData.sdg_alignment && !Array.isArray(parsedData.sdg_alignment)) {
        validationWarnings.push("sdg_alignment should be an array");
      }
      if (parsedData.key_statistics_kpis && !Array.isArray(parsedData.key_statistics_kpis)) {
        validationWarnings.push("key_statistics_kpis should be an array");
      }
      if (parsedData.programs && !Array.isArray(parsedData.programs)) {
        validationWarnings.push("programs should be an array");
      }
      if (parsedData.key_target_members_partners && !Array.isArray(parsedData.key_target_members_partners)) {
        validationWarnings.push("key_target_members_partners should be an array");
      }
      if (parsedData.key_insights_about_org && !Array.isArray(parsedData.key_insights_about_org)) {
        validationWarnings.push("key_insights_about_org should be an array");
      }
      if (parsedData.recommendations && !Array.isArray(parsedData.recommendations)) {
        validationWarnings.push("recommendations should be an array");
      }
      if (parsedData.reports_documents_used && !Array.isArray(parsedData.reports_documents_used)) {
        validationWarnings.push("reports_documents_used should be an array");
      }

      // Check for expected object structures
      if (parsedData.best_contact && typeof parsedData.best_contact !== 'object') {
        validationWarnings.push("best_contact should be an object");
      }
      if (parsedData.impact_analysis && typeof parsedData.impact_analysis !== 'object') {
        validationWarnings.push("impact_analysis should be an object");
      } else if (parsedData.impact_analysis) {
        // Check for nested arrays in impact_analysis
        if (parsedData.impact_analysis.key_strengths && !Array.isArray(parsedData.impact_analysis.key_strengths)) {
          validationWarnings.push("impact_analysis.key_strengths should be an array");
        }
        if (parsedData.impact_analysis.areas_for_development && !Array.isArray(parsedData.impact_analysis.areas_for_development)) {
          validationWarnings.push("impact_analysis.areas_for_development should be an array");
        }
      }
      if (parsedData.financials && typeof parsedData.financials !== 'object') {
        validationWarnings.push("financials should be an object");
      } else if (parsedData.financials && parsedData.financials.funding_sources && 
                typeof parsedData.financials.funding_sources !== 'object') {
        validationWarnings.push("financials.funding_sources should be an object");
      }

      // Continue with parsing even if there are warnings
      if (validationWarnings.length > 0) {
        toast({
          title: "Data Structure Warnings",
          description: `Found ${validationWarnings.length} structure issues. Processing available data.`,
          variant: "default",
        });

        // Show detailed warnings in UI, not just toast
        setParsingError(`Structure warnings (will still process):\n${validationWarnings.join('\n')}`);
      }

      setIsDataParsing(true);
      parseJsonMutation.mutate(jsonInput);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format";
      const friendlyError = errorMessage.includes('Unexpected end of JSON input') 
        ? 'JSON is incomplete. Please check for missing closing brackets or commas.' 
        : errorMessage;

      setParsingError(`JSON syntax error: ${friendlyError}`);
      toast({
        title: "Invalid JSON Format",
        description: friendlyError,
        variant: "destructive",
      });
      return;
    }
  };

  const handleBatchImport = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter JSON data to import.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First try to parse the JSON
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        // If parsing fails, try to identify where the error occurred
        const error = e as Error;
        let errorMessage = error.message;

        if (error.message.includes('Unexpected token')) {
          const match = error.message.match(/position (\d+)/);
          if (match) {
            const position = parseInt(match[1]);
            const context = jsonInput.substring(Math.max(0, position - 20), Math.min(jsonInput.length, position + 20));
            errorMessage = `JSON syntax error near: "...${context}..."`;
          }
        }

        throw new Error(errorMessage);
      }

      setParsingError(null);

      // For batch import, validate array structure
      if (activeTab === 'batch-import') {
        if (!Array.isArray(parsedData)) {
          throw new Error("Batch import requires a JSON array of organizations.");
        }
      } else {
        // For single organization import, validate required fields
        if (!parsedData.organization_name) {
          throw new Error("Missing required field: organization_name");
        }
        if (!parsedData.sector) {
          throw new Error("Missing required field: sector");
        }
        if (!parsedData.region) {
          throw new Error("Missing required field: region");
        }
      }

      // Validate that the input is a valid JSON array
      const parsed = JSON.parse(jsonInput);
      setParsingError(null);

      if (!Array.isArray(parsed)) {
        const errorMessage = "Batch import requires a JSON array of organizations.";
        setParsingError(errorMessage);
        toast({
          title: "Invalid input format",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Validate each organization in the array has required fields
      const invalidItems = parsed.filter((org: any, index: number) => {
        if (!org.name || !org.sector || !org.region) {
          return true;
        }
        return false;
      });

      if (invalidItems.length > 0) {
        const errorMessage = `${invalidItems.length} organization(s) in the array are missing required fields (name, sector, region). Please check and fix the data.`;
        setParsingError(errorMessage);
        toast({
          title: "Invalid organization data",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Starting batch import",
        description: `Processing ${parsed.length} organizations for import...`,
      });

      batchImportMutation.mutate(jsonInput);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format";
      setParsingError(`JSON syntax error: ${errorMessage}`);
      toast({
        title: "Invalid JSON",
        description: "The input is not valid JSON. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const handleApproveImport = () => {
    if (previewOrganization) {
      importDataMutation.mutate(previewOrganization);
    }
  };

  const handleCancelImport = () => {
    setShowPreviewDialog(false);
  };

  // Form schema for the organization preview edit form
  const orgFormSchema = z.object({
    name: z.string().min(1, "Organization name is required"),
    sector: z.string().min(1, "Sector is required"),
    sdgAlignment: z.array(z.string()),
    region: z.string().min(1, "Region is required"),
    website: z.string().url("Must be a valid URL").or(z.literal("")),
    contactEmail: z.string().email("Must be a valid email").or(z.literal("")),
    contactPhone: z.string(),
    bestContact: z.string(),
    mission: z.string(),
    description: z.string(),
    impactScore: z.number().min(0).max(100),
    impactGrade: z.string(),
    verificationType: z.string(),
    yearFounded: z.number(),
    employeeCount: z.number(),
    programCount: z.number(),
    beneficiariesReached: z.number(),
    plainTextSummary: z.string(),
  });

  type OrgFormValues = z.infer<typeof orgFormSchema>;

  // Initialize the form with preview organization data
  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgFormSchema),
    defaultValues: previewOrganization ? {
      name: previewOrganization.name,
      sector: previewOrganization.sector,
      sdgAlignment: previewOrganization.sdgAlignment,
      region: previewOrganization.region,
      website: previewOrganization.website,
      contactEmail: previewOrganization.contactEmail,
      contactPhone: previewOrganization.contactPhone,
      bestContact: previewOrganization.bestContact,
      mission: previewOrganization.mission,
      description: previewOrganization.description,
      impactScore: previewOrganization.impactScore,
      impactGrade: previewOrganization.impactGrade,
      verificationType: previewOrganization.verificationType,
      yearFounded: previewOrganization.yearFounded,
      employeeCount: previewOrganization.employeeCount,
      programCount: previewOrganization.programCount,
      beneficiariesReached: previewOrganization.beneficiariesReached,
      plainTextSummary: previewOrganization.plainTextSummary,
    } : {
      name: "",
      sector: "",
      sdgAlignment: [],
      region: "",
      website: "",
      contactEmail: "",
      contactPhone: "",bestContact: "",
      mission: "",
      description: "",
      impactScore: 0,
      impactGrade: "",
      verificationType: "self-reported",
      yearFounded: new Date().getFullYear(),
      employeeCount: 0,
      programCount: 0,
      beneficiariesReached: 0,
      plainTextSummary: "",
    }
  });

  const onSubmit = (values: OrgFormValues) => {
    // Update the preview organization with the edited values
    if (previewOrganization) {
      const updatedPreview = {
        ...previewOrganization,
        ...values,
      };
      setPreviewOrganization(updatedPreview);
      setIsEditing(false);

      toast({
        title: "Changes saved",
        description: "Organization preview has been updated with your changes.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Data Input System</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="json-parser">JSON Parser</TabsTrigger>
          <TabsTrigger value="batch-import">Batch Import</TabsTrigger>
          <TabsTrigger value="help">Help & Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="json-parser" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization JSON Parser</CardTitle>
              <CardDescription>
                Parse organization JSON data to create or update organization profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="json-input">Enter Organization JSON Data</Label>
                <Textarea 
                  id="json-input"
                  placeholder="Paste JSON data here..." 
                  className="font-mono min-h-[200px] mt-2"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>

              {parsingError && (
                <div className="bg-red-50 border border-red-200 p-4rounded-md">
                  <h3 className="text-red-700 font-medium mb-2">JSON Parsing Error</h3>
                  <pre className="text-sm text-red-800 whitespace-pre-wrap">{parsingError}</pre>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div>
                  <Label htmlFor="file-upload">Or upload a JSON file</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="file-upload"
                      type="file"
                      ref={fileInputRef}
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="max-w-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setJsonInput("");
                  setParsingError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Clear
              </Button>
              <Button 
                onClick={handleParseJson}
                disabled={isDataParsing || !jsonInput.trim()}
                className="btn-gradient btn-gradient-primary"
              >
                {isDataParsing ? (
                  <>Parsing...</>
                ) : (
                  <>
                    <span className="material-icons text-sm mr-2">code</span>
                    Parse JSON
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="batch-import" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Import Organizations</CardTitle>
              <CardDescription>
                Import multiple organizations at once using an array of organization objects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="batch-json-input">Enter JSON Array of Organizations</Label>
                <Textarea 
                  id="batch-json-input"
                  placeholder="Paste JSON array here..." 
                  className="font-mono min-h-[300px] mt-2"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Format: [&#123; organization1 &#125;, &#123; organization2 &#125;, ...]
                </p>
              </div>

              {parsingError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                  <h3 className="text-red-700 font-medium mb-2">Validation Error</h3>
                  <pre className="text-sm text-red-800 whitespace-pre-wrap">{parsingError}</pre>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setJsonInput("")}
              >
                Clear
              </Button>
              <Button 
                onClick={handleBatchImport}
                disabled={batchImportMutation.isPending || !jsonInput.trim()}
                className="btn-gradient btn-gradient-accent"
              >
                {batchImportMutation.isPending ? (
                  <>Importing...</>
                ) : (
                  <>
                    <span className="material-icons text-sm mr-2">upload_file</span>
                    Batch Import
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Help & Examples</CardTitle>
              <CardDescription>
                Learn how to use the data parser and see example JSON formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">JSON Parser Guidelines</h3>
                <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
                  <li>Paste valid JSON representing a single organization</li>
                  <li>Include plainTextSummary field in the JSON for additional context</li>
                  <li>Preview and edit fields before final approval</li>
                  <li>Required fields: name, sector, region</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Example JSON Format</h3>
                <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto text-sm">
{`{
  "organization_name": "Example Mental Health Org",
  "sector": "Youth Mental Health",
  "sdg_alignment": [
    "SDG 3: Good Health and Well-being",
    "SDG 4: Quality Education",
    "SDG 10: Reduced Inequalities"
  ],
  "region": "Canada (National)",
  "year_established": 2010,
  "contact_info": "123 Main Street, Suite 100, Toronto, ON, M5V 1A1, (416) 555-0123, contact@example.org",
  "website": "example.org",
  "best_contact": {
    "name": "Jane Smith",
    "email": "contact@example.org",
    "role": "Executive Director"
  },
  "impact_iq_score": 85,
  "grade": "A-",
  "reporting_quality": 18,
  "reach": 17,
  "est_social_roi": 4.2,
  "outcome_effectiveness": 17,
  "transparency_governance": 17,
  "verification_level": "Self-Reported",
  "methodology_source": "2024 Impact Report",
  "methodology_summary": "Organization measures impact through quantitative program metrics, participant feedback surveys, and qualitative testimonials. They track engagement across their core programs and measure both immediate outputs and long-term outcomes.",
  "reports_documents_used": [
    {
      "file_name": "Annual Impact Report 2024",
      "type": "PDF",
      "date": "2024-01-15"
    },
    {
      "file_name": "Program Evaluation Summary",
      "type": "PDF",
      "date": "2023-11-30"
    }
  ],
  "key_statistics_kpis": [
    "45,000 youth reached through mental health programming",
    "88% of participants report improved well-being",
    "650 education professionals trained in mental health support"
  ],
  "key_insights_about_org": [
    "National leader in youth mental health peer support models",
    "Innovative digital outreach strategies",
    "Strong cross-sector partnerships"
  ],
  "programs": [
    {
      "name": "School Mental Health Workshops",
      "people_reached": 35000,
      "social_roi": "4.5x",
      "score": "High Impact",
      "effectiveness": "Reaches schools across Canada with evidence-based mental health literacy workshops and ongoing support",
      "sdgs": ["SDG 3", "SDG 4"]
    },
    {
      "name": "Digital Support Platform",
      "people_reached": 10000,
      "social_roi": "3.8x",
      "score": "Medium Impact",
      "effectiveness": "Online peer support community with professional moderation and mental health resources",
      "sdgs": ["SDG 3", "SDG 10"]
    }
  ],
  "key_target_members_partners": [
    {
      "name": "National Mental Health Foundation",
      "type": "Nonprofit",
      "role": "Funding Partner"
    },
    {
      "name": "Provincial Education Departments",
      "type": "Government",
      "role": "Implementation Partner"
    }
  ],
  "admin_notes": "Strong candidate for featured status due to national reach and innovative programs",
  "impact_analysis": {
    "executive_summary": "Example Mental Health Org demonstrates significant impact in youth mental health through their school-based workshops and digital platform. They have successfully scaled their programs nationwide, reaching 45,000 youth annually with evidence-based mental health literacy and support services.",
    "key_strengths": [
      "Evidence-based program design",
      "Strong digital engagement strategy",
      "Effective school partnerships",
      "Youth-led program components"
    ],
    "areas_for_development": [
      "Enhance long-term outcome measurement",
      "Diversify funding streams",
      "Strengthen rural/remote service delivery"
    ],
    "sector_positioning": "Leading national organization in school-based youth mental health programming with innovative peer support models",
    "conclusion": "Highly effective organization with strong impact metrics and scaling potential"
  },
  "recommendations": [
    "Explore provincial government funding opportunities",
    "Develop formal impact measurement framework",
    "Consider international expansion of digital platform"
  ],
  "financials": {
    "revenue": 2500000,
    "expenditures": 2450000,
    "program_expenses_pct": 82,
    "fundraising_pct": 12,
    "admin_pct": 6,
    "surplus": 50000,
    "funding_sources": {
      "institutional": 55,
      "individual": 20,
      "government": 25,
      "other": 0
    }
  }
}`}
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Batch Import Format</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  For batch imports, use a JSON array containing multiple organization objects
                </p>
                <pre className="bg-muted p-4 rounded-md mt-2 overflow-x-auto text-sm">
{`[
  {
    "organization_name": "Organization 1",
    "sector": "Education",
    "sdg_alignment": ["SDG 4"],
    "region": "BC",
    "impact_iq_score": 75,
    ...
  },
  {
    "organization_name": "Organization 2",
    "sector": "Healthcare",
    "sdg_alignment": ["SDG 3"],
    "region": "ON",
    "impact_iq_score": 82,
    ...
  }
]`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Organization Preview & Edit Dialog */}
      {previewOrganization && (
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {isEditing ? "Edit Organization Data" : "Organization Preview"}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Edit the organization information before final approval" 
                  : "Review the parsed organization data and approve or edit as needed"}
              </DialogDescription>
            </DialogHeader>

            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sector *</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select sector" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Environment">Environment</SelectItem>
                                <SelectItem value="Poverty Reduction">Poverty Reduction</SelectItem>
                                <SelectItem value="Human Rights">Human Rights</SelectItem>
                                <SelectItem value="Arts & Culture">Arts & Culture</SelectItem>
                                <SelectItem value="Youth Development">Youth Development</SelectItem>
                                <SelectItem value="Social Services">Social Services</SelectItem>
                                <SelectItem value="Community Development">Community Development</SelectItem>
                                <SelectItem value="International Development">International Development</SelectItem>
                                <SelectItem value="Animal Welfare">Animal Welfare</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region *</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>                              <SelectContent>
                                <SelectItem value="BC">British Columbia</SelectItem>
                                <SelectItem value="AB">Alberta</SelectItem>
                                <SelectItem value="SK">Saskatchewan</SelectItem>
                                <SelectItem value="MB">Manitoba</SelectItem>
                                <SelectItem value="ON">Ontario</SelectItem>
                                <SelectItem value="QC">Quebec</SelectItem>
                                <SelectItem value="NB">New Brunswick</SelectItem>
                                <SelectItem value="NS">Nova Scotia</SelectItem>
                                <SelectItem value="PE">Prince Edward Island</SelectItem>
                                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                                <SelectItem value="YT">Yukon</SelectItem>
                                <SelectItem value="NT">Northwest Territories</SelectItem>
                                <SelectItem value="NU">Nunavut</SelectItem>
                                <SelectItem value="National">National (Canada-wide)</SelectItem>
                                <SelectItem value="International">International</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} type="url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearFounded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Founded</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || field.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee Count</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || field.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verificationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification Type</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select verification type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="self-reported">Self-Reported</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="audited">Audited</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="impactScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impact Score (0-100)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || field.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="impactGrade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impact Grade</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select impact grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="C+">C+</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="C-">C-</SelectItem>
                                <SelectItem value="D+">D+</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                                <SelectItem value="D-">D-</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Statement</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plainTextSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plain Text Summary</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={6} />
                        </FormControl>
                        <FormDescription>
                          This plain text summary provides additional context about the organization
                          and will be stored separately from the structured data.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="btn-gradient btn-gradient-primary"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              // Preview mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Organization Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm">Name:</span> 
                        <span className="ml-1">{previewOrganization.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Sector:</span> 
                        <span className="ml-1">{previewOrganization.sector}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Region:</span> 
                        <span className="ml-1">{previewOrganization.region}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Website:</span> 
                        <span className="ml-1">{previewOrganization.website || "N/A"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Year Founded:</span> 
                        <span className="ml-1">{previewOrganization.yearFounded}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Employees:</span> 
                        <span className="ml-1">{previewOrganization.employeeCount}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Contact:</span> 
                        <div className="ml-4 text-sm">
                          <div>Email: {previewOrganization.contactEmail || "N/A"}</div>
                          <div>Phone: {previewOrganization.contactPhone || "N/A"}</div>
                          <div>Best Contact: {previewOrganization.bestContact || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Impact Assessment</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm">Impact Score:</span> 
                        <span className="ml-1">{previewOrganization.impactScore}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Impact Grade:</span> 
                        <span className="ml-1">{previewOrganization.impactGrade}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Verification Status:</span> 
                        <span className="ml-1 capitalize">{previewOrganization.verificationType}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Impact Components:</span>
                        <div className="ml-4 text-sm">
                          <div>Innovation: {previewOrganization.impactComponents.innovation}</div>
                          <div>Quality: {previewOrganization.impactComponents.quality}</div>
                          <div>Scalability: {previewOrganization.impactComponents.scalability}</div>
                          <div>Sustainability: {previewOrganization.impactComponents.sustainability}</div>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Programs:</span>
                        <span className="ml-1">{previewOrganization.programCount}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Beneficiaries Reached:</span>
                        <span className="ml-1">{previewOrganization.beneficiariesReached.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-sm">SDG Alignment:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {previewOrganization.sdgAlignment.map((sdg, index) => (
                            <span 
                              key={index}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                            >
                              {sdg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Impact Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-sm">Executive Summary:</span> 
                      <p className="mt-1 text-sm bg-neutral-50 p-3 rounded-md">
                        {previewOrganization.executiveSummary || "N/A"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-sm">Key Strengths:</span>
                        <ul className="mt-2 space-y-1">
                          {previewOrganization.keyStrengths?.map((strength, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {strength}
                            </li>
                          )) || <li className="text-sm text-neutral-500">No strengths listed</li>}
                        </ul>
                      </div>

                      <div>
                        <span className="font-medium text-sm">Areas for Development:</span>
                        <ul className="mt-2 space-y-1">
                          {previewOrganization.areasForDevelopment?.map((area, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-amber-600 mt-1">•</span>
                              {area}
                            </li>
                          )) || <li className="text-sm text-neutral-500">No areas listed</li>}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Sector Position:</span>
                      <p className="mt-1 text-sm bg-neutral-50 p-3 rounded-md">
                        {previewOrganization.sectorPosition || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Mission:</span> 
                      <p className="mt-1 text-sm">{previewOrganization.mission || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {previewOrganization.programs && previewOrganization.programs.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Programs ({previewOrganization.programs.length})</h3>
                      <div className="space-y-4">
                        {previewOrganization.programs.map((program, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{program.name}</h4>
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full capitalize">
                                {program.status}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{program.description}</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <div>
                                <span className="font-medium text-xs">Metrics:</span>
                                <p className="text-muted-foreground">{program.metrics || "N/A"}</p>
                              </div>
                              <div>
                                <span className="font-medium text-xs">Beneficiaries:</span>
                                <p className="text-muted-foreground">{program.beneficiaries || "N/A"}</p>
                              </div>
                              <div>
                                <span className="font-medium text-xs">Started:</span>
                                <p className="text-muted-foreground">{program.startYear || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {previewOrganization.metrics && previewOrganization.metrics.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Impact Metrics ({previewOrganization.metrics.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {previewOrganization.metrics.map((metric, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{metric.name}</h4>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                {metric.category}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-lg font-bold">{metric.value}</span>
                              <span className="text-sm text-muted-foreground">{metric.unit}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Year: {metric.year}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {previewOrganization.partners && previewOrganization.partners.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Partners ({previewOrganization.partners.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {previewOrganization.partners.map((partner, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-md">
                            <h4 className="font-medium">{partner.name}</h4>
                            <div className="text-sm text-muted-foreground mt-1">
                              {partner.role}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <DialogFooter>
              {isEditing ? (
                <div className="w-full flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel Editing
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancelImport}>
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="mr-2"
                  >
                    <span className="material-icons text-sm mr-1">edit</span>
                    Edit
                  </Button>
                  <Button
                    onClick={handleApproveImport}
                    disabled={importDataMutation.isPending}
                    className="btn-gradient btn-gradient-primary"
                  >
                    {importDataMutation.isPending ? "Importing..." : (
                      <>
                        <span className="material-icons text-sm mr-1">check_circle</span>
                        Approve & Save
                      </>
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DataParser;