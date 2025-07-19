import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeWithIconProps {
  text: string;
  icon?: string;
  variant?: 'success' | 'info' | 'warning' | 'error' | 'default';
  className?: string;
}

const BadgeWithIcon = ({ text, icon, variant = 'default', className }: BadgeWithIconProps) => {
  const variants = {
    success: 'bg-success text-white',
    info: 'bg-info text-white',
    warning: 'bg-warning text-white',
    error: 'bg-destructive text-white',
    default: 'bg-primary-100 text-primary-800',
  };

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variants[variant],
      className
    )}>
      {icon && <span className="material-icons text-sm mr-1">{icon}</span>}
      {text}
    </div>
  );
};

export default BadgeWithIcon;
