import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  Layers, 
  FileText,
  Search
} from 'lucide-react';
import { Runbook } from '../types/index.ts';

interface RunbooksViewProps {
  onAskOpsMindWithContext: (question: string) => void;
}

export const RunbooksView: React.FC<RunbooksViewProps> = ({
  onAskOpsMindWithContext
}) => {
  const [runbooks, setRunbooks] = useState<Runbook[]>([]);
  const [selectedRunbook, setSelectedRunbook] = useState<Runbook | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/runbooks')
      .then(res => res.json())
      .then(data => {
        setRunbooks(data);
        if (data.length > 0) setSelectedRunbook(data[0]);
      })
      .catch(console.error);
  }, []);

  const filtered = runbooks.filter(rb => 
    rb.title.toLowerCase().includes(search.toLowerCase()) ||
    rb.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-carbon-reveal">
      {/* 1. Header (Carbon Standard) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#F4F4F4] tracking-tight">
              SRE Runbooks & Remediation Procedures
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#262626] text-[#C6C6C6] border border-[#393939]">
              {runbooks.length} PROCEDURES
            </span>
          </div>
          <p className="text-xs text-[#C6C6C6] mt-0.5">
            Standard operating procedures grounded in historical production incident resolutions.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter runbooks..."
            className="pl-8 pr-3 py-1.5 rounded-xs bg-[#262626] border border-[#393939] focus:border-[#0F62FE] text-xs font-mono text-[#F4F4F4] placeholder-[#8D8D8D] outline-none transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-[#8D8D8D] absolute left-2.5 top-2" />
        </div>
      </div>

      {/* 2. Main Grid: Runbook List (Left) + Detail (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Runbook List */}
        <div className="md:col-span-4 space-y-2">
          {filtered.map((rb) => {
            const isSelected = selectedRunbook?.id === rb.id;
            return (
              <div
                key={rb.id}
                onClick={() => setSelectedRunbook(rb)}
                className={`p-3.5 rounded-xs border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#262626] border-l-3 border-[#0F62FE] border-t-[#393939] border-r-[#393939] border-b-[#393939]'
                    : 'carbon-card hover:bg-[#262626]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#F4F4F4]">{rb.id}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#DA1E28]/15 text-[#FA4D56] border border-[#DA1E28]/40">
                    {rb.severity}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-[#F4F4F4] leading-snug">{rb.title}</h3>
                <div className="text-[11px] text-[#8D8D8D] mt-1 font-mono">{rb.service}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Runbook Details */}
        <div className="md:col-span-8">
          {selectedRunbook ? (
            <div className="carbon-panel p-5 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#393939]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#4589FF] font-bold">{selectedRunbook.id}</span>
                    <span className="text-[11px] font-mono text-[#8D8D8D]">• {selectedRunbook.service}</span>
                  </div>
                  <h2 className="text-base font-semibold text-[#F4F4F4] mt-0.5">{selectedRunbook.title}</h2>
                </div>

                <button
                  onClick={() => onAskOpsMindWithContext(`How do I execute runbook ${selectedRunbook.id} (${selectedRunbook.title}) with current Hindsight memory?`)}
                  className="px-3 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white font-medium text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Ask OpsMind</span>
                </button>
              </div>

              {/* Historical Success Rate Metric */}
              <div className="p-3 rounded-xs bg-[#1e1e1e] border border-[#393939] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[#8D8D8D]">HISTORICAL SUCCESS RATE: </span>
                  <span className="text-[#42be65] font-bold">{selectedRunbook.historicalSuccessRate}%</span>
                </div>
                <span className="text-[11px] text-[#8D8D8D]">Hindsight Empirical Score</span>
              </div>

              {/* Symptoms */}
              <div className="space-y-1.5">
                <h3 className="font-mono uppercase font-semibold text-[#8D8D8D] text-[11px]">Identified Symptoms</h3>
                <div className="space-y-1">
                  {selectedRunbook.symptoms.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#C6C6C6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FA4D56]" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic Checks */}
              <div className="space-y-1.5">
                <h3 className="font-mono uppercase font-semibold text-[#8D8D8D] text-[11px]">Diagnostic Checks</h3>
                <div className="space-y-1.5 font-mono">
                  {selectedRunbook.checks.map((c, idx) => (
                    <div key={idx} className="p-2 rounded-xs bg-[#1e1e1e] border border-[#393939] text-[#C6C6C6]">
                      <span className="text-[#4589FF] font-bold mr-1.5">{idx + 1}.</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="space-y-1.5">
                <h3 className="font-mono uppercase font-semibold text-[#42be65] text-[11px]">Recommended Mitigations</h3>
                <div className="space-y-1.5">
                  {selectedRunbook.recommendedActions.map((a, idx) => (
                    <div key={idx} className="p-2.5 rounded-xs bg-[#24a148]/10 border border-[#24a148]/30 text-[#F4F4F4]">
                      <span className="font-mono text-[#42be65] font-bold mr-1.5">•</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="carbon-panel p-12 text-center text-xs text-[#8D8D8D] font-mono">
              Select a runbook to view procedures
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
