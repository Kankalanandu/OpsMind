import React from 'react';
import { 
  Plus, 
  Sparkles, 
  MessageSquareCode,
  Search,
  CheckCircle2,
  Database
} from 'lucide-react';
import { HindsightStatus } from '../types/index.ts';

interface HeaderProps {
  hindsightStatus: HindsightStatus | null;
  onOpenNewIncident: () => void;
  onOpenJuryMode: () => void;
  onOpenAskOpsMind: () => void;
  onOpenHindsightStatus: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hindsightStatus,
  onOpenNewIncident,
  onOpenJuryMode,
  onOpenAskOpsMind,
  onOpenHindsightStatus,
  onOpenCommandPalette
}) => {
  const isConnected = hindsightStatus?.connected;

  return (
    <header className="h-12 border-b border-[#393939] bg-[#161616] px-4 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Environment & Operations Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#24a148]" />
          <span className="font-semibold text-[#F4F4F4] tracking-wide">PRODUCTION</span>
          <span className="text-[#6F6F6F]">/</span>
          <span className="text-[#8D8D8D]">us-east-1</span>
        </div>

        <div className="h-4 w-px bg-[#393939] hidden sm:block" />

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#C6C6C6]">
          <span className="text-[11px] font-mono text-[#8D8D8D]">CLUSTER:</span>
          <span className="font-mono text-xs text-[#F4F4F4]">core-k8s-mesh-01</span>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1 rounded-sm bg-[#262626] border border-[#393939] hover:border-[#525252] text-xs text-[#8D8D8D] hover:text-[#C6C6C6] transition-colors w-64 justify-start font-mono"
        >
          <Search className="w-3.5 h-3.5 text-[#8D8D8D]" />
          <span>Search incidents, memory...</span>
        </button>
      </div>

      {/* Right: Technical Actions */}
      <div className="flex items-center gap-2">
        {/* Memory Connection Status */}
        <button
          onClick={onOpenHindsightStatus}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono bg-[#262626] hover:bg-[#333333] border border-[#393939] text-[#C6C6C6] transition-colors"
          title="Hindsight Memory Bank Status"
        >
          <Database className="w-3.5 h-3.5 text-[#4589FF]" />
          <span className="hidden sm:inline">{isConnected ? 'Hindsight Live' : 'Demo Memory'}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#24A148]' : 'bg-[#F1C21B]'}`} />
        </button>

        {/* Ask OpsMind */}
        <button
          onClick={onOpenAskOpsMind}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium text-[#C6C6C6] hover:text-[#F4F4F4] hover:bg-[#262626] border border-transparent hover:border-[#393939] transition-colors"
        >
          <MessageSquareCode className="w-3.5 h-3.5 text-[#4589FF]" />
          <span className="hidden sm:inline">Ask OpsMind</span>
        </button>

        {/* Jury Mode Walkthrough */}
        <button
          onClick={onOpenJuryMode}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#4589FF]/10 hover:bg-[#4589FF]/20 text-[#78A9FF] border border-[#4589FF]/40 text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#4589FF]" />
          <span>Jury Mode</span>
        </button>

        {/* New Incident Action */}
        <button
          onClick={onOpenNewIncident}
          className="flex items-center gap-1 px-3 py-1 rounded-sm bg-[#0F62FE] hover:bg-[#0353E9] active:bg-[#0043CE] text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2]" />
          <span>New Incident</span>
        </button>
      </div>
    </header>
  );
};
