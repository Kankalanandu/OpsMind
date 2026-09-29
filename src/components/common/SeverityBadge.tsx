import React from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { Severity } from '../../types/index.ts';

interface SeverityBadgeProps {
  severity: Severity | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ 
  severity, 
  size = 'md' 
}) => {
  const norm = severity.toUpperCase();
  
  if (norm === 'SEV-1' || norm === 'CRITICAL') {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-sm border ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
        } bg-[#da1e28]/15 text-[#fa4d56] border-[#da1e28]/40`}
      >
        <AlertOctagon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>SEV-1 Critical</span>
      </span>
    );
  }

  if (norm === 'SEV-2' || norm === 'HIGH') {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-sm border ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
        } bg-[#ff832b]/15 text-[#ff832b] border-[#ff832b]/40`}
      >
        <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>SEV-2 High</span>
      </span>
    );
  }

  if (norm === 'SEV-3' || norm === 'MEDIUM') {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-sm border ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
        } bg-[#f1c21b]/15 text-[#f1c21b] border-[#f1c21b]/40`}
      >
        <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>SEV-3 Medium</span>
      </span>
    );
  }

  if (norm === 'SEV-4' || norm === 'LOW') {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-sm border ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
        } bg-[#24a148]/15 text-[#42be65] border-[#24a148]/40`}
      >
        <Info className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>SEV-4 Low</span>
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-sm border ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs'
      } bg-[#0f62fe]/15 text-[#78a9ff] border-[#0f62fe]/40`}
    >
      <Info className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>Informational</span>
    </span>
  );
};
