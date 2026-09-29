import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  BrainCircuit, 
  RotateCcw,
  FileText,
  Clock,
  Layers,
  Database,
  ArrowRight,
  GitCommit,
  ShieldAlert,
  Server,
  Activity,
  Check
} from 'lucide-react';
import { HistoricalMemory, Incident, IncidentInvestigation } from '../types/index.ts';
import { SeverityBadge } from './common/SeverityBadge.tsx';

interface IncidentDetailViewProps {
  incident: Incident;
  onBack: () => void;
  onInvestigate: (id: string) => Promise<IncidentInvestigation>;
  onResolve: (id: string, action: string) => Promise<any>;
  onLearn: (id: string) => Promise<any>;
  onOpenPostMortem: (id: string) => void;
  onAskOpsMindWithContext: (question: string) => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  incident,
  onBack,
  onInvestigate,
  onResolve,
  onLearn,
  onOpenPostMortem,
  onAskOpsMindWithContext
}) => {
  const [investigating, setInvestigating] = useState(false);
  const [investigationData, setInvestigationData] = useState<IncidentInvestigation | null>(
    incident.investigation || null
  );
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<HistoricalMemory | null>(null);
  const [resolving, setResolving] = useState(false);
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  useEffect(() => {
    if (!investigationData && incident.status !== 'RESOLVED') {
      handleStartInvestigation();
    }
  }, [incident.id]);

  const handleStartInvestigation = async () => {
    setInvestigating(true);
    try {
      const result = await onInvestigate(incident.id);
      setInvestigationData(result);
    } catch (err) {
      console.error('Investigation error:', err);
    } finally {
      setInvestigating(false);
    }
  };

  const handleActionClick = async (actionName: string) => {
    setResolving(true);
    try {
      await onResolve(incident.id, actionName);
      await onLearn(incident.id);
    } catch (err) {
      console.error('Resolve error:', err);
    } finally {
      setResolving(false);
    }
  };

  const isResolved = incident.status === 'RESOLVED';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. SECTION 14: INCIDENT COMMAND HEADER */}
      <div className="carbon-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xs text-[#C6C6C6] hover:text-[#F4F4F4] hover:bg-[#333333] border border-[#393939] transition-colors shrink-0"
            title="Return to Incidents Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#F4F4F4] tracking-wide">
                {incident.id}
              </span>
              <span className="text-[#525252]">/</span>
              <SeverityBadge severity={incident.severity} size="sm" />
              <span className="text-[#525252]">/</span>
              <span className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-xs border ${
                isResolved 
                  ? 'bg-[#24a148]/15 text-[#42be65] border-[#24a148]/40'
                  : 'bg-[#0f62fe]/15 text-[#78a9ff] border-[#0f62fe]/40'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{incident.status}</span>
              </span>
              <span className="text-[#525252]">/</span>
              <span className="font-mono text-xs text-[#C6C6C6]">
                Service: <strong className="text-[#F4F4F4]">{incident.service}</strong> (deploy: {incident.deploymentVersion})
              </span>
            </div>

            <h1 className="text-lg font-semibold text-[#F4F4F4]">
              {incident.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          {isResolved ? (
            <button
              onClick={() => onOpenPostMortem(incident.id)}
              className="px-3.5 py-1.5 rounded-xs bg-[#24a148] hover:bg-[#198038] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Post-Mortem</span>
            </button>
          ) : (
            <button
              onClick={handleStartInvestigation}
              disabled={investigating}
              className="px-3.5 py-1.5 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#F4F4F4] border border-[#393939] text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${investigating ? 'animate-spin' : ''}`} />
              <span>Re-analyze Telemetry</span>
            </button>
          )}

          <button
            onClick={() => onAskOpsMindWithContext(`What should I investigate about ${incident.id}?`)}
            className="px-3.5 py-1.5 rounded-xs bg-[#262626] hover:bg-[#333333] text-[#78A9FF] border border-[#393939] text-xs font-mono transition-colors"
          >
            Ask OpsMind →
          </button>
        </div>
      </div>

      {/* 2. RESOLUTION BANNER (If Resolved) */}
      {isResolved && (
        <div className="p-3 bg-[#1e261f] border border-[#24a148]/50 rounded-xs flex items-center justify-between text-xs font-mono animate-carbon-reveal">
          <div className="flex items-center gap-2 text-[#42be65]">
            <CheckCircle2 className="w-4 h-4 text-[#24a148]" />
            <span className="font-bold">RESOLVED ({incident.resolution?.duration || '8m 42s'})</span>
            <span className="text-[#C6C6C6]">• Action: {incident.resolution?.actionTaken}</span>
          </div>
          <span className="text-[11px] text-[#42be65] bg-[#24a148]/20 px-2 py-0.5 rounded-xs">
            ✓ Learned & Retained in Hindsight
          </span>
        </div>
      )}

      {/* 3. CURRENT TELEMETRY SIGNALS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="carbon-card p-3 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">P99 LATENCY</div>
          <div className={`text-xl font-bold ${incident.signals.latency > 2 ? 'text-[#FA4D56]' : 'text-[#F4F4F4]'}`}>
            {incident.signals.latency}s
          </div>
          <div className="text-[10px] text-[#8D8D8D]">Threshold: 1.2s SLA</div>
        </div>

        <div className="carbon-card p-3 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">ERROR RATE</div>
          <div className={`text-xl font-bold ${incident.signals.errorRate > 5 ? 'text-[#FA4D56]' : 'text-[#F4F4F4]'}`}>
            {incident.signals.errorRate}%
          </div>
          <div className="text-[10px] text-[#8D8D8D]">HTTP 502 / 504 surges</div>
        </div>

        <div className="carbon-card p-3 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">DB POOL SATURATION</div>
          <div className={`text-xl font-bold ${incident.signals.dbConnections > 80 ? 'text-[#FA4D56]' : 'text-[#F4F4F4]'}`}>
            {incident.signals.dbConnections}%
          </div>
          <div className="text-[10px] text-[#8D8D8D]">Active / max pool leases</div>
        </div>

        <div className="carbon-card p-3 space-y-1">
          <div className="text-[10px] text-[#8D8D8D] uppercase tracking-wider">FLEET CPU LOAD</div>
          <div className="text-xl font-bold text-[#F4F4F4]">
            {incident.signals.cpuUtilization}%
          </div>
          <div className="text-[10px] text-[#8D8D8D]">6 pods on us-east-1a/b</div>
        </div>
      </div>

      {/* 4. MAIN 2-COLUMN COMMAND CENTER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: AI INVESTIGATION & RECOMMENDATION (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* SECTION 15: AI INVESTIGATION PANEL */}
          <div className="carbon-panel border-l-4 border-l-[#4589FF] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#393939]">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#4589FF]" />
                <span className="text-xs font-bold text-[#F4F4F4] font-mono uppercase tracking-wider">
                  ✦ OPSMIND INVESTIGATION
                </span>
              </div>
              <div className="flex items-center gap-2">
                {investigationData?.hindsightTrace?.isLiveHindsight && (
                  <span className="text-[10px] font-mono text-[#42be65] bg-[#24a148]/15 px-2 py-0.5 rounded-xs border border-[#24a148]/30 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#24a148] animate-pulse" />
                    <span>Live Hindsight ({investigationData.hindsightTrace.latencyMs}ms)</span>
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#78A9FF] bg-[#0F62FE]/15 px-2 py-0.5 rounded-xs border border-[#0F62FE]/30">
                  Confidence: {investigationData?.confidence || '94%'}
                </span>
              </div>
            </div>

            {/* SECTION 30: INVESTIGATION ANIMATION (Staggered Dots, Controlled, No Spinners) */}
            {investigating ? (
              <div className="py-10 text-center space-y-2 font-mono text-xs text-[#C6C6C6]">
                <div className="flex items-center justify-center gap-1.5 text-[#4589FF] text-base">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-1">•</span>
                  <span className="animate-pulse delay-2">•</span>
                </div>
                <div>OpsMind is correlating real-time telemetry against Hindsight memory bank...</div>
              </div>
            ) : investigationData ? (
              <div className="space-y-4 text-xs animate-carbon-reveal">
                {/* 1. Finding */}
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D] font-semibold">
                    Finding
                  </div>
                  <div className="p-3 bg-[#1c1c1c] border border-[#393939] rounded-xs text-[#F4F4F4] leading-relaxed font-sans text-sm">
                    {investigationData.summary}
                  </div>
                </div>

                {/* 2. Evidence Findings (Progressive Sequence) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D] font-semibold">
                    Evidence Signals
                  </div>
                  <div className="space-y-1 font-mono text-[11px]">
                    {investigationData.findings.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 bg-[#222222] p-2 rounded-xs border border-[#333333] text-[#C6C6C6]">
                        <span className="text-[#4589FF] font-bold">[{i + 1}]</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SECTION 16: RECOMMENDATION COMPONENT */}
                <div className="p-4 bg-[#1f2533] border border-[#4589FF]/40 rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#78A9FF] font-bold">
                      AI RECOMMENDATION
                    </span>
                    <span className="text-[11px] font-mono text-[#42be65] font-semibold">
                      94% Confidence
                    </span>
                  </div>

                  <div className="text-base font-semibold text-white">
                    {investigationData.recommendedAction}
                  </div>

                  <div className="text-xs text-[#C6C6C6] leading-relaxed">
                    <strong className="text-[#F4F4F4] font-medium">WHY? </strong>
                    {investigationData.why}
                  </div>

                  <div className="text-[11px] font-mono text-[#8D8D8D] flex flex-wrap items-center justify-between gap-2">
                    <span>
                      SUPPORTED BY: {investigationData.historicalMatches?.length || 2} historical incidents in memory bank ({investigationData.hindsightTrace?.bankId || 'OpsMind'})
                    </span>
                    {investigationData.hindsightTrace?.isLiveHindsight && (
                      <span className="text-[#42be65]">✓ Verified against live Vectorize bank</span>
                    )}
                  </div>

                  {/* Primary & Secondary Actions */}
                  {!isResolved && (
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleActionClick(`Rollback deployment ${incident.deploymentVersion}`)}
                        disabled={resolving}
                        className="px-4 py-2 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] disabled:opacity-50 text-white font-mono text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {resolving ? 'Executing Rollback...' : `Rollback ${incident.deploymentVersion}`}
                      </button>

                      <button
                        onClick={() => setDiffModalOpen(true)}
                        disabled={resolving}
                        className="px-3.5 py-2 rounded-xs bg-transparent hover:bg-[#333333] text-[#F4F4F4] border border-[#525252] text-xs font-mono transition-colors"
                      >
                        Inspect Git Diff
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. SECTION 45: TRUST REASONING BREAKDOWN */}
                <div className="p-3 bg-[#1e1e1e] border border-[#393939] rounded-xs space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8D8D8D]">
                    Trust Reasoning Chain
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-[#262626] rounded-xs">
                      <div className="text-[#8D8D8D] text-[9px] uppercase">1. OBSERVED</div>
                      <div className="text-[#F4F4F4] font-semibold mt-0.5">Latency &gt; 5.1s</div>
                    </div>
                    <div className="p-2 bg-[#262626] rounded-xs">
                      <div className="text-[#8D8D8D] text-[9px] uppercase">2. RECALLED</div>
                      <div className="text-[#4589FF] font-semibold mt-0.5">INC-104 pattern</div>
                    </div>
                    <div className="p-2 bg-[#262626] rounded-xs">
                      <div className="text-[#8D8D8D] text-[9px] uppercase">3. CORRELATED</div>
                      <div className="text-[#F4F4F4] font-semibold mt-0.5">Canary pool leak</div>
                    </div>
                    <div className="p-2 bg-[#262626] rounded-xs">
                      <div className="text-[#8D8D8D] text-[9px] uppercase">4. ACTION</div>
                      <div className="text-[#42be65] font-semibold mt-0.5">Direct rollback</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT COLUMN: EVIDENCE UI & HINDSIGHT MEMORY (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {/* SECTION 17: EVIDENCE UI (Clickable, Highlights with Blue Left Border) */}
          <div className="carbon-panel p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#393939]">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F4F4F4]">
                EVIDENCE (ORGANIZATIONAL MEMORY)
              </span>
              <span className="text-[11px] font-mono text-[#8D8D8D]">
                {investigationData?.historicalMatches.length || 0} Matches Found
              </span>
            </div>

            <div className="space-y-2">
              {investigationData?.historicalMatches.map((mem) => {
                const isSelected = selectedEvidenceId === mem.id;
                return (
                  <div
                    key={mem.id}
                    onClick={() => {
                      setSelectedEvidenceId(isSelected ? null : mem.id);
                      setSelectedMemory(mem);
                    }}
                    className={`p-3 rounded-xs border cursor-pointer transition-colors space-y-1.5 ${
                      isSelected
                        ? 'bg-[#1f2533] border-[#4589FF] border-l-4 border-l-[#0F62FE]'
                        : 'bg-[#1e1e1e] hover:bg-[#262626] border-[#393939]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#4589FF]">{mem.incidentId}</span>
                        <span className="text-[10px] text-[#8D8D8D]">{mem.service}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#4589FF]/15 text-[#78A9FF] border border-[#4589FF]/30 font-bold">
                        {mem.similarity}% match
                      </span>
                    </div>

                    <div className="text-xs font-medium text-[#F4F4F4]">
                      {mem.title}
                    </div>

                    <div className="text-[11px] text-[#C6C6C6]">
                      <span className="text-[#8D8D8D] font-mono">Root Cause: </span>
                      {mem.rootCause}
                    </div>

                    <div className="text-[11px] font-mono text-[#42be65] flex items-center justify-between pt-1 border-t border-[#333333]">
                      <span>Resolution: {mem.successfulAction}</span>
                      <span className="text-[#8D8D8D] hover:text-[#F4F4F4]">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 18: HINDSIGHT MEMORY LIFECYCLE VISUALIZATION */}
          <div className="carbon-panel p-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#F4F4F4] pb-2 border-b border-[#393939]">
              HINDSIGHT KNOWLEDGE CONTINUUM
            </div>

            <div className="p-3 bg-[#1e1e1e] border border-[#393939] rounded-xs space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#C6C6C6]">
                  <Database className="w-3.5 h-3.5 text-[#4589FF]" />
                  <span>Memory Continuum:</span>
                </div>
                <span className="text-[#42be65]">Persistent Synapses</span>
              </div>

              {/* 3 visually connected stages: RETAIN -> MEMORY -> RECALL -> REFLECT -> RECOMMENDATION */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 p-1.5 bg-[#262626] rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#42be65]" />
                  <span className="text-[#8D8D8D] uppercase font-bold">RETAIN:</span>
                  <span className="text-[#F4F4F4]">INC-104 post-mortem written to bank</span>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-[#262626] rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4589FF]" />
                  <span className="text-[#8D8D8D] uppercase font-bold">RECALL:</span>
                  <span className="text-[#F4F4F4]">Matched 94% similarity on connection pool</span>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-[#262626] rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#78A9FF]" />
                  <span className="text-[#8D8D8D] uppercase font-bold">REFLECT:</span>
                  <span className="text-[#F4F4F4]">Bypasses pod restarts; triggers direct rollback</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GIT DIFF MODAL */}
      {diffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#262626] border border-[#525252] rounded-xs max-w-2xl w-full p-5 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#393939]">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-[#4589FF]" />
                <span className="font-bold text-[#F4F4F4]">Deployment Diff: payment-api:{incident.deploymentVersion}</span>
              </div>
              <button onClick={() => setDiffModalOpen(false)} className="text-[#8D8D8D] hover:text-[#F4F4F4]">✕</button>
            </div>

            <div className="bg-[#161616] p-3 rounded-xs border border-[#393939] space-y-1 font-mono text-[11px] overflow-x-auto">
              <div className="text-[#8D8D8D]">diff --git a/src/webhook.ts b/src/webhook.ts</div>
              <div className="text-[#8D8D8D]">--- a/src/webhook.ts</div>
              <div className="text-[#8D8D8D]">+++ b/src/webhook.ts</div>
              <div className="text-[#4589FF]">@@ -48,7 +48,9 @@ export async function handleWebhook(req)</div>
              <div className="text-[#FA4D56] bg-[#DA1E28]/15 px-1">-  const client = await pool.connect(); // Leaked on err</div>
              <div className="text-[#42be65] bg-[#24a148]/15 px-1">+  const client = await pool.connect();</div>
              <div className="text-[#42be65] bg-[#24a148]/15 px-1">+  try &#123; await process(req); &#125; finally &#123; client.release(); &#125;</div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#8D8D8D]">Detected cause: unreleased database client in webhook error handler</span>
              <button
                onClick={() => setDiffModalOpen(false)}
                className="px-3 py-1.5 bg-[#333333] hover:bg-[#393939] text-[#F4F4F4] rounded-xs text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
