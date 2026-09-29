import React from 'react';
import { 
  ShieldAlert, 
  Database,
  BrainCircuit,
  CheckCircle2
} from 'lucide-react';
import { LearningEvent, HindsightStatus } from '../types/index.ts';

interface LearningCenterViewProps {
  learnings: LearningEvent[];
  onSelectIncident?: (id: string) => void;
  hindsightStatus?: HindsightStatus | null;
}

export const LearningCenterView: React.FC<LearningCenterViewProps> = ({
  learnings,
  hindsightStatus
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. Page Header (Carbon Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#F4F4F4] tracking-tight">
              Organizational Learning Center
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#4589FF]/15 text-[#78A9FF] border border-[#4589FF]/40">
              HINDSIGHT PERSISTENT RETENTION
            </span>
          </div>
          <p className="text-xs text-[#C6C6C6] mt-0.5">
            Every resolved production incident synthesizes structured knowledge units to inoculate systems against recurring failures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#C6C6C6] bg-[#262626] border border-[#393939] px-3 py-1.5 rounded-xs self-start sm:self-center">
          <Database className="w-3.5 h-3.5 text-[#4589FF]" />
          <span>Bank: {hindsightStatus?.bankId || 'OpsMind'}</span>
        </div>
      </div>

      {/* 2. Pattern Detection Alert Banner (Carbon Standard) */}
      <div className="carbon-panel p-4 border-l-4 border-l-[#F1C21B] space-y-2">
        <div className="flex items-center gap-2 text-[#F1C21B] font-mono text-xs font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-[#F1C21B]" />
          <span>Recurring Systemic Pattern Detected</span>
        </div>
        <h2 className="text-sm font-semibold text-[#F4F4F4] leading-snug">
          "3 incidents in the last 30 days involved connection pool saturation following canary deployments."
        </h2>
        <p className="text-xs text-[#C6C6C6] leading-relaxed">
          OpsMind correlated INC-104, INC-087, and INC-137. Historical resolutions consistently prove that replica scaling accelerates pool exhaustion. Automated recommendation rule synthesized: suggest instant rollback or code hotfix over pod restarts.
        </p>
      </div>

      {/* 3. Learning Feed Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono border-b border-[#393939] pb-2">
          <span className="font-semibold text-[#F4F4F4] uppercase tracking-wider">
            Validated Organizational Memory Feed ({learnings.length})
          </span>
          <span className="text-[#8D8D8D]">Chronologically Indexed</span>
        </div>

        <div className="space-y-3">
          {learnings.map((item) => (
            <div
              key={item.id}
              className="carbon-panel p-4 space-y-3 border-l-2 border-l-[#0F62FE]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-xs bg-[#4589FF]/15 border border-[#4589FF]/40 flex items-center justify-center text-[#78A9FF] shrink-0">
                    <BrainCircuit className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#78A9FF] bg-[#4589FF]/10 border border-[#4589FF]/30 px-1.5 py-0.2 rounded-xs font-bold mr-2">
                      NEW MEMORY
                    </span>
                    <span className="text-sm font-semibold text-[#F4F4F4]">{item.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs font-mono">
                  <span className="text-[#C6C6C6] font-semibold">{item.incidentId}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-xs bg-[#24A148]/15 text-[#42be65] border border-[#24A148]/40 font-medium">
                    Confidence: {item.confidence}
                  </span>
                </div>
              </div>

              {/* Lesson body (Carbon AI Callout) */}
              <div className="p-3 rounded-xs bg-[#1f2533] border border-[#4589FF]/30 text-xs text-[#EDF5FF] leading-relaxed">
                <span className="text-[#78A9FF] font-semibold mr-1">Lesson:</span>
                <span>"{item.lesson}"</span>
              </div>

              {/* Metadata row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-mono text-[#C6C6C6] pt-1 border-t border-[#393939]">
                <div>
                  <span className="text-[#8D8D8D] uppercase text-[10px]">Root Cause: </span>
                  <span className="text-[#F4F4F4]">{item.rootCause}</span>
                </div>
                <div>
                  <span className="text-[#42be65] uppercase text-[10px]">Fix: </span>
                  <span className="text-[#F4F4F4]">{item.successfulAction}</span>
                </div>
                <div className="md:text-right">
                  <span className="text-[#8D8D8D] text-[10px]">Source: </span>
                  <span className="text-[#C6C6C6]">{item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
