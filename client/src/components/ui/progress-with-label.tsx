import React from 'react';
import { MetricTooltip } from './metric-tooltip';

interface ProgressWithLabelProps {
  label: string;
  value: number;
  max: number;
  colorClass?: string;
  metric?: string; // Optional metric name for tooltip
}

const ProgressWithLabel = ({ 
  label, 
  value, 
  max, 
  colorClass = 'bg-primary-500',
  metric
}: ProgressWithLabelProps) => {
  const percentage = (value / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        {metric ? (
          <MetricTooltip metric={metric} className="inline-block">
            <span className="text-xs text-neutral-600">{label}</span>
          </MetricTooltip>
        ) : (
          <span className="text-xs text-neutral-600">{label}</span>
        )}
        <span className="text-xs font-medium text-neutral-900">{value}/{max}</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div 
          className={`${colorClass} h-2 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressWithLabel;
