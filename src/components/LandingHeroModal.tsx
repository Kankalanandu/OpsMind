import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Database, 
  ShieldCheck, 
  X
} from 'lucide-react';

interface LandingHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsole: () => void;
  onExploreMemory: () => void;
  onLaunchJuryMode: () => void;
}

export const LandingHeroModal: React.FC<LandingHeroModalProps> = ({
  isOpen,
  onClose,
  onOpenConsole,
  onExploreMemory,
  onLaunchJuryMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 md:p-8 animate-carbon-reveal select-none overflow-y-auto">
      <div className="max-w-3xl w-full bg-[#161616] border border-[#525252] rounded-xs p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xs bg-[#262626] border border-[#393939] hover:border-[#525252] text-[#C6C6C6] hover:text-[#F4F4F4] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand & Badge */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-xs bg-[#0F62FE]/15 border border-[#0F62FE]/40 text-[#78A9FF] text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE]" />
            <span>HINDSIGHT-POWERED AI SRE COMMAND CENTER</span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#0F62FE] flex items-center justify-center text-white">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-[#F4F4F4] font-mono">
              OPSMIND
            </h1>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-[#F4F4F4] leading-snug max-w-xl mx-auto">
            "Your production systems remember.<br />Now your incident response agent does too."
          </h2>

          <p className="text-xs text-[#C6C6C6] max-w-xl mx-auto leading-relaxed">
            An enterprise AI incident-response command center that continuously learns from production failures and converts operational history into permanent organizational intelligence.
          </p>
        </div>

        {/* 3 Capability Cards: Observe, Recall, Learn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          {/* Card 1: Observe */}
          <div className="carbon-panel p-4 space-y-2 border-l-2 border-l-[#DA1E28]">
            <div className="text-[10px] font-mono font-bold text-[#FA4D56]">
              01 • OBSERVABILITY
            </div>
            <h3 className="text-xs font-semibold uppercase text-[#F4F4F4] font-mono">Observe</h3>
            <p className="text-[11px] text-[#C6C6C6] leading-relaxed">
              Ingests real-time signals, P99 latency anomalies, DB connection pool saturation, and canary deployment markers.
            </p>
          </div>

          {/* Card 2: Recall */}
          <div className="carbon-panel p-4 space-y-2 border-l-2 border-l-[#0F62FE]">
            <div className="text-[10px] font-mono font-bold text-[#78A9FF]">
              02 • MEMORY RETRIEVAL
            </div>
            <h3 className="text-xs font-semibold uppercase text-[#F4F4F4] font-mono">Recall & Reflect</h3>
            <p className="text-[11px] text-[#C6C6C6] leading-relaxed">
              Hindsight searches organizational memory to identify previous root causes and warn against repeated failed attempts.
            </p>
          </div>

          {/* Card 3: Learn */}
          <div className="carbon-panel p-4 space-y-2 border-l-2 border-l-[#24A148]">
            <div className="text-[10px] font-mono font-bold text-[#42be65]">
              03 • ACCUMULATION
            </div>
            <h3 className="text-xs font-semibold uppercase text-[#F4F4F4] font-mono">Retain & Inoculate</h3>
            <p className="text-[11px] text-[#C6C6C6] leading-relaxed">
              Every resolved incident commits its validated remediation procedure into memory so systems never repeat a mistake.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenConsole();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Open Incident Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              onLaunchJuryMode();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xs bg-[#262626] hover:bg-[#333333] border border-[#393939] hover:border-[#525252] text-[#F4F4F4] font-medium text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#4589FF]" />
            <span>Jury Walkthrough (60s)</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onExploreMemory();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xs bg-[#161616] hover:bg-[#262626] border border-[#393939] text-[#C6C6C6] hover:text-[#F4F4F4] font-mono text-xs transition-colors cursor-pointer"
          >
            Explore Memory Bank
          </button>
        </div>
      </div>
    </div>
  );
};
