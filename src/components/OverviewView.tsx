import React from 'react';
import { 
  ArrowRight, 
  Sparkles,
  TrendingDown,
  Database,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { Incident, LearningEvent } from '../types/index.ts';
import { SeverityBadge } from './common/SeverityBadge.tsx';

interface OverviewViewProps {
  incidents: Incident[];
  learnings: LearningEvent[];
  onSelectIncident: (id: string) => void;
  onNavigateTab: (tab: any) => void;
  onRunDemo1: () => void;
  onRunDemo2: () => void;
  onOpenJuryMode: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  incidents,
  learnings,
  onSelectIncident,
  onNavigateTab,
  onRunDemo1,
  onRunDemo2,
  onOpenJuryMode
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = activeIncidents.filter(i => i.severity === 'SEV-1').length;
  const investigatingCount = activeIncidents.filter(i => i.status === 'INVESTIGATING').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-carbon-reveal">
      {/* 1. Page Header (Carbon Standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#F4F4F4] tracking-tight">
              Operations Overview
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#24a148]/15 text-[#42be65] border border-[#24a148]/40">
              HEALTHY RESILIENCE
            </span>
          </div>
          <p className="text-xs text-[#C6C6C6] mt-0.5">
            Production system health, active incident response, and persistent organizational learning.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onOpenJuryMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#78A9FF] border border-[#393939] text-xs font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4589FF]" />
            <span>Jury Walkthrough (60s)</span>
          </button>

          <button
            onClick={() => onNavigateTab('incidents')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] text-white text-xs font-medium transition-colors"
          >
            <span>All Incidents</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. TWO-INCIDENT DEMO VISUAL FLOW (Section 44) */}
      <div className="carbon-panel p-4 border-l-4 border-l-[#0F62FE] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#4589FF]">
              Organizational Learning Loop Demo
            </span>
            <span className="text-xs text-[#8D8D8D] hidden sm:inline">
              How OpsMind prevents repeat production failures
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8D8D8D]">Two-Incident Flow</span>
        </div>

        {/* The 2-Stage Interactive Comparative Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* STEP 1: Incident 1 (First Time Occurrence) */}
          <div 
            onClick={onRunDemo1}
            className="p-3 bg-[#1e1e1e] hover:bg-[#262626] border border-[#393939] hover:border-[#525252] rounded-xs cursor-pointer transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8D8D8D] group-hover:text-[#F4F4F4]">
                STEP 1 • FIRST-TIME INCIDENT
              </span>
              <span className="text-xs font-mono font-bold text-[#F4F4F4]">INC-104</span>
            </div>

            <div className="text-xs font-semibold text-[#F4F4F4]">
              Payment API Latency Spike
            </div>

            <div className="text-[11px] text-[#C6C6C6] leading-relaxed">
              Deployment introduced connection leak → Latency exceeded 5s → Rollback applied → Incident resolved → <span className="text-[#42be65] font-mono">Hindsight RETAIN</span>.
            </div>

            <div className="pt-1.5 border-t border-[#333333] flex items-center justify-between text-[11px] font-mono text-[#42be65]">
              <span>✓ Stored to Organizational Memory</span>
              <span className="text-[#8D8D8D] group-hover:text-[#F4F4F4]">Inspect INC-104 →</span>
            </div>
          </div>

          {/* STEP 2: Incident 2 (Learned Recall Occurrence) */}
          <div 
            onClick={onRunDemo2}
            className="p-3 bg-[#1a2233] hover:bg-[#202b40] border border-[#4589FF]/40 rounded-xs cursor-pointer transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#78A9FF] font-semibold">
                STEP 2 • PERSISTENT RECALL & REFLECTION
              </span>
              <span className="text-xs font-mono font-bold text-[#4589FF]">INC-137</span>
            </div>

            <div className="text-xs font-semibold text-[#F4F4F4]">
              Payment API Repeat Symptoms
            </div>

            <div className="text-[11px] text-[#C6C6C6] leading-relaxed">
              Same symptom pattern detected → <span className="text-[#78A9FF] font-mono">Hindsight RECALL</span> matches INC-104 with 94% similarity → Immediate rollback recommended.
            </div>

            <div className="pt-1.5 border-t border-[#263550] flex items-center justify-between text-[11px] font-mono text-[#78A9FF]">
              <span>✓ Bypassed Failed Troubleshooting</span>
              <span className="text-[#C6C6C6] group-hover:text-white">Run Investigation →</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. METRICS (Section 12: Large Number, Small Label, Supporting Metadata) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="carbon-card p-3.5 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D]">
            Active Incidents
          </div>
          <div className="text-2xl font-bold font-mono text-[#F4F4F4]">
            {activeIncidents.length < 10 ? `0${activeIncidents.length}` : activeIncidents.length}
          </div>
          <div className="text-[11px] font-mono text-[#FA4D56] flex items-center gap-1">
            <span>{criticalCount} Critical SEV-1</span>
            <span className="text-[#6F6F6F]">/ {investigatingCount} Investigating</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('analytics')}
          className="carbon-card p-3.5 space-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D]">
              Mean Time to Resolve
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8D8D8D] group-hover:text-[#4589FF] transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#42be65]">
            8m 42s
          </div>
          <div className="text-[11px] font-mono text-[#42be65] flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Down from 24.5m baseline (-64%)</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('memory')}
          className="carbon-card p-3.5 space-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D]">
              Memories in Bank
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8D8D8D] group-hover:text-[#4589FF] transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F4F4F4]">
            284
          </div>
          <div className="text-[11px] font-mono text-[#C6C6C6]">
            Semantic index in Hindsight
          </div>
        </div>

        <div 
          onClick={() => onNavigateTab('learning')}
          className="carbon-card p-3.5 space-y-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D]">
              Learnings Retained
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8D8D8D] group-hover:text-[#4589FF] transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#78A9FF]">
            {learnings.length}
          </div>
          <div className="text-[11px] font-mono text-[#C6C6C6]">
            100% post-mortems retained
          </div>
        </div>
      </div>

      {/* 4. ACTIVE INCIDENTS (Section 13: Tabular, Dense, High-Contrast Rows) */}
      <div className="carbon-panel overflow-hidden">
        <div className="p-3 border-b border-[#393939] flex items-center justify-between bg-[#222222]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#F4F4F4] uppercase font-mono tracking-wider">
              Active Incident Command Table ({activeIncidents.length})
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8D8D8D]">
            Real-time Telemetry & OpsMind Reasoning
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1c1c1c] border-b border-[#393939] text-[#8D8D8D] font-mono text-[11px]">
                <th className="py-2.5 px-4 font-medium uppercase">Severity</th>
                <th className="py-2.5 px-4 font-medium uppercase">Incident</th>
                <th className="py-2.5 px-4 font-medium uppercase">Service</th>
                <th className="py-2.5 px-4 font-medium uppercase">Status</th>
                <th className="py-2.5 px-4 font-medium uppercase">Telemetry</th>
                <th className="py-2.5 px-4 font-medium uppercase">OpsMind Reason</th>
                <th className="py-2.5 px-4 font-medium uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#393939]">
              {activeIncidents.map((inc) => (
                <tr 
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="carbon-table-row cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono font-semibold text-[#F4F4F4] group-hover:text-[#4589FF] transition-colors">
                      {inc.id}
                    </div>
                    <div className="text-[11px] text-[#C6C6C6] max-w-xs truncate">
                      {inc.title}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-xs text-[#C6C6C6]">
                    <div>{inc.service}</div>
                    <div className="text-[10px] text-[#8D8D8D]">deploy: {inc.deploymentVersion}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded-xs bg-[#393939] text-[#F4F4F4]">
                      <Clock className="w-3 h-3 text-[#8D8D8D]" />
                      <span>{inc.status}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[#8D8D8D]">LATENCY: </span>
                        <span className={inc.signals.latency > 2 ? 'text-[#FA4D56] font-bold' : 'text-[#F4F4F4]'}>
                          {inc.signals.latency}s
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8D8D8D]">ERR: </span>
                        <span className={inc.signals.errorRate > 5 ? 'text-[#FA4D56] font-bold' : 'text-[#F4F4F4]'}>
                          {inc.signals.errorRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8D8D8D]">POOL: </span>
                        <span className={inc.signals.dbConnections > 80 ? 'text-[#FA4D56] font-bold' : 'text-[#F4F4F4]'}>
                          {inc.signals.dbConnections}%
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#78A9FF]">
                    {inc.id === 'INC-137' ? (
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#4589FF]" />
                        <span>94% match to INC-104</span>
                      </span>
                    ) : (
                      <span className="text-[#8D8D8D]">Analyzing telemetry</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident(inc.id);
                      }}
                      className="px-2.5 py-1 rounded-xs bg-[#262626] hover:bg-[#0F62FE] text-[#F4F4F4] hover:text-white border border-[#393939] hover:border-transparent text-xs font-mono transition-colors"
                    >
                      Investigate →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. 2-Column: AI Systemic Patterns & Recent Organizational Memory Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: AI Recurring Patterns (Section 18, 45) */}
        <div className="carbon-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#393939]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4589FF]" />
              <span className="text-xs font-semibold text-[#F4F4F4] font-mono uppercase tracking-wider">
                Correlated Systemic Patterns
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#42be65]">
              3 Signatures Active
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-[#1e1e1e] border border-[#393939] rounded-xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F4F4F4]">Connection Pool Saturation</span>
                <span className="text-[11px] font-mono text-[#FA4D56] bg-[#DA1E28]/15 px-1.5 py-0.2 rounded-xs border border-[#DA1E28]/30">
                  CRITICAL
                </span>
              </div>
              <p className="text-[11px] text-[#C6C6C6] leading-relaxed">
                Correlated across INC-104 & INC-137. Scaling pods exacerbates pool exhaustion. Automated recommendation: direct deployment rollback.
              </p>
            </div>

            <div className="p-3 bg-[#1e1e1e] border border-[#393939] rounded-xs space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F4F4F4]">PgBouncer Client Timeout Drift</span>
                <span className="text-[11px] font-mono text-[#FF832B] bg-[#FF832B]/15 px-1.5 py-0.2 rounded-xs border border-[#FF832B]/30">
                  HIGH
                </span>
              </div>
              <p className="text-[11px] text-[#C6C6C6] leading-relaxed">
                Observed in Database Cluster under peak write bursts. Correlated fix: transaction pooling mode migration.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Recent Organizational Memory Feed */}
        <div className="carbon-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#393939]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4589FF]" />
              <span className="text-xs font-semibold text-[#F4F4F4] font-mono uppercase tracking-wider">
                Recent Organizational Memory
              </span>
            </div>
            <button 
              onClick={() => onNavigateTab('memory')}
              className="text-[11px] font-mono text-[#4589FF] hover:underline"
            >
              Search Bank →
            </button>
          </div>

          <div className="space-y-2">
            {learnings.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                className="p-3 bg-[#1e1e1e] border border-[#393939] rounded-xs space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[#F4F4F4]">{item.service}</span>
                  <span className="text-[10px] text-[#8D8D8D]">{item.incidentId}</span>
                </div>
                <div className="text-[11px] text-[#C6C6C6] italic">
                  "{item.lesson}"
                </div>
                <div className="text-[10px] font-mono text-[#42be65] pt-1">
                  Validated Fix: {item.successfulAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
