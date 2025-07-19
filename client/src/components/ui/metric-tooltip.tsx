import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from '@/lib/utils';

// Type definition for breakdown tooltip
type BreakdownTooltip = {
  title: string;
  [key: string]: string;
};

// Dictionary of metric explanations
export const metricExplanations: Record<string, string | BreakdownTooltip> = {
  // Impact metrics
  impactScore: "A comprehensive score (0-100) that combines all impact dimensions including reach, effectiveness, social ROI, governance, and reporting quality.",
  impactGrade: "Letter grade representing impact quality from F (lowest) to A+ (highest), derived from the Impact Score.",
  yearlyChange: "Percentage change in Impact Score compared to the previous year.",
  socialROI: "Social Return on Investment - the estimated social value created for each dollar invested.",
  verificationType: "Level of verification: Self-reported (organization's own reporting), Verified (by third-party), or Audited (comprehensive external audit).",
  
  // Organization metrics
  reportingQuality: "Assesses the completeness, transparency and quality of the organization's impact reporting (scored 0-20).",
  reach: "Evaluates the organization's scale and breadth of impact relative to its sector (scored 0-20).",
  outcomeEffectiveness: "Measures the organization's success in achieving its stated goals and outcomes (scored 0-20).",
  transparencyGovernance: "Rates the organization's operational transparency and governance practices (scored 0-20).",
  programAllocation: "Percentage of funds allocated directly to programs versus administrative expenses.",
  
  // Solution metrics  
  effectiveness: "A score (0-100) indicating how effectively the solution achieves its intended outcomes based on evidence.",
  peopleReached: "The number of individuals directly benefiting from the program or initiative.",
  
  // Combined impact breakdown tooltip
  impactBreakdown: {
    title: "Impact IQ Score Breakdown",
    reportingQuality: "Reporting Quality (0-20): Assesses the completeness, transparency and quality of the organization's impact reporting.",
    reach: "Reach (0-20): Evaluates the organization's scale and breadth of impact relative to its sector.",
    socialROI: "Social ROI (0-20): Measures the social return on investment and financial efficiency.",
    outcomeEffectiveness: "Outcome Effectiveness (0-20): Measures the organization's success in achieving its stated goals and outcomes.",
    transparencyGovernance: "Transparency & Governance (0-20): Rates the organization's operational transparency and governance practices."
  }
};

interface MetricTooltipProps {
  metric: keyof typeof metricExplanations;
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function MetricTooltip({ 
  metric, 
  children, 
  className,
  iconClassName
}: MetricTooltipProps) {
  const explanation = metricExplanations[metric];
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-1", className)}>
            {children}
            <Info className={cn("h-3.5 w-3.5 text-muted-foreground/80 cursor-help", iconClassName)} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3">
          {typeof explanation === 'string' ? (
            <p className="text-sm">{explanation}</p>
          ) : (
            <div className="space-y-3">
              <h5 className="font-medium text-sm">{explanation.title}</h5>
              <ul className="space-y-2 text-sm list-none">
                {Object.entries(explanation)
                  .filter(([key]) => key !== 'title')
                  .map(([key, text]) => (
                    <li key={key} className="text-xs">
                      <p><strong>{text.split(':')[0]}:</strong> {text.split(':')[1]}</p>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}